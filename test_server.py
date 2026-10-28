import json
import unittest
from unittest.mock import patch

from server import REQUESTS_BY_CLIENT, EmailConfigurationError, EmailDeliveryError, ResendSettings, app, build_email, load_resend_settings, resend_http_diagnostics, send_submission, validate_submission


class SurveyEmailTests(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        REQUESTS_BY_CLIENT.clear()
        self.settings = ResendSettings(
            api_key="re_test_key",
            sender="survey@example.com",
            recipient="organiser@example.com",
        )

    def test_builds_email_for_selected_activity(self):
        message = build_email(
            {"language": "en", "activity": "camden", "preference": "first", "timing": "weekend"},
            self.settings,
        )

        self.assertEqual(message["to"], ["organiser@example.com"])
        self.assertEqual(message["from"], "survey@example.com")
        self.assertIn("Camden Market", message["text"])
        self.assertIn("A weekend", message["text"])

    def test_builds_lithuanian_email(self):
        message = build_email(
            {"language": "lt", "activity": "draughts", "preference": "second", "timing": "weekday"},
            self.settings,
        )

        self.assertIn("Naujas Londono", message["subject"])
        self.assertIn("Strateginio iššūkio", message["text"])
        self.assertIn("Darbo dienos vakarą", message["text"])

    def test_rejects_unknown_choices(self):
        with self.assertRaises(ValueError):
            validate_submission({"language": "en", "activity": "external", "preference": "first", "timing": "weekend"})

    @patch.dict("os.environ", {}, clear=True)
    def test_reports_exact_missing_resend_settings(self):
        with self.assertRaises(EmailConfigurationError) as caught:
            load_resend_settings()

        self.assertEqual(
            caught.exception.missing_variables,
            ("RESEND_API_KEY", "RESEND_FROM_EMAIL", "SURVEY_TO_EMAIL"),
        )
        self.assertNotIn("password", str(caught.exception).lower())

    def test_classifies_resend_api_failures(self):
        self.assertEqual(resend_http_diagnostics(401)[0], "resend_api_key_rejected")
        self.assertEqual(resend_http_diagnostics(422)[0], "resend_sender_unverified")

    def test_classifies_resend_test_recipient_403_without_leaking_address(self):
        response = json.dumps({
            "name": "validation_error",
            "message": "You can only send testing emails to your own email address (secret@yahoo.com).",
        }).encode("utf-8")

        error_code, details, provider_error = resend_http_diagnostics(403, response)

        self.assertEqual(error_code, "resend_test_recipient_restricted")
        self.assertEqual(provider_error, "validation_error")
        self.assertIn("Verify a sender domain", details)
        self.assertNotIn("secret@yahoo.com", details)

    def test_classifies_unverified_resend_domain(self):
        response = json.dumps({
            "name": "validation_error",
            "message": "The example.com domain is not verified. Please add and verify your domain.",
        }).encode("utf-8")

        error_code, details, provider_error = resend_http_diagnostics(403, response)

        self.assertEqual(error_code, "resend_domain_unverified")
        self.assertEqual(provider_error, "validation_error")
        self.assertIn("RESEND_FROM_EMAIL", details)

    def test_classifies_unrecognized_resend_403_without_claiming_permission_error(self):
        response = json.dumps({"name": "some_new_error", "message": "A new restriction."}).encode("utf-8")

        error_code, _details, provider_error = resend_http_diagnostics(403, response)

        self.assertEqual(error_code, "resend_forbidden")
        self.assertEqual(provider_error, "some_new_error")

    def test_ignores_client_supplied_recipient(self):
        message = build_email(
            {"language": "en", "activity": "bounce", "preference": "third", "timing": "flexible", "recipient": "attacker@example.com"},
            self.settings,
        )

        self.assertEqual(message["To"], "organiser@example.com")

    @patch.dict("os.environ", {"RESEND_API_KEY": "re_test_key", "RESEND_FROM_EMAIL": "survey@example.com", "SURVEY_TO_EMAIL": "organiser@example.com"}, clear=True)
    @patch("server.urlopen")
    def test_sends_valid_response_through_resend_api(self, urlopen_mock):
        response = urlopen_mock.return_value.__enter__.return_value
        response.status = 201

        send_submission({"language": "en", "activity": "bounce", "preference": "second", "timing": "weekend"})

        request = urlopen_mock.call_args.args[0]
        self.assertEqual(request.full_url, "https://api.resend.com/emails")
        self.assertEqual(request.get_header("Authorization"), "Bearer re_test_key")
        email_payload = json.loads(request.data)
        self.assertEqual(email_payload["to"], ["organiser@example.com"])
        self.assertIn("Bounce", email_payload["text"])

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

    @patch("server.send_submission", side_effect=EmailConfigurationError(
        "Required Resend settings are missing.", missing_variables=("RESEND_API_KEY",)
    ))
    def test_submission_endpoint_identifies_missing_resend_variable(self, _send_submission_mock):
        response = app.test_client().post(
            "/api/submissions",
            json={"language": "en", "activity": "bounce", "preference": "first", "timing": "weekend"},
        )

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json["missing_variables"], ["RESEND_API_KEY"])
        self.assertNotIn("re_test_key", response.get_data(as_text=True))

    @patch("server.send_submission", side_effect=EmailDeliveryError("resend_api_key_rejected", "Resend rejected the API key.", 401))
    def test_submission_endpoint_reports_safe_resend_diagnostic(self, _send_submission_mock):
        response = app.test_client().post(
            "/api/submissions",
            json={"language": "en", "activity": "bounce", "preference": "first", "timing": "weekend"},
        )

        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.json["error_code"], "resend_api_key_rejected")
        self.assertEqual(response.json["provider_status"], 401)
        self.assertNotIn("re_test_key", response.get_data(as_text=True))

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
