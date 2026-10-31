# Common Ground Survey

A bilingual (English and Lithuanian) London date planner. It collects three date choices and three optional notes, then emails the completed plan to the organiser through Resend's HTTPS API. The Flask API can serve the static files for local preview or run behind Gunicorn on Render.

## Run locally

Configure these environment variables in the same PowerShell terminal used to start the server:

```powershell
$env:SURVEY_TO_EMAIL = "organiser@example.com"
$env:RESEND_API_KEY = "re_your_api_key"
$env:RESEND_FROM_EMAIL = "Common Ground <events@your-verified-domain.com>"
python server.py
```

The local Flask preview listens on `http://127.0.0.1:4173`. Resend sends over HTTPS, so SMTP host, port, username, and password settings are not used. Verify the sender domain in Resend before using its address. Resend's onboarding sender is restricted to test messages for the Resend account owner; it is not a general production sender.

## Render Web Service

Set the service root directory to `Website`.

- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn --bind 0.0.0.0:$PORT server:app`

Add `RESEND_API_KEY` as a secret in Render's environment settings. Add `RESEND_FROM_EMAIL` and `SURVEY_TO_EMAIL` as regular environment variables. For a GitHub Pages frontend, set `FRONTEND_ORIGIN` to its exact origin, such as `https://your-account.github.io`, and set the `survey-api-base-url` meta tag in `index.html` to the Render service URL. Leave the meta tag empty when the Flask service also serves the frontend.

Do not commit the Resend API key. Configure the equivalent environment variables in the hosting platform before deployment. The API limits request size, validates choice identifiers, rate-limits submissions by client address, and only sends to the configured organiser address. CORS allows the configured frontend origin and the API's own origin.

## Tests

```powershell
python -m unittest discover -s . -p "test_*.py"
```
