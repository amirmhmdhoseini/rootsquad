import json
import os
import subprocess
import sys

from django.conf import settings
from django.test import SimpleTestCase


class ProductionSettingsTests(SimpleTestCase):
    def load_settings(self, **overrides):
        env = {key: value for key, value in os.environ.items() if not key.startswith(("DJANGO_", "DATABASE_URL"))}
        env.update({
            "DJANGO_SECRET_KEY": "local-test-only-70-characters-with-enough-variety-to-pass-production-validation",
            "DJANGO_ALLOWED_HOSTS": "rootsquad.example",
            "DATABASE_URL": "postgresql://root:password@127.0.0.1:5432/root_squad?sslmode=require",
            **overrides,
        })
        script = """
import json
from config.settings import production as s
print(json.dumps({
    'debug': s.DEBUG, 'ssl': s.SECURE_SSL_REDIRECT,
    'secure_session': s.SESSION_COOKIE_SECURE, 'secure_csrf': s.CSRF_COOKIE_SECURE,
    'engine': s.DATABASES['default']['ENGINE'], 'db_name': s.DATABASES['default']['NAME'],
    'sslmode': s.DATABASES['default']['OPTIONS']['sslmode'],
    'proxy': getattr(s, 'SECURE_PROXY_SSL_HEADER', None),
}))
"""
        return subprocess.run([sys.executable, "-c", script], cwd=settings.BASE_DIR, env=env, capture_output=True, text=True)

    def test_valid_configuration_enables_production_security(self):
        result = self.load_settings()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout), {
            "debug": False, "ssl": True, "secure_session": True, "secure_csrf": True,
            "engine": "django.db.backends.postgresql", "db_name": "root_squad", "sslmode": "require", "proxy": None,
        })

    def test_missing_or_weak_secret_is_refused(self):
        for key in ("", "short", "a" * 70):
            with self.subTest(key=key[:5]):
                result = self.load_settings(DJANGO_SECRET_KEY=key)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("DJANGO_SECRET_KEY", result.stderr)

    def test_empty_or_wildcard_allowed_hosts_are_refused(self):
        for host in ("", "*", "example.com,*", "https://example.com"):
            with self.subTest(host=host):
                result = self.load_settings(DJANGO_ALLOWED_HOSTS=host)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("DJANGO_ALLOWED_HOSTS", result.stderr)

    def test_production_requires_a_valid_postgresql_url(self):
        for url in ("", "sqlite:///db.sqlite3", "postgresql://host/", "postgresql://user:pass@host/db?unknown=value"):
            with self.subTest(url=url):
                result = self.load_settings(DATABASE_URL=url)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("DATABASE_URL", result.stderr)

    def test_proxy_https_header_is_only_trusted_when_opted_in(self):
        result = self.load_settings(DJANGO_TRUST_PROXY_HEADERS="true")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["proxy"], ["HTTP_X_FORWARDED_PROTO", "https"])

    def test_deployment_security_policy_has_only_the_intentional_preload_notice(self):
        import importlib
        from unittest.mock import patch
        from django.core import checks
        from django.test import override_settings

        env = {
            "DJANGO_SECRET_KEY": "deployment-check-only-a-long-random-looking-local-key-not-used-by-any-server",
            "DJANGO_ALLOWED_HOSTS": "rootsquad.example",
            "DATABASE_URL": "postgresql://root:password@localhost/root_squad?sslmode=require",
        }
        with patch.dict(os.environ, env):
            production = importlib.import_module("config.settings.production")
        # Test production's actual security policy without pretending SQLite is PostgreSQL.
        names = [
            "DEBUG", "SECRET_KEY", "ALLOWED_HOSTS", "MIDDLEWARE", "CSRF_COOKIE_SECURE",
            "SESSION_COOKIE_SECURE", "SECURE_SSL_REDIRECT", "SECURE_HSTS_SECONDS",
            "SECURE_HSTS_INCLUDE_SUBDOMAINS", "SECURE_HSTS_PRELOAD", "X_FRAME_OPTIONS",
            "SECURE_CONTENT_TYPE_NOSNIFF", "SECURE_REFERRER_POLICY",
        ]
        with override_settings(**{name: getattr(production, name) for name in names}):
            issues = checks.run_checks(tags=[checks.Tags.security], include_deployment_checks=True)
        self.assertEqual([issue.id for issue in issues], ["security.W021"])
