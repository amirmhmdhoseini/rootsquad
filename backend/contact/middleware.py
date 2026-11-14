from django.conf import settings
from django.core.exceptions import BadRequest, RequestDataTooBig, TooManyFieldsSent, TooManyFilesSent
from django.http import JsonResponse
from django.http.multipartparser import MultiPartParserError


class ContactRequestMiddleware:
    """Bound contact input before CSRF middleware accesses request.POST."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == "/api/contact/" and request.method == "POST":
            try:
                if request.content_type not in ("multipart/form-data", "application/x-www-form-urlencoded"):
                    return self.error("unsupported_media_type", 415)
                if len(request.body) > settings.DATA_UPLOAD_MAX_MEMORY_SIZE:
                    return self.error("payload_too_large", 413)
                request.POST  # Enforce field/file counts before CSRF inspects the form.
                if request.FILES:
                    return self.error("invalid_payload", 400)
            except RequestDataTooBig:
                return self.error("payload_too_large", 413)
            except (TooManyFieldsSent, TooManyFilesSent, MultiPartParserError, BadRequest, UnicodeDecodeError):
                return self.error("invalid_payload", 400)
        return self.get_response(request)

    @staticmethod
    def error(code, status):
        response = JsonResponse({"code": code}, status=status)
        response["Cache-Control"] = "no-store"
        return response
