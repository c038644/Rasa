# Common Ground Survey

A bilingual (English and Lithuanian) London social-activity survey. Run the Python server to serve the site and accept completed survey choices for delivery to the organiser by SMTP.

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

The server listens on `http://127.0.0.1:4173`. Port 587 uses STARTTLS by default. For an SMTP provider using implicit TLS on port 465, set `SMTP_PORT=465` and `SMTP_USE_SSL=1`. `SMTP_USERNAME` and `SMTP_PASSWORD` must either both be set or both be omitted. `HOST` and `PORT` can override the local bind address and web port.

Do not commit SMTP credentials. Configure the equivalent environment variables in the hosting platform before deployment. The server limits request size, validates choice identifiers, rate-limits submissions by client address, and only sends to the configured organiser address.

## Tests

```powershell
python -m unittest discover -s . -p "test_*.py"
```
