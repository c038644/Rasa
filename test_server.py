import unittest
from unittest.mock import patch

from server import REQUESTS_BY_CLIENT, SMTPSettings, app, build_email, send_submission, validate_submission


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
