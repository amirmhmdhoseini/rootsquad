from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "created_at", "is_read"]
    list_filter = ["is_read", "created_at"]
    search_fields = ["name", "email", "project"]
    readonly_fields = ["name", "email", "project", "created_at"]
    actions = ["mark_read", "mark_unread"]
    list_per_page = 25

    def has_add_permission(self, request):
        return False

    @admin.action(description="Mark selected messages as reviewed", permissions=["change"])
    def mark_read(self, request, queryset):
        queryset.update(is_read=True)

    @admin.action(description="Mark selected messages as unreviewed", permissions=["change"])
    def mark_unread(self, request, queryset):
        queryset.update(is_read=False)
