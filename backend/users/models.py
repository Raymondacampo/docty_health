from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
import logging
from geopy import timezone
from api.utils.image_processing import process_profile_picture

logger = logging.getLogger(__name__)

# User Model
class User(AbstractUser):
    born_date = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    gender = models.CharField(max_length=1, choices=(('M', 'Male'), ('F', 'Female')),default= 'M', blank=True, null=True)

    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        blank=True,
        null=True,
        default=None
    )
    
    # Usamos string 'doctors.Doctor' para evitar importación circular
    favorite_doctors = models.ManyToManyField(
        'doctors.Doctor', 
        related_name='favorited_by',
        blank=True,
        help_text="Doctors marked as favorites by the user"
    )
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username']

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="+",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="+",
        blank=True
    )

    class Meta:
        db_table = 'api_user'

    def save(self, *args, **kwargs):
        """Auto-generate a unique username if not provided and crop/resize profile picture."""
        if not self.username:
            self.username = f"user_{uuid.uuid4().hex[:8]}"
        
        # Crop and resize profile picture only if present and not default
        if self.profile_picture and hasattr(self.profile_picture, 'file'):
            if self.profile_picture.name != 'profile_pics/default.jpg':
                try:
                    name, processed_file = process_profile_picture(self.profile_picture)
                    self.profile_picture.save(name, processed_file, save=False)
                    logger.info("Profile picture processed via utils")
                except Exception:
                    self.profile_picture = None        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

class PasswordResetToken(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    class Meta:
        db_table = 'api_passwordresettoken'

    def is_valid(self):
        return not self.used and timezone.now() < self.expires_at

    def __str__(self):
        return f"Token for {self.email} - Used: {self.used}"