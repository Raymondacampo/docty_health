from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
import uuid
from .models import Doctor, DoctorAvailability, Clinic, DayOfWeek, Specialty, Ensurance, Review
User = get_user_model()
import logging
logger = logging.getLogger(__name__)


class UserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source='id', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'user_id', 
            'username',
            'email',
            'first_name',
            'last_name',
            'date_joined'
        ]
        read_only_fields = ['email', 'date_joined']  # Prevent accidental updates

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password', 'confirm_password')
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
            password=validated_data['password']
        )
        return user
    
class DoctorSignupSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, required=True)
    last_name = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    exequatur = serializers.CharField(max_length=20, required=True)
    experience = serializers.IntegerField(required=True)
    specialties = serializers.ListField(child=serializers.IntegerField(), required=False)
    clinics = serializers.ListField(child=serializers.IntegerField(), required=False)
    specialties = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        min_length=1,
        max_length=1,
        error_messages={
            'min_length': 'Exactly one specialty is required.',
            'max_length': 'Only one specialty can be selected during signup.',
            'required': 'Specialty is required.'
        }
    )
    clinics = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        min_length=1,
        max_length=1,
        error_messages={
            'min_length': 'Exactly one clinic is required.',
            'max_length': 'Only one clinic can be selected during signup.',
            'required': 'Clinic is required.'
        }
    )
    ensurances = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        max_length=1,
        default=[],
        error_messages={
            'max_length': 'Only one ensurance can be selected during signup.'
        }
    )
    sex = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')], required=True)  # New field

    def validate(self, attrs):
        # Ensure passwords match
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Check for unique email
        if User.objects.filter(email__iexact=attrs['email']).exists():
            raise serializers.ValidationError({"email": "This email is already in use"})
        
        # Check for unique exequatur
        if Doctor.objects.filter(exequatur=attrs['exequatur']).exists():
            raise serializers.ValidationError({"exequatur": "This exequatur is already in use"})
        
        # Validate sex (redundant due to ChoiceField, but for clarity)
        if attrs['sex'] not in ['M', 'F']:
            raise serializers.ValidationError({"sex": "Sex must be 'M' (Male) or 'F' (Female)"})
        
        # Validate specialty existence
        specialty_ids = attrs.get('specialties', [])
        if specialty_ids and not Specialty.objects.filter(id=specialty_ids[0]).exists():
            raise serializers.ValidationError({"specialties": "Selected specialty does not exist."})

        # Validate clinic existence
        clinic_ids = attrs.get('clinics', [])
        if clinic_ids and not Clinic.objects.filter(id=clinic_ids[0]).exists():
            raise serializers.ValidationError({"clinics": "Selected clinic does not exist."})

        # Validate ensurance existence (if provided)
        ensurance_ids = attrs.get('ensurances', [])
        if ensurance_ids and not Ensurance.objects.filter(id=ensurance_ids[0]).exists():
            raise serializers.ValidationError({"ensurances": "Selected ensurance does not exist."})
        
        return attrs

    def create(self, validated_data):
        # Remove confirm_password as it's not needed for user creation
        validated_data.pop('confirm_password')
        
        # Extract doctor-specific fields
        exequatur = validated_data.pop('exequatur')
        experience = validated_data.pop('experience')
        specialties = validated_data.pop('specialties', None)
        if specialties is None:
            logger.error("Missing 'specialties' in validated_data: %s", validated_data)
            raise serializers.ValidationError({"specialties": "This field is required and was not provided."})
        clinics = validated_data.pop('clinics', None)
        if clinics is None:
            logger.error("Missing 'specialties' in validated_data: %s", validated_data)
            raise serializers.ValidationError({"specialties": "This field is required and was not provided."})
        ensurances = validated_data.pop('ensurances', [])
        sex = validated_data.pop('sex')  # Extract sex

        # Create the User object
        user = User.objects.create_user(
            username=f"user_{uuid.uuid4().hex[:10]}",
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # Create the Doctor object linked to the user
        doctor = Doctor.objects.create(
            user=user,
            exequatur=exequatur,
            experience=experience,
            sex=sex  # Include sex
        )

        # Set specialties, clinics, and ensurances (each as a single item)
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
    
# DATE SYSTEM
class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    days = serializers.PrimaryKeyRelatedField(queryset=DayOfWeek.objects.all(), many=True)

    class Meta:
        model = DoctorAvailability
        fields = ['id', 'doctor', 'clinic', 'specialization', 'days', 'start_time', 'end_time', 'slot_duration', 'virtual', 'active']

    def validate(self, data):
        if not data.get('virtual'):
            if not data.get('clinic'):
                raise serializers.ValidationError({"clinic": "Clinic is required for in-person availability."})
            if not data.get('specialization'):
                raise serializers.ValidationError({"specialization": "Specialization is required for in-person availability."})
        return data
    
class DayOfWeekSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayOfWeek
        fields = ['id', 'name']

class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name']

class ClinicSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()  # Custom field for lat/lon

    class Meta:
        model = Clinic
        fields = ['id', 'name', 'city', 'state','location']  # Add 'location'

    def get_location(self, obj):
        if obj.location:
            return {'latitude': obj.location.y, 'longitude': obj.location.x}
        return None

class EnsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ensurance
        fields = ['id', 'name', 'logo']  # You can add 'logo' if needed

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['rating']

class DoctorSerializer(serializers.ModelSerializer):
    specialties = SpecialtySerializer(many=True)
    clinics = ClinicSerializer(many=True)
    ensurances = EnsuranceSerializer(many=True)
    user = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    has_availability = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            'id', 'user', 'exequatur', 'experience', 'sex', 'taking_dates',
            'takes_virtual', 'takes_in_person',  # New fields
            'specialties', 'clinics', 'ensurances', 'average_rating', 'review_count', 'has_availability'
        ]

    def get_user(self, obj):
        return {
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            "phone_number": obj.user.phone_number,
            "email": obj.user.email
        }

    def get_average_rating(self, obj):
        reviews = obj.reviews_received.all()
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return 0

    def get_review_count(self, obj):
        return obj.reviews_received.count()

    def get_has_availability(self, obj):
        return DoctorAvailability.objects.filter(doctor=obj).exists()