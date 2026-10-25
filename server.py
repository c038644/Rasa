from __future__ import annotations

import os
import smtplib
import ssl
import time
from collections import deque
from dataclasses import dataclass
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path
from threading import Lock
from typing import Any

from flask import Flask, abort, jsonify, make_response, request, send_from_directory
from werkzeug.middleware.proxy_fix import ProxyFix


BASE_DIR = Path(__file__).resolve().parent
MAX_BODY_BYTES = 16_384
STATIC_FILES = {"app.js", "styles.css"}
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


class MailConfigurationError(Exception):
    pass


@dataclass(frozen=True)
class SMTPSettings:
    host: str
    port: int
    sender: str
    recipient: str
    username: str | None
    password: str | None
    use_ssl: bool
    starttls: bool


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


def load_smtp_settings() -> SMTPSettings:
    host = os.environ.get("SMTP_HOST", "").strip()
    sender = os.environ.get("SMTP_FROM_EMAIL", "").strip()
    recipient = os.environ.get("SURVEY_TO_EMAIL", "").strip()
    if not host or not sender or not recipient:
        raise MailConfigurationError("SMTP_HOST, SMTP_FROM_EMAIL and SURVEY_TO_EMAIL must be configured")

    try:
        port = int(os.environ.get("SMTP_PORT", "587"))
    except ValueError as error:
        raise MailConfigurationError("SMTP_PORT must be a number") from error

    username = os.environ.get("SMTP_USERNAME", "").strip() or None
    password = os.environ.get("SMTP_PASSWORD", "") or None
    if bool(username) != bool(password):
        raise MailConfigurationError("Set both SMTP_USERNAME and SMTP_PASSWORD, or neither")

    use_ssl = os.environ.get("SMTP_USE_SSL", "0").lower() in {"1", "true", "yes"}
    starttls = os.environ.get("SMTP_STARTTLS", "1").lower() in {"1", "true", "yes"}
    return SMTPSettings(host, port, sender, recipient, username, password, use_ssl, starttls)


def build_email(payload: Any, settings: SMTPSettings) -> EmailMessage:
    submission = validate_submission(payload)
    language = submission["language"]
    activity = submission["activity"]
    preference_index = {"first": 0, "second": 1, "third": 2}[submission["preference"]]
    labels = {
        "en": {"subject": "New London social activity choice", "activity": "Activity", "preference": "What they enjoy", "timing": "When", "language": "Survey language"},
        "lt": {"subject": "Naujas Londono socialinės veiklos pasirinkimas", "activity": "Veikla", "preference": "Pageidavimai", "timing": "Kada", "language": "Apklausos kalba"},
    }[language]

    message = EmailMessage()
    message["Subject"] = labels["subject"]
    message["From"] = settings.sender
    message["To"] = settings.recipient
    message.set_content(
        "\n".join(
            [
                f"{labels['activity']}: {ACTIVITIES[activity][language]}",
                f"{labels['preference']}: {PREFERENCES[activity][language][preference_index]}",
                f"{labels['timing']}: {TIMES[language][submission['timing']]}",
                f"{labels['language']}: {language}",
                f"Submitted (UTC): {datetime.now(timezone.utc).isoformat(timespec='seconds')}",
            ]
        )
    )
    return message


def send_submission(payload: Any) -> None:
    settings = load_smtp_settings()
    message = build_email(payload, settings)
    if settings.use_ssl:
        client = smtplib.SMTP_SSL(settings.host, settings.port, timeout=15, context=ssl.create_default_context())
    else:
        client = smtplib.SMTP(settings.host, settings.port, timeout=15)

    with client as smtp:
        if settings.starttls and not settings.use_ssl:
            smtp.starttls(context=ssl.create_default_context())
        if settings.username and settings.password:
            smtp.login(settings.username, settings.password)
        smtp.send_message(message)


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
    except MailConfigurationError:
        return jsonify(error="Email delivery is not configured"), 503
    except (OSError, smtplib.SMTPException):
        app.logger.exception("Survey email delivery failed")
        return jsonify(error="Email delivery failed"), 502

    return jsonify(status="sent"), 200


def main() -> None:
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "4173"))
    app.run(host=host, port=port, debug=False)


if __name__ == "__main__":
    main()
