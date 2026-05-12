
from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from search.models import Clinic
from search.serializers import ClinicNestedSerializer, ClinicSerializer
from users.serializers import PatientSerializer
from .models import Schedule, WeekAvailability, WeekDay, Appointment
from doctors.models import Doctor
User = get_user_model()
import logging
logger = logging.getLogger(__name__)

class ScheduleSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())
    place = serializers.PrimaryKeyRelatedField(queryset=Clinic.objects.all(), allow_null=True)
    hours = serializers.JSONField()
    clinic = ClinicNestedSerializer(source='place', read_only=True)
    class Meta:
        model = Schedule
        fields = ['id', 'doctor', 'place', 'clinic', 'hours', 'title', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        # Ensure doctor exists and is valid
        doctor = attrs.get('doctor')
        if not doctor:
            raise serializers.ValidationError({"doctor": "Doctor is required."})

        # Validate place (optional, can be null for virtual schedules)
        place = attrs.get('place')
        if place and not Clinic.objects.filter(id=place.id).exists():
            raise serializers.ValidationError({"place": "Selected clinic does not exist."})

        # Validate hours
        hours = attrs.get('hours')
        if not hours:
            raise serializers.ValidationError({"hours": "Hours cannot be empty."})
        if not isinstance(hours, list) or not all(isinstance(h, str) for h in hours):
            raise serializers.ValidationError({"hours": "Hours must be a list of time strings (e.g., ['09:00', '10:00'])."})
        
        for hour in hours:
            if not re.match(r'^\d{2}:\d{2}$', hour):
                raise serializers.ValidationError({"hours": f"Invalid time format in hours: {hour}"})
            try:
                hours_int, minutes = map(int, hour.split(':'))
                if hours_int > 23 or minutes > 59:
                    raise serializers.ValidationError({"hours": f"Invalid time value in hours: {hour}"})
            except ValueError:
                raise serializers.ValidationError({"hours": f"Invalid time format in hours: {hour}"})

        return attrs

    def create(self, validated_data):
        schedule = Schedule.objects.create(**validated_data)
        schedule.save()  # Triggers title generation and validation in model's save method
        return schedule
    
class WeekAvailabilitySerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())
    class Meta:
        model = WeekAvailability
        fields = ['id', 'doctor', 'week']

    def create(self, validated_data):
        return WeekAvailability.objects.create(**validated_data)

class WeekDaySerializer(serializers.ModelSerializer):
    week_availability = serializers.PrimaryKeyRelatedField(queryset=WeekAvailability.objects.all())
    place = ClinicSerializer(read_only=True)  # Use ClinicSerializer for nested place data
    place_id = serializers.PrimaryKeyRelatedField(
        queryset=Clinic.objects.all(), 
        source='place', 
        required=False, 
        allow_null=True, 
        write_only=True
    )

    class Meta:
        model = WeekDay
        fields = ['id', 'week_availability', 'day', 'hours', 'place', 'place_id']

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='patient', write_only=True
    )
    appointment = WeekDaySerializer(read_only=True)
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=WeekDay.objects.all(), source='appointment', write_only=True
    )
    week_availability = serializers.SerializerMethodField(read_only=True)
    doctor_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 
            'patient', 
            'patient_id', 
            'appointment', 
            'appointment_id', 
            'week_availability', 
            'doctor_name',
            'time', 
            'active'
        ]
        read_only_fields = ['id', 'patient', 'appointment', 'week_availability', 'doctor_name']

    def get_week_availability(self, obj):
        return WeekAvailabilitySerializer(obj.appointment.week_availability).data

    def get_doctor_name(self, obj):
        # Accedemos a la relación: Appointment -> WeekDay -> WeekAvailability -> Doctor (User)
        try:
            doctor = obj.appointment.week_availability.doctor
            return f"{doctor.first_name} {doctor.last_name}".strip()
        except AttributeError:
            return "Doctor no asignado"

    def validate(self, attrs):
        appointment_id = attrs.get('appointment_id')
        time = attrs.get('time')

        if appointment_id and time:
            # Validate that the selected time is available in the WeekDay's hours
            weekday = appointment_id
            if time not in weekday.hours:
                raise serializers.ValidationError({
                    'time': f"Selected time {time} is not available in the schedule."
                })

            # Prevent double-booking: Check if time slot is already booked
            if Appointment.objects.filter(
                appointment=appointment_id,
                time=time,
                active=True
            ).exists():
                raise serializers.ValidationError({
                    'time': f"Time slot {time} is already booked."
                })

        return attrs

    def create(self, validated_data):
        return Appointment.objects.create(**validated_data)