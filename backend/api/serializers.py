from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
import uuid
from .models import Doctor, DoctorAvailability, Clinic, DayOfWeek, Specialty, Ensurance
User = get_user_model()

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

        return attrs

    def create(self, validated_data):
        # Remove confirm_password as it's not needed for user creation
        validated_data.pop('confirm_password')
        
        # Extract doctor-specific fields
        exequatur = validated_data.pop('exequatur')
        experience = validated_data.pop('experience')
        specialties = validated_data.pop('specialties', [])
        clinics = validated_data.pop('clinics', [])
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

        # Add specialties and clinics if provided
        if specialties:
            doctor.specialties.set(specialties)
        if clinics:
            doctor.clinics.set(clinics)

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
        fields = ['id', 'doctor', 'clinic', 'specialization', 'days', 'start_time', 'end_time', 'slot_duration', 'virtual']

    def validate(self, data):
        if not data.get('virtual'):
            # If not virtual, clinic and specialization are required
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
    class Meta:
        model = Clinic
        fields = ['id', 'name']  # You can add 'google_place_id' if needed

class EnsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ensurance
        fields = ['id', 'name', 'logo']  # You can add 'logo' if needed