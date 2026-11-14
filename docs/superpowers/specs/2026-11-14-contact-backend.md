# Contact backend design

Approved scope: receive the existing site's contact form and manage messages in Django admin. Site content remains in Vue. No public message listing, customer accounts, email sending or CMS.

## Structure

`backend/config` holds Django configuration and URLs. `backend/contact` holds the message model, form validation, API views, rate limiting, admin and tests. A project-local `backend/venv` isolates Python packages. Use Django 5.2 LTS and Python 3.12+. Use SQLite locally and PostgreSQL for production.

## API and data

- `GET /api/csrf/`: returns a masked CSRF token and sets the CSRF cookie, never cached.
- `POST /api/contact/`: accepts multipart or URL-encoded fields `name` (1–120 characters), `email` (valid email, at most 254 characters), `project` (12–5000 characters). Trim whitespace. Return 201 only after persistence; errors use stable codes and field errors without exposing submitted content. No files.
- `GET /api/health/`: minimal database readiness response, with no configuration details.
- Store name, email, project, creation time and `is_read`. Admin permits search/filtering and read-status updates; submitted content is read-only and rendered with Django's normal escaping. No anonymous access to stored messages.

## Safety and deployment

Keep CSRF protection. Use a shared, database-backed fixed-window submission limit (default 10 requests per 10 minutes per IP), with conditional atomic updates and hashed IP identifiers. Never trust client forwarding headers unless the immediate peer is explicitly trusted. Keep expired limiter records only until scheduled cleanup. Cap body size at 32 KiB and reject uploaded files. Disable cross-origin API access; use Vite's local proxy and an Nginx reverse proxy in production.

Development and production settings are separate. Production requires an environment-provided strong secret, exact allowed hosts and PostgreSQL URL; enables secure cookies, HTTPS redirect, HSTS, clickjacking and content-type protections. Gunicorn binds to loopback behind Nginx; Nginx serves the Vue build and collected admin static files. Trust forwarded HTTPS only when explicitly configured for a controlled proxy.

The frontend obtains CSRF before submission, disables submission while pending, shows localised validation/rate/error states, retains input on failure and resets only on success. A refreshed token is obtained for every submission. Requests have a timeout and no automatic POST retry.

## Acceptance

Run backend tests against the database, including CSRF, invalid and oversized input, rate limits, proxy spoofing, admin access and escaping. Run frontend Node tests, Vite build, migrations checks, static collection and production `check --deploy`. Document exact versions and any environment-blocked checks honestly. No real deployment, mail or external messages.
