from __future__ import annotations

import json
import os
import smtplib
import ssl
import time
from collections import deque
from dataclasses import dataclass
from datetime import datetime, timezone
from email.message import EmailMessage
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Lock
from typing import Any
from urllib.parse import urlsplit


BASE_DIR = Path(__file__).resolve().parent
MAX_BODY_BYTES = 16_384
RATE_WINDOW_SECONDS = 60
RATE_LIMIT = 10
REQUESTS_BY_CLIENT: dict[str, deque[float]] = {}
REQUESTS_LOCK = Lock()

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


class SurveyRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def _send_json(self, status: int, payload: dict[str, str]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self) -> None:
        if urlsplit(self.path).path != "/api/submissions":
            self._send_json(404, {"error": "Not found"})
            return
        if is_rate_limited(self.client_address[0]):
            self._send_json(429, {"error": "Too many submissions. Please try again later."})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self._send_json(400, {"error": "Invalid request"})
            return
        if content_length <= 0 or content_length > MAX_BODY_BYTES:
            self._send_json(413, {"error": "Invalid request size"})
            return

        try:
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
            submission = validate_submission(payload)
        except (UnicodeDecodeError, json.JSONDecodeError, ValueError):
            self._send_json(400, {"error": "Invalid survey choices"})
            return

        try:
            send_submission(submission)
        except MailConfigurationError:
            self._send_json(503, {"error": "Email delivery is not configured"})
            return
        except (OSError, smtplib.SMTPException) as error:
            self.log_error("Survey email delivery failed: %s", error)
            self._send_json(502, {"error": "Email delivery failed"})
            return

        self._send_json(200, {"status": "sent"})


def main() -> None:
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "4173"))
    server = ThreadingHTTPServer((host, port), SurveyRequestHandler)
    print(f"Serving the survey on http://{host}:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Stopping survey server")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
