"""Local development only. Never use this settings module on a public server."""

import os

from django.core.management.utils import get_random_secret_key

from .base import *  # noqa: F403

DEBUG = True
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY") or get_random_secret_key()
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "[::1]"]
DATABASES = {"default": {
    "ENGINE": "django.db.backends.sqlite3",
    "NAME": BASE_DIR / "db.sqlite3",  # noqa: F405
    "OPTIONS": {"timeout": 20},
}}
