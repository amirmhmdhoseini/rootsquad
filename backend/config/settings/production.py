"""Fail-closed deployment configuration, supplied through the environment."""

import os
from urllib.parse import parse_qs, unquote, urlsplit

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F403

DEBUG = False
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "")
if len(SECRET_KEY) < 50 or len(set(SECRET_KEY)) < 5 or SECRET_KEY.startswith("django-insecure-"):
    raise ImproperlyConfigured("DJANGO_SECRET_KEY must be a strong, private key of at least 50 characters.")

ALLOWED_HOSTS = [host.strip() for host in os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",") if host.strip()]
if not ALLOWED_HOSTS or any("*" in host or "/" in host or any(c.isspace() for c in host) for host in ALLOWED_HOSTS):
    raise ImproperlyConfigured("DJANGO_ALLOWED_HOSTS must contain explicit hostnames, without wildcards or URLs.")

try:
    url = urlsplit(os.environ.get("DATABASE_URL", ""))
    options = parse_qs(url.query, strict_parsing=True)
    if (
        url.scheme not in ("postgres", "postgresql") or not url.hostname
        or not url.username or not url.path.strip("/") or url.fragment
        or set(options) - {"sslmode"} or any(len(values) != 1 for values in options.values())
    ):
        raise ValueError
    sslmode = options.get("sslmode", ["require"])[0]
    if sslmode not in ("disable", "allow", "prefer", "require", "verify-ca", "verify-full"):
        raise ValueError
    DATABASES = {"default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": unquote(url.path.lstrip("/")),
        "USER": unquote(url.username),
        "PASSWORD": unquote(url.password or ""),
        "HOST": url.hostname,
        "PORT": url.port or 5432,
        "CONN_MAX_AGE": 60,
        "CONN_HEALTH_CHECKS": True,
        "OPTIONS": {"sslmode": sslmode, "connect_timeout": 5},
    }}
except ValueError:
    raise ImproperlyConfigured("DATABASE_URL must be a valid PostgreSQL URL; only the sslmode query option is supported.") from None

CSRF_TRUSTED_ORIGINS = []  # Same-origin frontend; no cross-origin API permissions.
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = False  # Do not opt a domain into browser preload lists implicitly.
if os.environ.get("DJANGO_TRUST_PROXY_HEADERS", "false").lower() == "true":
    # Only enable behind a controlled proxy that replaces this header.
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
