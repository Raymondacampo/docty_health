from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.utils import timezone
from django.core.exceptions import ValidationError
from PIL import Image
from django.core.validators import MinValueValidator, MaxValueValidator

def validate_square_image(image):
    """Ensure the uploaded image is square (width == height)."""
    with Image.open(image) as img:
        width, height = img.size
        if width != height:
            raise ValidationError("Profile picture must be square (width must equal height).")

# User Model
class User(AbstractUser):
    born_date = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        blank=True,
        null=True,
        validators=[validate_square_image]  # Add validator
    )

    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username']

     # ✅ Fix reverse accessor clashes by setting `related_name="+"`
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="+",  # Prevents conflicts
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="+",  # Prevents conflicts
        blank=True
    )

    def save(self, *args, **kwargs):
        """Auto-generate a unique username if not provided"""
        if not self.username:
            self.username = f"user_{uuid.uuid4().hex[:8]}"  # ✅ Generate unique username
        super().save(*args, **kwargs)


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
    
    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name} - {self.exequatur}"
    
    def update_taking_dates(self):
        """Set taking_dates based on existence of active DoctorAvailability and update virtual/in-person flags."""
        has_active_availability = DoctorAvailability.objects.filter(doctor=self, active=True).exists()
        self.taking_dates = has_active_availability
        if has_active_availability:
            virtual_exists = DoctorAvailability.objects.filter(doctor=self, virtual=True, active=True).exists()
            in_person_exists = DoctorAvailability.objects.filter(doctor=self, virtual=False, active=True).exists()
            if virtual_exists:
                self.takes_virtual = True
            if in_person_exists:
                self.takes_in_person = True
        self.save()

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
    address = models.TextField()
    google_place_id = models.CharField(max_length=255, blank=True, null=True)  # ✅ Optional Google Maps ID

    def __str__(self):
        return self.name
    
class Ensurance(models.Model):
    name = models.CharField(max_length=150, unique=True)
    logo = models.ImageField(upload_to="ensurance_logos/", blank=True, null=True)  # Logo image field

    def __str__(self):
        return self.name
    
# DATES SYSTEM
class DayOfWeek(models.Model):
    name = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name

class DoctorAvailability(models.Model):
    doctor = models.ForeignKey('Doctor', on_delete=models.CASCADE)
    clinic = models.ForeignKey('Clinic', on_delete=models.CASCADE, null=True, blank=True)
    specialization = models.ForeignKey('Specialty', on_delete=models.CASCADE, null=True, blank=True)
    days = models.ManyToManyField(DayOfWeek)
    start_time = models.TimeField()
    end_time = models.TimeField()
    slot_duration = models.PositiveIntegerField(default=30, help_text="Duration in minutes (30, 45, or 60)")
    virtual = models.BooleanField(default=False, help_text="Indicates if this is a virtual appointment")  # New field
    active = models.BooleanField(default=True, help_text="Indicates if this availability is active")  # New field

    def __str__(self):
        return f"{self.doctor} - {self.clinic} - {self.specialization} - {'Active' if self.active else 'Inactive'}"

class Appointment(models.Model):
    doctor = models.ForeignKey('Doctor', on_delete=models.CASCADE)
    patient = models.ForeignKey('User', on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Appointment with {self.doctor} on {self.date} at {self.start_time}"
    
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