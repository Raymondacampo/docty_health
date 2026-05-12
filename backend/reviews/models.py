from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import logging

logger = logging.getLogger(__name__)

class Review(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='reviews_given')
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, related_name='reviews_received')
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5."
    )
    headline = models.CharField(max_length=100, help_text="Short summary of the review.", null=True, blank=True)
    body = models.TextField(help_text="Detailed review text.", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    test = models.BooleanField(default=False, help_text="Indicates if this is a test review (not shown in public listings).")

    class Meta:
        db_table = 'api_review'
        unique_together = ('user', 'doctor')  # Prevent duplicate reviews from the same user for the same doctor

    def __str__(self):
        return f"{self.user} - {self.doctor} - {self.rating} stars."
