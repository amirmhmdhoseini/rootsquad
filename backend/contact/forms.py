from django import forms

from .models import ContactMessage


class ContactForm(forms.ModelForm):
    project = forms.CharField(min_length=12, max_length=5000, strip=True)

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "project"]
