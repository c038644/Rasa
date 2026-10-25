import unittest
from unittest.mock import patch

from server import SMTPSettings, build_email, send_submission, validate_submission


class SurveyEmailTests(unittest.TestCase):
    def setUp(self):
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


if __name__ == "__main__":
    unittest.main()
