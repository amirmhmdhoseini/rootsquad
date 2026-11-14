from unittest.mock import patch

from django.apps import apps
from django.conf import settings
from django.core.management import call_command
from django.db import OperationalError
from django.test import Client, TestCase, override_settings
from django.utils import timezone


class ContactAPITests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        self.payload = {
            "name": "  بهار همتی  ",
            "email": "  customer@example.com  ",
            "project": "  برای طراحی یک وب‌سایت شرکتی به راهنمایی نیاز داریم.  ",
        }

    def submit(self, data=None, client=None, **headers):
        client = client or self.client
        csrf = client.get("/api/csrf/")
        self.assertEqual(csrf.status_code, 200)
        return client.post(
            "/api/contact/", self.payload if data is None else data,
            HTTP_X_CSRFTOKEN=csrf.json()["csrfToken"], **headers,
        )

    def messages(self):
        return apps.get_model("contact", "ContactMessage").objects

    def test_valid_message_is_trimmed_and_saved_without_exposing_private_data(self):
        response = self.submit()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {"ok": True})
        message = self.messages().get()
        self.assertEqual(message.name, "بهار همتی")
        self.assertEqual(message.email, "customer@example.com")
        self.assertEqual(message.project, "برای طراحی یک وب‌سایت شرکتی به راهنمایی نیاز داریم.")
        self.assertFalse(message.is_read)
        self.assertIsNotNone(message.created_at)

    def test_urlencoded_form_is_supported(self):
        token = self.client.get("/api/csrf/").json()["csrfToken"]
        response = self.client.post(
            "/api/contact/", "name=Amir&email=amir%40example.com&project=A+new+business+website",
            content_type="application/x-www-form-urlencoded", HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.messages().get().email, "amir@example.com")

    def test_invalid_fields_are_rejected_without_saving(self):
        cases = [
            ("name", ""), ("name", "   "), ("name", "a" * 121),
            ("email", "invalid"), ("email", "a" * 250 + "@example.com"),
            ("project", "short"), ("project", " " * 20), ("project", "a" * 5001),
        ]
        for field, value in cases:
            with self.subTest(field=field, length=len(value)):
                response = self.submit({**self.payload, field: value})
                self.assertEqual(response.status_code, 400)
                self.assertEqual(response.json()["code"], "validation_error")
                self.assertIn(field, response.json()["errors"])
        self.assertEqual(self.messages().count(), 0)

    def test_required_fields_cannot_be_omitted(self):
        response = self.submit({})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(set(response.json()["errors"]), {"name", "email", "project"})

    def test_client_cannot_set_read_status(self):
        self.assertEqual(self.submit({**self.payload, "is_read": "true"}).status_code, 201)
        self.assertFalse(self.messages().get().is_read)

    def test_missing_csrf_is_rejected(self):
        response = self.client.post("/api/contact/", self.payload)
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["code"], "csrf_failed")
        self.assertEqual(self.messages().count(), 0)

    def test_untrusted_origin_is_rejected_even_with_valid_csrf(self):
        response = self.submit(HTTP_ORIGIN="https://untrusted.invalid")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(self.messages().count(), 0)

    def test_csrf_response_is_not_cached_and_cookie_is_httponly(self):
        response = self.client.get("/api/csrf/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("no-store", response["Cache-Control"])
        self.assertTrue(response.cookies[settings.CSRF_COOKIE_NAME]["httponly"])

    def test_public_message_listing_is_not_available(self):
        response = self.client.get("/api/contact/")
        self.assertEqual(response.status_code, 405)

    def test_json_payload_is_rejected(self):
        response = self.submit(self.payload, content_type="application/json")
        self.assertEqual(response.status_code, 415)
        self.assertEqual(self.messages().count(), 0)

    def test_oversized_request_is_rejected(self):
        response = self.submit({**self.payload, "project": "a" * 33000})
        self.assertEqual(response.status_code, 413)
        self.assertEqual(response.json()["code"], "payload_too_large")
        self.assertEqual(self.messages().count(), 0)

    def test_too_many_fields_are_rejected(self):
        response = self.submit({**self.payload, **{f"field{i}": "x" for i in range(12)}})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["code"], "invalid_payload")
        self.assertEqual(self.messages().count(), 0)

    def test_file_upload_is_rejected(self):
        from django.core.files.uploadedfile import SimpleUploadedFile

        response = self.submit({**self.payload, "file": SimpleUploadedFile("test.txt", b"hello")})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.messages().count(), 0)

    def test_duplicate_field_values_are_rejected(self):
        response = self.submit({**self.payload, "email": ["first@example.com", "last@example.com"]})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["code"], "invalid_payload")

    @override_settings(CONTACT_RATE_LIMIT=2)
    def test_limit_is_shared_across_clients_and_returns_retry_after(self):
        self.assertEqual(self.submit().status_code, 201)
        self.assertEqual(self.submit(client=Client(enforce_csrf_checks=True)).status_code, 201)
        response = self.submit(client=Client(enforce_csrf_checks=True))
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.json()["code"], "rate_limited")
        self.assertGreater(int(response["Retry-After"]), 0)
        self.assertEqual(self.messages().count(), 2)

    @override_settings(CONTACT_RATE_LIMIT=1)
    def test_invalid_submissions_also_consume_the_limit(self):
        self.assertEqual(self.submit({}).status_code, 400)
        self.assertEqual(self.submit().status_code, 429)

    @override_settings(CONTACT_RATE_LIMIT=1)
    def test_new_window_allows_another_submission(self):
        with patch("contact.rate_limit.time.time", return_value=1200):
            self.assertEqual(self.submit().status_code, 201)
        with patch("contact.rate_limit.time.time", return_value=1201):
            self.assertEqual(self.submit().status_code, 429)
        with patch("contact.rate_limit.time.time", return_value=1800):
            self.assertEqual(self.submit().status_code, 201)

    @override_settings(CONTACT_RATE_LIMIT=1)
    def test_different_ips_have_independent_limits(self):
        self.assertEqual(self.submit(REMOTE_ADDR="192.0.2.1").status_code, 201)
        self.assertEqual(self.submit(REMOTE_ADDR="192.0.2.2").status_code, 201)

    @override_settings(CONTACT_RATE_LIMIT=1, CONTACT_TRUSTED_PROXIES=[])
    def test_untrusted_forwarded_headers_cannot_bypass_limit(self):
        self.assertEqual(self.submit(HTTP_X_REAL_IP="192.0.2.1").status_code, 201)
        self.assertEqual(self.submit(HTTP_X_REAL_IP="192.0.2.2", HTTP_X_FORWARDED_FOR="192.0.2.3").status_code, 429)

    @override_settings(CONTACT_RATE_LIMIT=1, CONTACT_TRUSTED_PROXIES=["127.0.0.1"])
    def test_trusted_proxy_can_supply_real_client_ip(self):
        self.assertEqual(self.submit(HTTP_X_REAL_IP="192.0.2.1").status_code, 201)
        self.assertEqual(self.submit(HTTP_X_REAL_IP="192.0.2.2").status_code, 201)
        self.assertEqual(self.submit(HTTP_X_REAL_IP="192.0.2.2").status_code, 429)

    @override_settings(CONTACT_RATE_LIMIT=1, CONTACT_TRUSTED_PROXIES=["127.0.0.1"])
    def test_invalid_proxy_ip_falls_back_to_peer(self):
        self.assertEqual(self.submit(HTTP_X_REAL_IP="invalid").status_code, 201)
        self.assertEqual(self.submit(HTTP_X_REAL_IP="also-invalid").status_code, 429)

    def test_limiter_does_not_store_plain_ip_address(self):
        self.submit(REMOTE_ADDR="192.0.2.77")
        row = apps.get_model("contact", "SubmissionLimit").objects.get()
        self.assertNotIn("192.0.2.77", row.key)
        self.assertEqual(len(row.key), 64)

    def test_cleanup_removes_only_expired_limiter_records(self):
        model = apps.get_model("contact", "SubmissionLimit")
        model.objects.create(key="old", expires_at=timezone.now() - timezone.timedelta(hours=1))
        model.objects.create(key="current", expires_at=timezone.now() + timezone.timedelta(hours=1))
        call_command("cleanup_contact_limits", verbosity=0)
        self.assertEqual(list(model.objects.values_list("key", flat=True)), ["current"])

    def test_health_checks_database_and_exposes_no_details(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_health_returns_503_when_database_is_unavailable(self):
        with patch("contact.views.connection.ensure_connection", side_effect=OperationalError("private db error")):
            response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json(), {"status": "unavailable"})

    @override_settings(DEBUG=False)
    def test_api_404_has_a_safe_json_response(self):
        response = self.client.get("/api/missing/")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"code": "not_found"})
