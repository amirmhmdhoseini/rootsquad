from django.db import models


class ContactMessage(models.Model):
    name = models.CharField("نام", max_length=120)
    email = models.EmailField("ایمیل", max_length=254)
    project = models.TextField("شرح پروژه", max_length=5000)
    created_at = models.DateTimeField("زمان دریافت", auto_now_add=True, db_index=True)
    is_read = models.BooleanField("بررسی‌شده", default=False, db_index=True)

    class Meta:
        ordering = ["-created_at", "-pk"]
        verbose_name = "پیام تماس"
        verbose_name_plural = "پیام‌های تماس"

    def __str__(self):
        return self.name


class SubmissionLimit(models.Model):
    """Shared counters containing an HMAC of IP/window instead of raw IPs."""

    key = models.CharField(max_length=64, primary_key=True)
    count = models.PositiveIntegerField(default=0)
    expires_at = models.DateTimeField(db_index=True)
