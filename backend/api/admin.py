from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from .models import (
    Doctor, PasswordResetToken, Specialty, Clinic, 
    Ensurance, Review, Schedule, WeekDay, 
    WeekAvailability, Appointment
)

User = get_user_model()

class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label=_("Password"), widget=forms.PasswordInput)
    password2 = forms.CharField(label=_("Confirm Password"), widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ("email", "username", "first_name", "last_name", "born_date", "phone_number", "profile_picture")

    def clean_password2(self):
        p1 = self.cleaned_data.get("password1")
        p2 = self.cleaned_data.get("password2")
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError(_("Passwords don't match"))
        return p2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

class CustomUserChangeForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ("email", "username", "first_name", "last_name", "born_date", "phone_number", "profile_picture", "favorite_doctors")

class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    model = User
    
    # Se eliminó 'password' de fieldsets directos para evitar errores de renderizado
    list_display = ("email", "username", "first_name", "last_name", "is_staff")
    list_filter = ("is_staff", "is_active")
    
    fieldsets = (
        (None, {"fields": ("email",)}),
        (_("Personal Info"), {"fields": ("username", "first_name", "last_name", "born_date", "phone_number", "profile_picture", "favorite_doctors")}),
        (_("Permissions"), {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2"),
        }),
    )

    search_fields = ("email", "username")
    ordering = ("email",)

# Registro de modelos
admin.site.register(User, CustomUserAdmin)
admin.site.register(Doctor)
admin.site.register(Clinic)
admin.site.register(Specialty)
admin.site.register(Ensurance)
admin.site.register(Appointment)
# Registra los demás solo si necesitas editarlos manualmente:
admin.site.register(Schedule)
admin.site.register(Review)