from django.db import models
from django.core.exceptions import ValidationError
import logging


logger = logging.getLogger(__name__)

class Schedule(models.Model):
    doctor = models.ForeignKey(
        'doctors.Doctor',
        on_delete=models.CASCADE,
        help_text="The doctor associated with this schedule."
    )
    place = models.ForeignKey(
        'search.Clinic',
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
        db_table = 'api_schedule'
        ordering = ['created_at']

class WeekAvailability(models.Model):
    doctor = models.ForeignKey(
        'doctors.Doctor',
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

    class Meta:
        db_table = 'week_availability'

    def __str__(self):
        return f"Week of {self.week.strftime('%B %d, %Y')} for Dr. {self.doctor.user.first_name} {self.doctor.user.last_name}"

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
        'search.Clinic',
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
        return f"{self.day.strftime('%A, %B %d, %Y')} at {place_str} for Dr. {self.week_availability.doctor.user.first_name} {self.week_availability.doctor.user.last_name}"

class Appointment(models.Model):
    patient = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name="appointments",
        help_text="User who booked the appointment."
    )
    appointment = models.ForeignKey(
        WeekDay,
        on_delete=models.CASCADE,
        related_name="appointments",
        help_text="Schedule for the appointment."
    )
    time = models.JSONField()
    active = models.BooleanField(default=True, help_text="Is the appointment active?")
    
    class Meta:
        db_table = 'api_appointment'
    
    def __str__(self):
        return f"Appointment for {self.patient.first_name} {self.patient.last_name} on {self.appointment.day.strftime('%A, %B %d, %Y')} {f'at {self.appointment.place.name}' if self.appointment.place else 'Virtual'} with Dr. {self.appointment.week_availability.doctor.first_name} {self.appointment.week_availability.doctor.last_name}"
