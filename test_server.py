import json
import unittest
from unittest.mock import patch

from server import REQUESTS_BY_CLIENT, EmailConfigurationError, EmailDeliveryError, ResendSettings, app, build_email, load_resend_settings, resend_http_diagnostics, sanitize_provider_message, send_submission, validate_submission


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
            {"language": "en", "activity": "drinks", "preference": "first", "timing": "weekend", "comments": ["Quiet place, please", "Art and travel", "No peanuts"]},
            self.settings,
        )

        self.assertEqual(message["to"], ["organiser@example.com"])
        self.assertEqual(message["from"], "survey@example.com")
        self.assertIn("After-work drinks", message["text"])
        self.assertIn("A weekend", message["text"])
        self.assertIn("Quiet place, please", message["text"])
        self.assertIn("Art and travel", message["text"])
        self.assertIn("No peanuts", message["text"])

    def test_builds_lithuanian_email(self):
        message = build_email(
            {"language": "lt", "activity": "citybreak", "preference": "second", "timing": "weekday"},
            self.settings,
        )

        self.assertIn("Naujas pasimatymo", message["subject"])
        self.assertIn("Paryžius", message["text"])
        self.assertIn("Darbo dienos vakarą", message["text"])

    def test_requires_exactly_three_bounded_comment_fields(self):
        valid_payload = {"language": "en", "activity": "drinks", "preference": "first", "timing": "weekend", "comments": ["", "", ""]}
        self.assertEqual(validate_submission(valid_payload)["comments"], ["", "", ""])

        with self.assertRaises(ValueError):
            validate_submission({**valid_payload, "comments": ["one"]})
        with self.assertRaises(ValueError):
            validate_submission({**valid_payload, "comments": ["x" * 501, "", ""]})

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

    def test_classifies_domain_restricted_api_key(self):
        response = json.dumps({
            "error": {
                "type": "validation_error",
                "message": "API key is restricted to domain other.example and cannot send from mail.example.eu.",
            }
        }).encode("utf-8")

        error_code, details, provider_error = resend_http_diagnostics(403, response)

        self.assertEqual(error_code, "resend_api_key_domain_mismatch")
        self.assertEqual(provider_error, "validation_error")
        self.assertIn("RESEND_FROM_EMAIL", details)

    def test_sanitizes_provider_message_without_losing_reason(self):
        response = json.dumps({
            "message": "Domain mail.example.eu is not verified for person@yahoo.com using re_secretValue123.",
        }).encode("utf-8")

        message = sanitize_provider_message(response)

        self.assertIn("mail.example.eu is not verified", message)
        self.assertIn("[email]", message)
        self.assertIn("[api-key]", message)
        self.assertNotIn("person@yahoo.com", message)
        self.assertNotIn("re_secretValue123", message)

    def test_sanitizes_plain_text_provider_message(self):
        message = sanitize_provider_message(b"Domain denied for person@yahoo.com; key re_secretValue123.")

        self.assertIn("Domain denied", message)
        self.assertIn("[email]", message)
        self.assertIn("[api-key]", message)

    def test_ignores_client_supplied_recipient(self):
        message = build_email(
            {"language": "en", "activity": "drinks", "preference": "third", "timing": "flexible", "recipient": "attacker@example.com"},
            self.settings,
        )

        self.assertEqual(message["to"], ["organiser@example.com"])

    @patch.dict("os.environ", {"RESEND_API_KEY": "re_test_key", "RESEND_FROM_EMAIL": "survey@example.com", "SURVEY_TO_EMAIL": "organiser@example.com"}, clear=True)
    @patch("server.urlopen")
    def test_sends_valid_response_through_resend_api(self, urlopen_mock):
        response = urlopen_mock.return_value.__enter__.return_value
        response.status = 201

        send_submission({"language": "en", "activity": "badminton", "preference": "second", "timing": "weekend", "comments": ["", "", "Bring rackets"]})

        request = urlopen_mock.call_args.args[0]
        self.assertEqual(request.full_url, "https://api.resend.com/emails")
        self.assertEqual(request.get_header("Authorization"), "Bearer re_test_key")
        self.assertEqual(request.get_header("User-agent"), "common-ground-survey/1.0 (+https://github.com/c038644/Rasa)")
        email_payload = json.loads(request.data)
        self.assertEqual(email_payload["to"], ["organiser@example.com"])
        self.assertIn("badminton", email_payload["text"].lower())
        self.assertIn("Bring rackets", email_payload["text"])

    @patch("server.send_submission")
    def test_submission_endpoint_sends_valid_choices(self, send_submission_mock):
        response = app.test_client().post(
            "/api/submissions",
            json={"language": "en", "activity": "badminton", "preference": "second", "timing": "weekend", "comments": ["A relaxed pace", "", ""]},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"status": "sent"})
        send_submission_mock.assert_called_once_with(
            {"language": "en", "activity": "badminton", "preference": "second", "timing": "weekend", "comments": ["A relaxed pace", "", ""]}
        )

    def test_submission_endpoint_rejects_invalid_choices(self):
        response = app.test_client().post(
            "/api/submissions",
            json={"language": "en", "activity": "invalid", "preference": "first", "timing": "weekend", "comments": ["", "", ""]},
        )

        self.assertEqual(response.status_code, 400)

    @patch("server.send_submission", side_effect=EmailConfigurationError(
        "Required Resend settings are missing.", missing_variables=("RESEND_API_KEY",)
    ))
    def test_submission_endpoint_identifies_missing_resend_variable(self, _send_submission_mock):
        response = app.test_client().post(
            "/api/submissions",
            json={"language": "en", "activity": "drinks", "preference": "first", "timing": "weekend", "comments": ["", "", ""]},
        )

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json["missing_variables"], ["RESEND_API_KEY"])
        self.assertNotIn("re_test_key", response.get_data(as_text=True))

    @patch("server.send_submission", side_effect=EmailDeliveryError(
        "resend_forbidden", "Resend denied the request.", 403, "unrecognized_403", "Domain [email] is not verified."
    ))
    def test_submission_endpoint_reports_safe_resend_diagnostic(self, _send_submission_mock):
        response = app.test_client().post(
            "/api/submissions",
            json={"language": "en", "activity": "drinks", "preference": "first", "timing": "weekend", "comments": ["", "", ""]},
        )

        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.json["error_code"], "resend_forbidden")
        self.assertEqual(response.json["provider_status"], 403)
        self.assertEqual(response.json["provider_error"], "unrecognized_403")
        self.assertEqual(response.json["provider_message"], "Domain [email] is not verified.")
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
