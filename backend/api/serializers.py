from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
import uuid
import re
from .models import Doctor, Clinic, Specialty, Ensurance, Review, Schedule, WeekAvailability, WeekDay, Appointment
from datetime import timedelta
User = get_user_model()
import logging
from django.db import transaction
logger = logging.getLogger(__name__)

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'profile_picture']

class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name']

class ClinicSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()  # Custom field for lat/lon

    class Meta:
        model = Clinic
        fields = ['id', 'name', 'city', 'state','location', 'address']  # Add 'location'

    def get_location(self, obj):
        if obj.location:
            return {'latitude': obj.location.y, 'longitude': obj.location.x}
        return None

class EnsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ensurance
        fields = ['id', 'name', 'logo']  # You can add 'logo' if needed

class DoctorSerializer(serializers.ModelSerializer):
    specialties = SpecialtySerializer(many=True)
    clinics = ClinicSerializer(many=True)
    ensurances = EnsuranceSerializer(many=True)
    user = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    has_availability = serializers.SerializerMethodField()
    cities = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'exequatur', 'experience', 'sex', 'taking_dates',
                  'takes_virtual', 'takes_in_person', 'description', 'specialties',
                  'clinics', 'ensurances', 'average_rating', 'review_count',
                  'has_availability', 'cities']

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'email': obj.user.email,
            'profile_picture': obj.user.profile_picture.url if obj.user.profile_picture else None,
        }

    def get_average_rating(self, obj):
        reviews = obj.reviews_received.all()
        return sum(review.rating for review in reviews) / len(reviews) if reviews else None

    def get_review_count(self, obj):
        return obj.reviews_received.count()

    def get_has_availability(self, obj):
        return obj.taking_dates

    def get_cities(self, obj):
        return list(set(clinic.city for clinic in obj.clinics.all() if clinic.city))

class UserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source='id', read_only=True)
    favorite_doctors = serializers.SerializerMethodField()
    # description = serializers.CharField(required=False, allow_blank=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'user_id',
            'username',
            'email',
            'first_name',
            'last_name',
            'date_joined',
            'favorite_doctors',
            'profile_picture',
            'phone_number',
            'born_date',
            'gender',
            'doctor'
        ]
        read_only_fields = ['email', 'date_joined']

    def get_favorite_doctors(self, obj):
        doctors = obj.favorite_doctors.all()
        return DoctorSerializer(doctors, many=True).data

    def update(self, instance, validated_data):
        doctor_data = validated_data.pop('doctor', None)
        if doctor_data:
            if not Doctor.objects.filter(user=instance).exists():
                raise serializers.ValidationError({"doctor": "User is not a doctor."})
            doctor = instance.doctor
            for attr, value in doctor_data.items():
                if attr == 'description':
                    doctor.description = value
                elif attr == 'exequatur':
                    doctor.exequatur = value
                elif attr == 'experience':
                    doctor.experience = value
                elif attr == 'taking_dates':
                    doctor.taking_dates = value
                elif attr == 'takes_virtual':
                    doctor.takes_virtual = value
                elif attr == 'takes_in_person':
                    doctor.takes_in_person = value
            doctor.save()
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['is_doctor'] = Doctor.objects.filter(user=instance).exists()
        return ret
    
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password', 'confirm_password', 'gender', 'born_date')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {
                'required': True,
                'error_messages': {
                    'unique': 'This email is already in use'
                }
            }
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        # Check for existing email (redundant safety check)
        if User.objects.filter(email__iexact=validated_data['email']).exists():
            raise serializers.ValidationError(
                {'email': ['This email is already in use']}
            )

        user = User.objects.create_user(
            username=f"user_{uuid.uuid4().hex[:10]}",
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            gender=validated_data['gender'],  # Set gender
            born_date=validated_data.get('born_date')  # Set born_date if provided
        )
        return user
    
class DoctorSignupSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, required=True)
    last_name = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    born_date = serializers.DateField(required=False, allow_null=True)
    exequatur = serializers.CharField(max_length=20, required=True)
    experience = serializers.IntegerField(required=True, min_value=0)
    # Use PrimaryKeyRelatedField so validated_data will contain actual model instances
    specialties = serializers.PrimaryKeyRelatedField(many=True, queryset=Specialty.objects.all())
    clinics = serializers.PrimaryKeyRelatedField(many=True, queryset=Clinic.objects.all())
    ensurances = serializers.PrimaryKeyRelatedField(many=True, queryset=Ensurance.objects.all(), required=False, allow_empty=True)
    sex = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')], required=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_exequatur(self, value):
        if Doctor.objects.filter(exequatur=value).exists():
            raise serializers.ValidationError("This exequatur is already in use.")
        return value

    def validate(self, attrs):
        # Passwords match
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        # Ensure exactly one specialty and clinic during signup
        specialties = attrs.get('specialties', [])
        clinics = attrs.get('clinics', [])
        if not specialties or len(specialties) != 1:
            raise serializers.ValidationError({"specialties": "Exactly one specialty is required during signup."})
        if not clinics or len(clinics) != 1:
            raise serializers.ValidationError({"clinics": "Exactly one clinic is required during signup."})

        # ensurances may be empty or have up to 1 item (if you want to enforce max 1)
        ensurances = attrs.get('ensurances', [])
        if ensurances and len(ensurances) > 1:
            raise serializers.ValidationError({"ensurances": "Only one ensurance can be selected during signup."})

        return attrs

    def create(self, validated_data):
        # Remove confirm_password
        validated_data.pop('confirm_password', None)

        # Extract m2m instances
        specialties = validated_data.pop('specialties', [])
        clinics = validated_data.pop('clinics', [])
        ensurances = validated_data.pop('ensurances', [])
        born_date = validated_data.pop('born_date', None)

        exequatur = validated_data.pop('exequatur')
        experience = validated_data.pop('experience')
        sex = validated_data.pop('sex')

        # other user fields
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        # Atomic creation so partial objects aren't left on failure
        with transaction.atomic():
            user = User.objects.create_user(
                username=f"user_{uuid.uuid4().hex[:10]}",
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password,
                born_date=born_date
            )

            doctor = Doctor.objects.create(
                user=user,
                exequatur=exequatur,
                experience=experience,
                sex=sex
            )

            # specialties/clinics/ensurances are lists of model instances (PrimaryKeyRelatedField)
            doctor.specialties.set(specialties)
            doctor.clinics.set(clinics)
            if ensurances:
                doctor.ensurances.set(ensurances)

        return user
class MinimalUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)  # Extra field for password confirmation

    class Meta:
        model = User
        fields = ['first_name', 'last_name', "email", "password", "confirm_password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        """Remove confirm_password before saving the user"""
        validated_data.pop("confirm_password")  # ✅ Remove confirm_password
        user = User.objects.create(email=validated_data["email"])
        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        user.username = f"user_{uuid.uuid4().hex[:8]}"
        user.set_password(validated_data["password"])  # Hash password
        user.save()
        return user
    

# serializers.py
# api/serializers.py
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), source='doctor', write_only=True
    )

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_id', 'doctor_id', 'rating', 'headline', 'body', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
        }

    def validate(self, attrs):
        # Ensure rating is between 1 and 5
        rating = attrs.get('rating')
        if rating is None or rating < 1 or rating > 5:
            raise serializers.ValidationError({"rating": "Rating must be between 1 and 5."})
        return attrs


    
class ScheduleSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())
    place = serializers.PrimaryKeyRelatedField(queryset=Clinic.objects.all(), allow_null=True)
    hours = serializers.JSONField()

    class Meta:
        model = Schedule
        fields = ['id', 'doctor', 'place', 'hours', 'title', 'created_at']
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

    def create(self, validated_data):
        return WeekDay.objects.create(**validated_data)
    
class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = ['id', 'name']

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

    class Meta:
        model = Appointment
        fields = [
            'id', 
            'patient', 
            'patient_id', 
            'appointment', 
            'appointment_id', 
            'week_availability', 
            'time', 
            'active'
        ]
        read_only_fields = ['id', 'patient', 'appointment', 'week_availability']

    def get_week_availability(self, obj):
        return WeekAvailabilitySerializer(obj.appointment.week_availability).data

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