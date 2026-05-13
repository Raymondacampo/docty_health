from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
import uuid
from .models import Doctor
from search.models import Clinic, Specialty, Ensurance
from search.serializers import ClinicSerializer, SpecialtySerializer, EnsuranceSerializer
import logging
from django.db import transaction
from datetime import date

User = get_user_model()
logger = logging.getLogger(__name__)

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
        fields = ['id', 'user', 'first_name', 'last_name', 'age', 'exequatur', 
                  'experience', 'sex', 'taking_dates', 'takes_virtual', 
                  'takes_in_person', 'description', 'specialties',
                  'clinics', 'ensurances', 'average_rating', 'review_count',
                  'has_availability', 'cities']

    def get_user(self, obj):
        """
        Si no hay usuario, devuelve la información básica contenida en el modelo Doctor.
        """
        user = obj.user
        
        if user:
            # Calcular edad desde el User si está disponible
            user_age = None
            if user.born_date:
                today = date.today()
                user_age = today.year - user.born_date.year - (
                    (today.month, today.day) < (user.born_date.month, user.born_date.day)
                )
            
            return {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'profile_picture': user.profile_picture.url if user.profile_picture else None,
                'age': user_age or obj.age, # Fallback a la edad del modelo Doctor
                'has_account': True
            }
        
        # Si NO hay objeto User asociado
        return {
            'id': None,
            'first_name': obj.first_name,
            'last_name': obj.last_name,
            'email': None,
            'profile_picture': None,
            'age': obj.age,
            'has_account': False
        }

    def get_average_rating(self, obj):
        reviews = obj.reviews_received.all()
        return sum(review.rating for review in reviews) / len(reviews) if reviews else None

    def get_review_count(self, obj):
        return obj.reviews_received.count()

    def get_has_availability(self, obj):
        return obj.taking_dates

    def get_cities(self, obj):
        # Usamos clinics.all() directamente, no depende del usuario
        return list(set(clinic.city for clinic in obj.clinics.all() if clinic.city))

    
class DoctorSignupSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, required=True)
    last_name = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    born_date = serializers.DateField(required=False, allow_null=True)
    exequatur = serializers.CharField(max_length=20, required=True)
    experience = serializers.IntegerField(required=True, min_value=0)
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
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        specialties = attrs.get('specialties', [])
        clinics = attrs.get('clinics', [])
        
        if not specialties or len(specialties) != 1:
            raise serializers.ValidationError({"specialties": "Exactly one specialty is required during signup."})
        if not clinics or len(clinics) != 1:
            raise serializers.ValidationError({"clinics": "Exactly one clinic is required during signup."})

        ensurances = attrs.get('ensurances', [])
        if ensurances and len(ensurances) > 1:
            raise serializers.ValidationError({"ensurances": "Only one ensurance can be selected during signup."})

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        specialties = validated_data.pop('specialties', [])
        clinics = validated_data.pop('clinics', [])
        ensurances = validated_data.pop('ensurances', [])
        
        born_date = validated_data.pop('born_date', None)
        exequatur = validated_data.pop('exequatur')
        experience = validated_data.pop('experience')
        sex = validated_data.pop('sex')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        # Cálculo de edad para guardar en el modelo Doctor (como respaldo)
        calculated_age = None
        if born_date:
            today = date.today()
            calculated_age = today.year - born_date.year - ((today.month, today.day) < (born_date.month, born_date.day))

        with transaction.atomic():
            # 1. Crear el Usuario (Dado que es Signup, aquí siempre se crea uno)
            user = User.objects.create_user(
                username=f"user_{uuid.uuid4().hex[:10]}",
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password,
                born_date=born_date
            )

            # 2. Crear el Doctor vinculado al usuario
            doctor = Doctor.objects.create(
                user=user,
                first_name=first_name,
                last_name=last_name,
                age=calculated_age,
                exequatur=exequatur,
                experience=experience,
                sex=sex
            )

            doctor.specialties.set(specialties)
            doctor.clinics.set(clinics)
            if ensurances:
                doctor.ensurances.set(ensurances)

        return user