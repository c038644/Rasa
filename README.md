# Common Ground Survey

A bilingual (English and Lithuanian) London social-activity survey. The Flask API accepts completed choices and sends them to the organiser by SMTP. It can serve the static files for local preview or run behind Gunicorn on Render.

## Run locally

Configure these environment variables in the same PowerShell terminal used to start the server:

```powershell
$env:SURVEY_TO_EMAIL = "organiser@example.com"
$env:SMTP_HOST = "smtp.example.com"
$env:SMTP_PORT = "587"
$env:SMTP_FROM_EMAIL = "survey@example.com"
$env:SMTP_USERNAME = "survey@example.com"
$env:SMTP_PASSWORD = "set-this-in-your-local-terminal"
python server.py
```

The local Flask preview listens on `http://127.0.0.1:4173`. Port 587 uses STARTTLS by default. For an SMTP provider using implicit TLS on port 465, set `SMTP_PORT=465` and `SMTP_USE_SSL=1`. `SMTP_USERNAME` and `SMTP_PASSWORD` must either both be set or both be omitted.

## Render Web Service

Set the service root directory to `Website`.

- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn --bind 0.0.0.0:$PORT server:app`

Add the SMTP variables above to Render's environment settings. For a GitHub Pages frontend, set `FRONTEND_ORIGIN` to its exact origin, such as `https://your-account.github.io`, and set the `survey-api-base-url` meta tag in `index.html` to the Render service URL. Leave the meta tag empty when the Flask service also serves the frontend.

Do not commit SMTP credentials. Configure the equivalent environment variables in the hosting platform before deployment. The API limits request size, validates choice identifiers, rate-limits submissions by client address, and only sends to the configured organiser address. CORS allows only the configured frontend origin.

## Tests

```powershell
python -m unittest discover -s . -p "test_*.py"
```
