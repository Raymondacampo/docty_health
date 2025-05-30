from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.utils import timezone
from django.core.exceptions import ValidationError
from PIL import Image
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
import requests
from django.contrib.gis.geos import Point
import logging
import os
from django.core.files.base import ContentFile
import io
from django.contrib.postgres.fields import ArrayField


logger = logging.getLogger(__name__)


def validate_square_image(image):
    """Ensure the uploaded image is square (width == height)."""
    try:
        with Image.open(image) as img:
            width, height = img.size
            if width != height:
                raise ValidationError("Profile picture must be square (width must equal height).")
    except Exception as e:
        logger.error("validate_square_image error: %s", str(e))
        raise ValidationError(f"Invalid image file: {str(e)}")

# User Model
class User(AbstractUser):
    born_date = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        blank=True,
        null=True,
        default=None
    )
    favorite_doctors = models.ManyToManyField(
        'Doctor',
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

    def save(self, *args, **kwargs):
        """Auto-generate a unique username if not provided and crop/resize profile picture."""
        if not self.username:
            self.username = f"user_{uuid.uuid4().hex[:8]}"
        
        # Crop and resize profile picture only if present and not default
        if self.profile_picture and hasattr(self.profile_picture, 'file') and self.profile_picture.name != 'profile_pics/default.jpg':
            try:
                self._crop_profile_picture()
                logger.info("User.save: Profile picture processed")
            except Exception as e:
                logger.error("User.save: Error processing profile picture: %s", str(e))
                self.profile_picture = None  # Fallback to None on error
        
        super().save(*args, **kwargs)

    def _crop_profile_picture(self):
        """Crop and resize the profile picture to a 200x200 square."""
        with Image.open(self.profile_picture.file) as img:
            # Crop to square
            width, height = img.size
            if width != height:
                size = min(width, height)
                left = (width - size) / 2
                top = (height - size) / 2
                right = (width + size) / 2
                bottom = (height + size) / 2
                img = img.crop((left, top, right, bottom))
                logger.info("Profile picture cropped to %dx%d", size, size)
            
            # Resize to 200x200
            img = img.resize((200, 200), Image.LANCZOS)
            logger.info("Profile picture resized to 200x200")
            
            # Convert to RGB for JPEG
            img = img.convert('RGB')
            
            # Save image to a bytes buffer
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='JPEG', quality=90, optimize=True)
            img_byte_arr.seek(0)
            
            # Update the ImageField with the processed image
            filename = os.path.basename(self.profile_picture.name)
            self.profile_picture.save(
                filename,
                ContentFile(img_byte_arr.read()),
                save=False
            )
            
            logger.info("Profile picture saved as JPEG, quality=90")

    def __str__(self):
        return self.email

# Doctor Model (Extends User)
class Doctor(models.Model):
    SEX_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    exequatur = models.CharField(max_length=20, unique=True)  # Unique doctor registration number
    specialties = models.ManyToManyField("Specialty", related_name="doctors")  # Many doctors can have many specialties
    clinics = models.ManyToManyField("Clinic", related_name="doctors")  # Many doctors work in many clinics
    ensurances = models.ManyToManyField("Ensurance", related_name="doctors", blank=True)  # New field
    experience = models.PositiveIntegerField(help_text="Years of Experience")
    taking_dates = models.BooleanField(default=False)
    takes_virtual = models.BooleanField(default=False, help_text="Doctor takes virtual appointments")
    takes_in_person = models.BooleanField(default=False, help_text="Doctor takes in-person appointments")
    sex = models.CharField(max_length=1, choices=SEX_CHOICES,null=True, blank=True, help_text="Doctor's sex (Male or Female)")  # New field
    description = models.TextField(blank=True, null=True, help_text="Doctor's self-description")  # New field
    
    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name} - {self.exequatur}"

# DoctorDocument Upload Path Function
def doctor_document_upload_path(instance, filename):
    return f"doctor_documents/doctor_{instance.doctor.id}/{timezone.now().strftime('%Y%m%d_%H%M%S')}_{filename}"

class DoctorDocument(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="documents")
    file = models.FileField(upload_to="doctor_documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.description or 'Document'} for {self.doctor}"

# Specialty Model
class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

# Clinic Model
class Clinic(models.Model):
    name = models.CharField(max_length=150)
    address = models.TextField()  # Keep for full address string
    state = models.CharField(max_length=100, blank=True, null=True)  # e.g., "New York"
    city = models.CharField(max_length=100, blank=True, null=True)  # e.g., "New York City"
    location = gis_models.PointField(null=True, blank=True)  # Stores latitude/longitude
    google_place_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.city}, {self.state}"

    def set_location(self, latitude, longitude):
        """Helper to set the PointField from lat/lon."""
        self.location = Point(longitude, latitude, srid=4326)  # SRID 4326 is WGS84 (standard for GPS)

    class Meta:
        indexes = [
            gis_models.Index(fields=['location']),  # Index for geospatial queries
        ]

    def fetch_and_geocode_from_google_maps(self, search_query):
        url = "https://places.googleapis.com/v1/places:searchText"
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": os.environ.get('YOUR_API_KEY'),  # Replace with your key
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location"
        }
        data = {"textQuery": search_query}
        try:
            response = requests.post(url, json=data, headers=headers)
            result = response.json()
            logger.info(f"Raw API response: {result}")
            if response.status_code == 200 and result.get('places'):
                place = result['places'][0]
                self.name = place['displayName']['text']
                self.address = place.get('formattedAddress', '')
                lat = place['location']['latitude']
                lng = place['location']['longitude']
                self.set_location(lat, lng)
                self.save()
                logger.info(f"Fetched and geocoded {self.name}: {lat}, {lng}")
                return True
            else:
                logger.warning(f"No results or error for {search_query}: {result}")
                return False
        except Exception as e:
            logger.error(f"Error fetching {search_query}: {str(e)}")
            return False
    
class Ensurance(models.Model):
    name = models.CharField(max_length=150, unique=True)
    logo = models.ImageField(upload_to="ensurance_logos/", blank=True, null=True)  # Logo image field

    def __str__(self):
        return self.name
    
# DATES SYSTEM
class Schedule(models.Model):
    doctor = models.ForeignKey(
        'Doctor',
        on_delete=models.CASCADE,
        help_text="The doctor associated with this schedule."
    )
    place = models.ForeignKey(
        'Clinic',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="The clinic where the schedule is set. Null for virtual schedules."
    )
    hours = models.JSONField(
        help_text="List of time slots (e.g., ['09:00', '10:00']) for the schedule."
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Optional title for the schedule. Auto-generated if not provided."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the schedule was created."
    )

    def clean(self):
        """Validate the hours field."""
        try:
            if not self.hours:
                raise ValidationError("Hours cannot be empty.")
            if not isinstance(self.hours, list) or not all(isinstance(h, str) for h in self.hours):
                raise ValidationError("Hours must be a list of time strings (e.g., ['09:00', '10:00']).")
            # Validate time format (HH:MM, 24-hour)
            for hour in self.hours:
                if not len(hour) == 5 or hour[2] != ':' or not hour[:2].isdigit() or not hour[3:].isdigit():
                    raise ValidationError(f"Invalid time format in hours: {hour}")
                 
                hours, minutes = map(int, hour.split(':'))
                if hours > 23 or minutes > 59:
                    raise ValidationError(f"Invalid time value in hours: {hour}")
            
        except (TypeError, ValueError) as e:
            logger.error("Schedule.clean: Invalid hours format: %s", str(e))
            raise ValidationError("Hours must be a JSON list of valid time strings.")

    def save(self, *args, **kwargs):
        """Generate default title if not provided."""
        if not self.title:
            if not self.place:
                place_str = 'virtual schedule'
            else:
                place_str = f'schedule in {self.place.name}'
            try:
                if len(self.hours) > 1:
                    start_time = min(self.hours)
                    end_time = max(self.hours)
                    self.title = f"Dr {self.doctor.user.first_name} {self.doctor.user.last_name} {place_str} in from {start_time} to {end_time}"
                elif len(self.hours) == 1:
                    self.title = f"Dr {self.doctor.user.first_name} {self.doctor.user.last_name} {place_str} at {self.hours[0]}"
                else:
                    self.title = f"Schedule in {place_str}"
            except ValueError as e:
                logger.error("Schedule.save: Error generating title: %s", str(e))
                self.title = f"Schedule in {place_str}"
        try:
            self.full_clean()  # Run validation before saving
        except ValidationError as e:
            logger.error("Schedule.save: Validation error: %s", str(e))
            raise
        super().save(*args, **kwargs)
        logger.info("Schedule.save: Saved schedule %s", self.title)

    
    def __str__(self):
        return self.title or "Untitled Schedule"

    class Meta:
        ordering = ['created_at']

class WeekAvailability(models.Model):
    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="week_availabilities",
        help_text="Doctor associated with this week availability.",
    )
    week = models.DateField(
        help_text="Start date of the week (Monday).",
    )

    class Meta:
        db_table = "week_availability"
        verbose_name = "Week Availability"
        verbose_name_plural = "Week Availabilities"

    def __str__(self):
        return f"Week of {self.week.strftime('%B %d, %Y')} for {self.doctor.first_name} {self.doctor.last_name}"

class WeekDay(models.Model):
    week_availability = models.ForeignKey(
        WeekAvailability,
        on_delete=models.CASCADE,
        related_name="weekdays",
        help_text="Week this day belongs to.",
    )
    day = models.DateField(
        help_text="Specific date of availability (e.g., Wednesday, May 21, 2025).",
    )
    hours = models.JSONField(
        help_text="List of available hours (e.g., ['09:00', '10:00']).",
    )
    place = models.ForeignKey(
        Clinic,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="weekday_availabilities",
        help_text="Clinic for in-person appointments; null for virtual.",
    )

    class Meta:
        db_table = "week_day"
        verbose_name = "Week Day"
        verbose_name_plural = "Week Days"

    def __str__(self):
        place_str = self.place.name if self.place else "Virtual"
        return f"{self.day.strftime('%A, %B %d, %Y')} at {place_str} for {self.week_availability.doctor.first_name} {self.week_availability.doctor.last_name}"

class Appointment(models.Model):
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="appointments",
        help_text="User who booked the appointment."
    )
    appointment = models.ForeignKey(
        WeekDay,
        on_delete=models.PROTECT,
        related_name="appointments",
        help_text="Schedule for the appointment."
    )
    time = models.JSONField()
    active = models.BooleanField(default=True, help_text="Is the appointment active?")
    def __str__(self):
        return f"Appointment for {self.patient.first_name} {self.patient.last_name} on {self.appointment.day.strftime('%A, %B %d, %Y')} {f'at {self.appointment.place.name}' if self.appointment.place else 'Virtual'} with Dr. {self.appointment.week_availability.doctor.first_name} {self.appointment.week_availability.doctor.last_name}"

# reviews system
class Review(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='reviews_given')
    doctor = models.ForeignKey('Doctor', on_delete=models.CASCADE, related_name='reviews_received')
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5"
    )
    headline = models.CharField(max_length=100, help_text="Short summary of the review")
    body = models.TextField(help_text="Detailed review text")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'doctor')  # Prevent duplicate reviews from the same user for the same doctor

    def __str__(self):
        return f"{self.user} - {self.doctor} - {self.rating} stars"

class PasswordResetToken(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    def is_valid(self):
        return not self.used and timezone.now() < self.expires_at

    def __str__(self):
        return f"Token for {self.email} - Used: {self.used}"