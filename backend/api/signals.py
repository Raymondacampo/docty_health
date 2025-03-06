from allauth.socialaccount.signals import social_account_added
from django.dispatch import receiver
from .models import User

@receiver(social_account_added)
def save_google_profile_picture(request, sociallogin, **kwargs):
    user = sociallogin.user
    if sociallogin.account.provider == "google":
        user.profile_picture = sociallogin.account.extra_data.get("picture", "")
        user.save()
