from django.db import models


class ContactMessage(models.Model):
    name = models.CharField("Name", max_length=120)
    email = models.EmailField("Email", max_length=254)
    project = models.TextField("Project description", max_length=5000)
    created_at = models.DateTimeField("Received at", auto_now_add=True, db_index=True)
    is_read = models.BooleanField("Reviewed", default=False, db_index=True)

    class Meta:
        ordering = ["-created_at", "-pk"]
        verbose_name = "contact message"
        verbose_name_plural = "contact messages"

    def __str__(self):
        return self.name


class SubmissionLimit(models.Model):
    """Shared counters containing an HMAC of IP/window instead of raw IPs."""

    key = models.CharField(max_length=64, primary_key=True)
    count = models.PositiveIntegerField(default=0)
    expires_at = models.DateTimeField(db_index=True)
