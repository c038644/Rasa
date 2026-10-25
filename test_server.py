import unittest
from unittest.mock import patch

from server import REQUESTS_BY_CLIENT, MailConfigurationError, SMTPSettings, app, build_email, load_smtp_settings, send_submission, validate_submission


class SurveyEmailTests(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        REQUESTS_BY_CLIENT.clear()
        self.settings = SMTPSettings(
            host="smtp.example.com",
            port=587,
            sender="survey@example.com",
            recipient="organiser@example.com",
            username=None,
            password=None,
            use_ssl=False,
            starttls=True,
        )

    def test_builds_email_for_selected_activity(self):
        message = build_email(
            {"language": "en", "activity": "camden", "preference": "first", "timing": "weekend"},
            self.settings,
        )

        self.assertEqual(message["To"], "organiser@example.com")
        self.assertIn("Camden Market", message.get_content())
        self.assertIn("A weekend", message.get_content())

    def test_builds_lithuanian_email(self):
        message = build_email(
            {"language": "lt", "activity": "draughts", "preference": "second", "timing": "weekday"},
            self.settings,
        )

        self.assertIn("Naujas Londono", message["Subject"])
        self.assertIn("Strateginio iššūkio", message.get_content())
        self.assertIn("Darbo dienos vakarą", message.get_content())

    def test_rejects_unknown_choices(self):
        with self.assertRaises(ValueError):
            validate_submission({"language": "en", "activity": "external", "preference": "first", "timing": "weekend"})

    @patch.dict("os.environ", {}, clear=True)
    def test_reports_exact_missing_required_mail_settings(self):
        with self.assertRaises(MailConfigurationError) as caught:
            load_smtp_settings()

        self.assertEqual(
            caught.exception.missing_variables,
            ("SMTP_HOST", "SMTP_FROM_EMAIL", "SURVEY_TO_EMAIL"),
        )
        self.assertNotIn("password", str(caught.exception).lower())

    @patch.dict("os.environ", {"SMTP_HOST": "smtp.example.com", "SMTP_FROM_EMAIL": "survey@example.com", "SURVEY_TO_EMAIL": "organiser@example.com", "SMTP_USERNAME": "survey@example.com"}, clear=True)
    def test_reports_missing_password_without_exposing_credentials(self):
        with self.assertRaises(MailConfigurationError) as caught:
            load_smtp_settings()

        self.assertEqual(caught.exception.missing_variables, ("SMTP_PASSWORD",))
        self.assertNotIn("survey@example.com", str(caught.exception))

    def test_ignores_client_supplied_recipient(self):
        message = build_email(
            {"language": "en", "activity": "bounce", "preference": "third", "timing": "flexible", "recipient": "attacker@example.com"},
            self.settings,
        )

        self.assertEqual(message["To"], "organiser@example.com")

    @patch("server.load_smtp_settings")
    @patch("server.smtplib.SMTP")
    def test_sends_valid_response_through_configured_smtp(self, smtp_factory, settings_loader):
        settings_loader.return_value = self.settings
        smtp = smtp_factory.return_value.__enter__.return_value

        send_submission({"language": "en", "activity": "bounce", "preference": "second", "timing": "weekend"})

        smtp_factory.assert_called_once_with(self.settings.host, self.settings.port, timeout=15)
        smtp.starttls.assert_called_once()
        sent_message = smtp.send_message.call_args.args[0]
        self.assertEqual(sent_message["To"], self.settings.recipient)
        self.assertIn("Bounce", sent_message.get_content())

    @patch("server.send_submission")
    def test_submission_endpoint_sends_valid_choices(self, send_submission_mock):
        response = app.test_client().post(
            "/api/submissions",
            json={"language": "en", "activity": "camden", "preference": "second", "timing": "weekend"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"status": "sent"})
        send_submission_mock.assert_called_once_with(
            {"language": "en", "activity": "camden", "preference": "second", "timing": "weekend"}
        )

    def test_submission_endpoint_rejects_invalid_choices(self):
        response = app.test_client().post(
            "/api/submissions",
            json={"language": "en", "activity": "invalid", "preference": "first", "timing": "weekend"},
        )

        self.assertEqual(response.status_code, 400)

    @patch("server.send_submission", side_effect=MailConfigurationError(
        "Required email settings are missing.", missing_variables=("SURVEY_TO_EMAIL",)
    ))
    def test_submission_endpoint_identifies_missing_mail_variable(self, _send_submission_mock):
        response = app.test_client().post(
            "/api/submissions",
            json={"language": "en", "activity": "bounce", "preference": "first", "timing": "weekend"},
        )

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json["missing_variables"], ["SURVEY_TO_EMAIL"])
        self.assertNotIn("SMTP_PASSWORD", response.get_data(as_text=True))

    def test_submission_endpoint_allows_only_configured_origin(self):
        with patch.dict("os.environ", {"FRONTEND_ORIGIN": "https://example.github.io"}):
            allowed = app.test_client().options(
                "/api/submissions",
                headers={"Origin": "https://example.github.io"},
            )
            same_origin = app.test_client().options(
                "/api/submissions",
                base_url="https://survey.onrender.com",
                headers={"Origin": "https://survey.onrender.com"},
            )
            rejected = app.test_client().options(
                "/api/submissions",
                headers={"Origin": "https://other.example"},
            )

        self.assertEqual(allowed.status_code, 204)
        self.assertEqual(allowed.headers["Access-Control-Allow-Origin"], "https://example.github.io")
        self.assertEqual(same_origin.status_code, 204)
        self.assertEqual(same_origin.headers["Access-Control-Allow-Origin"], "https://survey.onrender.com")
        self.assertEqual(rejected.status_code, 403)


if __name__ == "__main__":
    unittest.main()
