# Contact Backend Implementation Plan

> **For agentic workers:** Use executing-plans to implement inline, task by task.

**Goal:** Save validated contact messages and manage them in Django admin.

**Architecture:** Django's built-in forms, ORM, admin and test runner. Same-origin Vue API calls, with database-backed submission limits shared across workers.

**Tech Stack:** Python 3.12+, Django 5.2 LTS, SQLite locally, PostgreSQL and Gunicorn in production; native Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-14-contact-backend.md`

## Global Constraints

- Preserve existing site content and design; only contact behaviour and its feedback change.
- No CMS, email delivery or public message read API.
- Keep secrets, virtual environments and local databases out of version control.
- No deployment or changes to other projects. This folder is not a Git repository, so no commits/worktrees.

## Review Focus

- CSRF failures and untrusted origins must never save messages.
- Validation failures and network failures must preserve user input.
- Forwarded IP spoofing must not bypass submission limits.
- Concurrent workers must share the limit rather than process-local counters.
- Production must refuse insecure missing configuration.

## Task 1: Django API, persistence and admin

Files: `backend/config/`, `backend/contact/`, `backend/manage.py`, `backend/requirements*.txt`, `.gitignore`.

- [x] Create the venv and install available dependencies; record exact test versions and network limitations.
- [x] Scaffold Django configuration. Write real request/database tests before implementing contact behaviour.
- [x] Run the tests and observe missing-endpoint failures.
- [x] Implement contact validation, storage, CSRF, rate limits, admin and limiter cleanup.
- [x] Run `venv/bin/python manage.py test` and fix genuine failures.

## Task 2: Vue integration

Files: `src/services/contactApi.js`, `src/services/contactApi.test.js`, `src/composables/useSiteInteractions.js`, `src/components/ContactSection.vue`, `src/data/siteConfig.js`, `vite.config.js`, `package.json`.

- [x] Write tests for CSRF-backed request ordering, server validation, rate-limit responses and request failure.
- [x] Observe the tests fail before implementing the API helper.
- [x] Implement helper, timeout, pending state, localised messages and same-origin proxy.
- [x] Run `npm test` and `npm run build`.

## Task 3: Deployment and handoff

Files: `backend/.env.example`, `backend/.env.production.example`, `deploy/`, `README.md`.

- [x] Document setup, database migrations, admin account creation, API contract and test commands.
- [x] Add Nginx/systemd examples with loopback Gunicorn, body limits and secure proxy handling.
- [x] Run migrations, `makemigrations --check --dry-run`, `collectstatic` and production deployment checks with test environment values.
- [x] Review security and actual test evidence; report untested production services explicitly.


## Execution record

- Scope and design approved in conversation; implementation performed inline in the existing folder. There is no Git repository, so no worktree, commit or branch integration was possible or necessary.
- Backend endpoint test observed failing with 404 before endpoint implementation; frontend API tests observed failing before implementation.
- Backend: 40 tests passed, including production-policy validation; Node: 16 tests passed.
- Migrations applied locally; no ungenerated model changes; 127 admin static files collected; installed local requirements consistent.
- Independent read-only review found pending-edit data loss and a production test-command documentation defect. Pending form fields now become read-only; a regression test failed before the change and passed after it. The test command now explicitly selects development settings and SQLite.
- Production dependency floor raised to Django 5.2.19; locally cached/tested version remains 5.2.17. Production installs must use requirements-production.txt.
- Full production check attempted but blocked by unavailable PostgreSQL driver. Production security policy checked independently, with only intentional security.W021 (preload disabled). No claim of a successful full production check.
- Live HTTP smoke test attempted using an isolated temporary database, but sandbox denied local socket binding. No live/browser verification claimed.
- Existing frontend warnings for Three.js SRGBColorSpace and bundle size remain outside this change.
