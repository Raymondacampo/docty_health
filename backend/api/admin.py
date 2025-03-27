from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from .models import Doctor, PasswordResetToken
User = get_user_model()

class CustomUserCreationForm(forms.ModelForm):
    """Form for creating new users in the admin panel"""
    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Confirm Password", widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ("email", "username", "born_date", "phone_number", "profile_picture")

    def clean_password2(self):
        """Ensure both passwords match"""
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        """Hash password before saving the user"""
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])  # ✅ Hash the password
        if commit:
            user.save()
        return user


class CustomUserChangeForm(forms.ModelForm):
    """Form for editing users in the admin panel"""
    class Meta:
        model = User
        fields = ("email", "username", "born_date", "phone_number", "profile_picture")

    def clean_password(self):
        """Ensure password remains hashed"""
        return self.initial["password"]


class CustomUserAdmin(UserAdmin):
    """Custom User Admin Panel"""
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    model = User
    list_display = ("email", "username", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal Info"), {"fields": ("username", "born_date", "phone_number", "profile_picture")}),
        (_("Permissions"), {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "born_date", "phone_number", "profile_picture", "password1", "password2"),
        }),
    )

    search_fields = ("email", "username")
    ordering = ("email",)


admin.site.register(User, CustomUserAdmin)  # Register the custom admin
admin.site.register(Doctor) 
admin.site.register(PasswordResetToken) 