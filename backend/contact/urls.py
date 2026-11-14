from django.urls import path

from . import views

app_name = "contact"
urlpatterns = [
    path("csrf/", views.csrf_token, name="csrf"),
    path("contact/", views.submit_contact, name="submit"),
    path("health/", views.health, name="health"),
]
