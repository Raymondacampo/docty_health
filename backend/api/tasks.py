# myapp/tasks.py
from celery import shared_task
from .models import PasswordResetToken
from django.utils import timezone

@shared_task
def cleanup_expired_tokens():
    expired = PasswordResetToken.objects.filter(expires_at__lt=timezone.now())
    count = expired.count()
    expired.delete()
    return f"Deleted {count} expired tokens"