from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.test import TestCase

from contact.models import ContactMessage


class MessageAdminTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.admin = get_user_model().objects.create_superuser("owner", "owner@example.com", "test-password-only")
        cls.message = ContactMessage.objects.create(
            name="<script>alert(1)</script>", email="client@example.com", project="<script>alert(2)</script>",
        )

    def test_anonymous_visitors_cannot_read_admin_messages(self):
        response = self.client.get("/admin/contact/contactmessage/")
        self.assertEqual(response.status_code, 302)
        self.assertIn("/admin/login/", response.url)

    def test_non_staff_user_cannot_read_admin_messages(self):
        user = get_user_model().objects.create_user("visitor", password="test-only")
        self.client.force_login(user)
        self.assertEqual(self.client.get("/admin/contact/contactmessage/").status_code, 302)

    def test_submitted_content_is_escaped_in_admin(self):
        self.client.force_login(self.admin)
        response = self.client.get(f"/admin/contact/contactmessage/{self.message.pk}/change/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "&lt;script&gt;alert(2)&lt;/script&gt;")
        self.assertNotContains(response, "<script>alert(2)</script>")

    def test_admin_can_mark_message_read_but_cannot_rewrite_submitted_content(self):
        self.client.force_login(self.admin)
        response = self.client.post(f"/admin/contact/contactmessage/{self.message.pk}/change/", {
            "is_read": "on", "name": "Changed", "email": "changed@example.com", "project": "Changed content",
        })
        self.assertEqual(response.status_code, 302)
        self.message.refresh_from_db()
        self.assertTrue(self.message.is_read)
        self.assertEqual(self.message.name, "<script>alert(1)</script>")
        self.assertEqual(self.message.email, "client@example.com")
        self.assertEqual(self.message.project, "<script>alert(2)</script>")

    def test_bulk_actions_update_read_status(self):
        self.client.force_login(self.admin)
        for action, expected in [("mark_read", True), ("mark_unread", False)]:
            response = self.client.post("/admin/contact/contactmessage/", {
                "action": action, "_selected_action": [self.message.pk],
            })
            self.assertEqual(response.status_code, 302)
            self.message.refresh_from_db()
            self.assertEqual(self.message.is_read, expected)

    def test_view_only_staff_cannot_use_write_actions(self):
        user = get_user_model().objects.create_user("reader", is_staff=True)
        user.user_permissions.add(Permission.objects.get(codename="view_contactmessage"))
        self.client.force_login(user)
        self.client.post("/admin/contact/contactmessage/", {"action": "mark_read", "_selected_action": [self.message.pk]})
        self.message.refresh_from_db()
        self.assertFalse(self.message.is_read)

    def test_admin_search_and_unread_filter(self):
        self.client.force_login(self.admin)
        ContactMessage.objects.create(name="Other", email="other@example.com", project="Another project", is_read=True)
        response = self.client.get("/admin/contact/contactmessage/", {"q": "client@example.com", "is_read__exact": "0"})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "client@example.com")
        self.assertNotContains(response, "other@example.com")

    def test_manual_message_creation_is_disabled(self):
        self.client.force_login(self.admin)
        self.assertEqual(self.client.get("/admin/contact/contactmessage/add/").status_code, 403)
