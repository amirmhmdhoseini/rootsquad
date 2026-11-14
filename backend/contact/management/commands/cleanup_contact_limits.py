from django.core.management.base import BaseCommand
from django.utils import timezone

from contact.models import SubmissionLimit


class Command(BaseCommand):
    help = "Delete expired contact rate-limit counters; preserve contact messages."

    def handle(self, *args, **options):
        deleted, _ = SubmissionLimit.objects.filter(expires_at__lte=timezone.now()).delete()
        self.stdout.write(f"Deleted {deleted} expired counters.")
