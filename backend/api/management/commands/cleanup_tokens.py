# myapp/management/commands/cleanup_tokens.py
from django.core.management.base import BaseCommand
from api.models import PasswordResetToken  # Adjust the import based on your app name
from django.utils import timezone

class Command(BaseCommand):
    help = 'Cleans up expired password reset tokens'

    def handle(self, *args, **options):
        expired = PasswordResetToken.objects.filter(expires_at__lt=timezone.now())
        used = PasswordResetToken.objects.filter(used=True)
        count = expired.count()  # Get count before deletion
        count_used = used.count()
        used.delete()
        expired.delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {count} expired tokens and {count_used} used token'))