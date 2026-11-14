from django.db import DatabaseError, connection
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET, require_POST

from .forms import ContactForm
from .rate_limit import consume_submission


@never_cache
@require_GET
def csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


@never_cache
@require_POST
def submit_contact(request):
    allowed, retry_after = consume_submission(request)
    if not allowed:
        response = JsonResponse({"code": "rate_limited"}, status=429)
        response["Retry-After"] = str(retry_after)
        return response
    if any(len(request.POST.getlist(field)) != 1 for field in request.POST):
        return JsonResponse({"code": "invalid_payload"}, status=400)
    form = ContactForm(request.POST)
    if not form.is_valid():
        errors = {field: [item.code for item in items] for field, items in form.errors.as_data().items()}
        return JsonResponse({"code": "validation_error", "errors": errors}, status=400)
    form.save()
    return JsonResponse({"ok": True}, status=201)


@never_cache
@require_GET
def health(request):
    try:
        connection.ensure_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except DatabaseError:
        return JsonResponse({"status": "unavailable"}, status=503)
    return JsonResponse({"status": "ok"})


@never_cache
def csrf_failure(request, reason=""):
    if request.path.startswith("/api/"):
        return JsonResponse({"code": "csrf_failed"}, status=403)
    from django.views.csrf import csrf_failure as default_failure

    return default_failure(request, reason=reason)


def bad_request(request, exception):
    if request.path.startswith("/api/"):
        return JsonResponse({"code": "invalid_payload"}, status=400)
    from django.views.defaults import bad_request as default_bad_request

    return default_bad_request(request, exception)


def not_found(request, exception):
    if request.path.startswith("/api/"):
        return JsonResponse({"code": "not_found"}, status=404)
    from django.views.defaults import page_not_found

    return page_not_found(request, exception)


def server_error(request):
    if request.path.startswith("/api/"):
        return JsonResponse({"code": "server_error"}, status=500)
    from django.views.defaults import server_error as default_server_error

    return default_server_error(request)
