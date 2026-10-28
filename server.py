from __future__ import annotations

import json
import os
import re
import time
from collections import deque
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from flask import Flask, abort, jsonify, make_response, request, send_from_directory
from werkzeug.middleware.proxy_fix import ProxyFix


BASE_DIR = Path(__file__).resolve().parent
MAX_BODY_BYTES = 16_384
STATIC_FILES = {"app.js", "styles.css"}
RESEND_API_URL = "https://api.resend.com/emails"
RATE_WINDOW_SECONDS = 60
RATE_LIMIT = 10
REQUESTS_BY_CLIENT: dict[str, deque[float]] = {}
REQUESTS_LOCK = Lock()
app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_BODY_BYTES
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

ACTIVITIES = {
    "bounce": {
        "en": "Ping-pong and games at Bounce",
        "lt": "Stalo tenisas ir žaidimai „Bounce“",
    },
    "camden": {
        "en": "Food, stalls and a canal walk at Camden Market",
        "lt": "Maistas, turgus ir pasivaikščiojimas prie kanalo Camden turguje",
    },
    "draughts": {
        "en": "Board games at Draughts",
        "lt": "Stalo žaidimai „Draughts“ klube",
    },
}

PREFERENCES = {
    "bounce": {
        "en": ["Easygoing games and a catch-up", "A little friendly competition", "Add food and drinks"],
        "lt": ["Ramus žaidimas ir pokalbiai", "Draugiškos varžybos", "Maistas ir gėrimai"],
    },
    "camden": {
        "en": ["Sample a few food stalls", "Browse the market together", "Take a canal-side stroll"],
        "lt": ["Paragauti kelių patiekalų", "Kartu apžiūrėti turgų", "Pasivaikščioti palei kanalą"],
    },
    "draughts": {
        "en": ["Light, easy-to-learn games", "A strategic challenge", "Try something completely new"],
        "lt": ["Lengvų, greitai perprantamų žaidimų", "Strateginio iššūkio", "Išbandyti dar nežaistą žaidimą"],
    },
}

TIMES = {
    "en": {"weekday": "A weekday evening", "weekend": "A weekend", "flexible": "I’m flexible"},
    "lt": {"weekday": "Darbo dienos vakarą", "weekend": "Savaitgalį", "flexible": "Laikas nėra svarbus"},
}


class EmailConfigurationError(Exception):
    def __init__(self, message: str, *, missing_variables: tuple[str, ...] = (), invalid_variables: tuple[str, ...] = ()) -> None:
        super().__init__(message)
        self.missing_variables = missing_variables
        self.invalid_variables = invalid_variables


@dataclass(frozen=True)
class ResendSettings:
    api_key: str
    sender: str
    recipient: str


def validate_submission(payload: Any) -> dict[str, str]:
    if not isinstance(payload, dict):
        raise ValueError("Submission must be an object")

    language = payload.get("language")
    activity = payload.get("activity")
    preference = payload.get("preference")
    timing = payload.get("timing")
    if language not in TIMES:
        raise ValueError("Unsupported language")
    if activity not in ACTIVITIES:
        raise ValueError("Unsupported activity")
    if preference not in {"first", "second", "third"}:
        raise ValueError("Unsupported preference")
    if timing not in TIMES[language]:
        raise ValueError("Unsupported timing")
    return {"language": language, "activity": activity, "preference": preference, "timing": timing}


def load_resend_settings() -> ResendSettings:
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    sender = os.environ.get("RESEND_FROM_EMAIL", "").strip()
    recipient = os.environ.get("SURVEY_TO_EMAIL", "").strip()
    missing_variables = tuple(
        variable
        for variable, value in (
            ("RESEND_API_KEY", api_key),
            ("RESEND_FROM_EMAIL", sender),
            ("SURVEY_TO_EMAIL", recipient),
        )
        if not value
    )
    if missing_variables:
        raise EmailConfigurationError("Required Resend settings are missing.", missing_variables=missing_variables)
    return ResendSettings(api_key, sender, recipient)


def build_email(payload: Any, settings: ResendSettings) -> dict[str, Any]:
    submission = validate_submission(payload)
    language = submission["language"]
    activity = submission["activity"]
    preference_index = {"first": 0, "second": 1, "third": 2}[submission["preference"]]
    labels = {
        "en": {"subject": "New London social activity choice", "activity": "Activity", "preference": "What they enjoy", "timing": "When", "language": "Survey language"},
        "lt": {"subject": "Naujas Londono socialinės veiklos pasirinkimas", "activity": "Veikla", "preference": "Pageidavimai", "timing": "Kada", "language": "Apklausos kalba"},
    }[language]
    body = "\n".join(
        [
            f"{labels['activity']}: {ACTIVITIES[activity][language]}",
            f"{labels['preference']}: {PREFERENCES[activity][language][preference_index]}",
            f"{labels['timing']}: {TIMES[language][submission['timing']]}",
            f"{labels['language']}: {language}",
            f"Submitted (UTC): {datetime.now(timezone.utc).isoformat(timespec='seconds')}",
        ]
    )
    return {
        "from": settings.sender,
        "to": [settings.recipient],
        "subject": labels["subject"],
        "text": body,
    }


def send_submission(payload: Any) -> None:
    settings = load_resend_settings()
    payload_json = json.dumps(build_email(payload, settings)).encode("utf-8")
    api_request = Request(
        RESEND_API_URL,
        data=payload_json,
        headers={
            "Authorization": f"Bearer {settings.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "common-ground-survey/1.0 (+https://github.com/c038644/Rasa)",
        },
        method="POST",
    )
    try:
        with urlopen(api_request, timeout=15) as response:
            if not 200 <= response.status < 300:
                raise EmailDeliveryError(
                    "resend_unexpected_response",
                    "Resend returned an unexpected response.",
                    response.status,
                )
    except HTTPError as error:
        response_body = error.read()
        error_code, details, provider_error = resend_http_diagnostics(error.code, response_body)
        provider_message = sanitize_provider_message(response_body)
        raise EmailDeliveryError(error_code, details, error.code, provider_error, provider_message) from error
    except (TimeoutError, URLError, OSError) as error:
        raise EmailDeliveryError(
            "resend_connection_failed",
            "Could not reach Resend over HTTPS. Check Render outbound HTTPS access.",
        ) from error


class EmailDeliveryError(Exception):
    def __init__(self, error_code: str, message: str, http_status: int | None = None, provider_error: str | None = None, provider_message: str | None = None) -> None:
        super().__init__(message)
        self.error_code = error_code
        self.http_status = http_status
        self.provider_error = provider_error
        self.provider_message = provider_message


def sanitize_provider_message(response_body: bytes) -> str | None:
    try:
        response_text = response_body.decode("utf-8")
    except UnicodeDecodeError:
        return None
    try:
        payload = json.loads(response_text)
    except json.JSONDecodeError:
        message = response_text
    else:
        nested_error = payload.get("error") if isinstance(payload, dict) else None
        nested_data = nested_error if isinstance(nested_error, dict) else {}
        message = str(payload.get("message") or nested_data.get("message") or nested_error or "") if isinstance(payload, dict) else response_text
    message = re.sub(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}", "[email]", message, flags=re.IGNORECASE)
    message = re.sub(r"\bre_[A-Za-z0-9_-]+\b", "[api-key]", message)
    message = re.sub(r"[\r\n\t]+", " ", message).strip()
    return message[:300] or None


def resend_http_diagnostics(status: int, response_body: bytes = b"") -> tuple[str, str, str | None]:
    try:
        response_data = json.loads(response_body.decode("utf-8"))
        nested_error = response_data.get("error")
        nested_data = nested_error if isinstance(nested_error, dict) else {}
        provider_message = str(response_data.get("message") or nested_data.get("message") or nested_error or "").lower()
        provider_name = str(
            response_data.get("name")
            or response_data.get("type")
            or response_data.get("code")
            or nested_data.get("name")
            or nested_data.get("type")
            or nested_data.get("code")
            or ""
        ).lower()
    except (UnicodeDecodeError, json.JSONDecodeError, AttributeError, TypeError):
        provider_message = ""
        provider_name = ""
    if not re.fullmatch(r"[a-z0-9_]{1,64}", provider_name):
        provider_name = ""
    safe_provider_name = provider_name or ("unrecognized_403" if status == 403 else None)

    if status == 403:
        if "api key" in provider_message and "domain" in provider_message and any(word in provider_message for word in ("restrict", "allow", "match")):
            return "resend_api_key_domain_mismatch", "The API key is restricted to a different domain. Edit its domain restriction to match RESEND_FROM_EMAIL, or create a Sending access key for the verified sender domain.", safe_provider_name
        if "testing emails to your own email" in provider_message or "onboarding@resend.dev" in provider_message:
            return "resend_test_recipient_restricted", "Resend's test sender can only deliver to the Resend account owner's email. Verify a sender domain to send to other recipients.", safe_provider_name
        if "domain" in provider_message and ("not verified" in provider_message or "verify your domain" in provider_message):
            return "resend_domain_unverified", "The domain in RESEND_FROM_EMAIL is not verified in Resend. Verify it and use an address on that domain.", safe_provider_name
        if "suspended" in provider_message:
            return "resend_api_key_suspended", "Resend suspended this API key. Check the Resend dashboard or contact Resend support.", safe_provider_name
        if "api key is not active" in provider_message:
            return "resend_api_key_inactive", "This Resend API key is inactive. Create or activate a key in the Resend dashboard.", safe_provider_name
        if "scope" in provider_message or "permission" in provider_message or provider_name == "invalid_permission":
            return "resend_permission_denied", "Resend denied this API key's permissions. Check its access settings.", safe_provider_name
        return "resend_forbidden", "Resend denied this request. Check the Resend error type for the specific restriction.", safe_provider_name
    if status == 401:
        return "resend_api_key_rejected", "Resend rejected the API key. Check RESEND_API_KEY.", safe_provider_name
    if status == 422:
        return "resend_sender_unverified", "Resend rejected the sender or recipient. Verify the sender domain and check recipient restrictions.", safe_provider_name
    if status == 429:
        return "resend_rate_limited", "Resend rate-limited the request. Check your account quota and retry later.", safe_provider_name
    if status >= 500:
        return "resend_service_unavailable", "Resend is temporarily unavailable. Retry later.", safe_provider_name
    return "resend_request_rejected", "Resend rejected the request. Check sender configuration and API settings.", safe_provider_name


def is_rate_limited(client_ip: str) -> bool:
    now = time.monotonic()
    with REQUESTS_LOCK:
        for address, requests in list(REQUESTS_BY_CLIENT.items()):
            while requests and now - requests[0] > RATE_WINDOW_SECONDS:
                requests.popleft()
            if not requests:
                del REQUESTS_BY_CLIENT[address]

        requests = REQUESTS_BY_CLIENT.setdefault(client_ip, deque())
        if len(requests) >= RATE_LIMIT:
            return True
        requests.append(now)
        return False


def request_origin_is_allowed() -> bool:
    origin = request.headers.get("Origin")
    if not origin:
        return True
    configured_origin = os.environ.get("FRONTEND_ORIGIN", "").strip().rstrip("/")
    allowed_origins = {request.host_url.rstrip("/")}
    if configured_origin:
        allowed_origins.add(configured_origin)
    return origin.rstrip("/") in allowed_origins


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin and request_origin_is_allowed():
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Vary"] = "Origin"
    if request.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"
    return response


@app.errorhandler(413)
def request_too_large(_error):
    return jsonify(error="Invalid request size"), 413


@app.get("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:filename>")
def static_asset(filename: str):
    if filename not in STATIC_FILES:
        abort(404)
    return send_from_directory(BASE_DIR, filename)


@app.route("/api/submissions", methods=["POST", "OPTIONS"])
def submit_survey():
    if not request_origin_is_allowed():
        return jsonify(error="Origin not allowed"), 403
    if request.method == "OPTIONS":
        return make_response("", 204)
    if is_rate_limited(request.remote_addr or "unknown"):
        return jsonify(error="Too many submissions. Please try again later."), 429

    try:
        submission = validate_submission(request.get_json(silent=True))
    except ValueError:
        return jsonify(error="Invalid survey choices"), 400

    try:
        send_submission(submission)
    except EmailConfigurationError as error:
        app.logger.warning(
            "Email configuration problem; missing=%s invalid=%s",
            ",".join(error.missing_variables) or "none",
            ",".join(error.invalid_variables) or "none",
        )
        return jsonify(
            error="Email delivery is not configured",
            details=str(error),
            missing_variables=error.missing_variables,
            invalid_variables=error.invalid_variables,
        ), 503
    except EmailDeliveryError as error:
        app.logger.warning(
            "Survey email delivery failed: category=%s provider_status=%s provider_error=%s provider_message=%s",
            error.error_code,
            error.http_status,
            error.provider_error or "unknown",
            error.provider_message or "unavailable",
        )
        return jsonify(
            error="Email delivery failed",
            error_code=error.error_code,
            details=str(error),
            provider_status=error.http_status,
            provider_error=error.provider_error,
            provider_message=error.provider_message,
        ), 502

    return jsonify(status="sent"), 200


def main() -> None:
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "4173"))
    app.run(host=host, port=port, debug=False)


if __name__ == "__main__":
    main()
