import ipaddress
import time
from datetime import datetime, timezone

from django.conf import settings
from django.db.models import F
from django.utils.crypto import salted_hmac

from .models import SubmissionLimit


def client_ip(request):
    """Only accept Nginx's overwritten X-Real-IP from a configured peer."""
    peer = request.META.get("REMOTE_ADDR", "")
    candidate = request.META.get("HTTP_X_REAL_IP", "") if peer in settings.CONTACT_TRUSTED_PROXIES else peer
    try:
        return str(ipaddress.ip_address(candidate))
    except ValueError:
        return peer or "unknown"


def consume_submission(request):
    now = int(time.time())
    window = settings.CONTACT_RATE_WINDOW
    end = (now // window + 1) * window
    key = salted_hmac(
        "contact.submission", f"{client_ip(request)}:{now // window}", algorithm="sha256",
    ).hexdigest()
    SubmissionLimit.objects.get_or_create(
        key=key, defaults={"expires_at": datetime.fromtimestamp(end, tz=timezone.utc)},
    )
    # One conditional SQL UPDATE: workers cannot both consume the final slot.
    accepted = SubmissionLimit.objects.filter(key=key, count__lt=settings.CONTACT_RATE_LIMIT).update(count=F("count") + 1)
    return bool(accepted), max(1, end - now)
