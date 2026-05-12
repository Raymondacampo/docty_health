from django.db import models
from django.utils import timezone
import logging
from cloudinary.models import CloudinaryField

logger = logging.getLogger(__name__)

# Doctor Model (Extends User)
class Doctor(models.Model):
    SEX_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    clinics = models.ManyToManyField('search.Clinic', related_name="doctors")  # Many doctors work in many clinics
    description = models.TextField(blank=True, null=True, help_text="Doctor's self-description")  # New field
    ensurances = models.ManyToManyField('search.Ensurance', related_name="doctors", blank=True)  # New field
    exequatur = models.CharField(max_length=20, unique=True)  # Unique doctor registration number
    experience = models.PositiveIntegerField(help_text="Years of Experience")

    first_name = models.CharField(max_length=30, help_text="Doctor's first name", null=False, blank=False)  # New field
    last_name = models.CharField(max_length=30, help_text="Doctor's last name", null=False, blank=False)  # New field
    age = models.PositiveIntegerField(help_text="Doctor's age", null=True, blank=True)  # New field

    sex = models.CharField(max_length=1, choices=SEX_CHOICES,null=True, blank=True, help_text="Doctor's sex (Male or Female)")  # New field
    specialties = models.ManyToManyField('search.Specialty', related_name="doctors")  # Many doctors can have many specialties
    taking_dates = models.BooleanField(default=False)
    takes_virtual = models.BooleanField(default=False, help_text="Doctor takes virtual appointments")
    takes_in_person = models.BooleanField(default=False, help_text="Doctor takes in-person appointments")
    user = models.OneToOneField('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name="doctor", help_text="Associated user account for the doctor")
    
    class Meta:
        db_table = 'api_doctor'

    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name} - {self.exequatur}"

# DoctorDocument Upload Path Function
def doctor_document_upload_path(instance, filename):
    return f"doctor_documents/doctor_{instance.doctor.id}/{timezone.now().strftime('%Y%m%d_%H%M%S')}_{filename}"

class DoctorDocument(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="documents")
    file = CloudinaryField('file', folder='doctor_documents')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'api_doctordocument'
        
    def __str__(self):
        return f"{self.description or 'Document'} for {self.doctor}"
