import re

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
import uuid
from appointments.models import Appointment
from doctors.models import Doctor 
from doctors.serializers import DoctorSerializer
User = get_user_model()
import logging

logger = logging.getLogger(__name__)

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'profile_picture']

class UserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source='id', read_only=True)
    favorite_doctors = serializers.SerializerMethodField()
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
    
    def validate_phone_number(self, value):
        if value and not re.fullmatch(r'\+?\d{7,15}', value):
            raise serializers.ValidationError("Invalid phone number format.")
        return value
    def update(self, instance, validated_data):
        # 1. Extraer datos que no pertenecen directamente al modelo User
        description = validated_data.pop('description', None)
        takes_virtual = validated_data.pop('takes_virtual', None)
        takes_in_person = validated_data.pop('takes_in_person', None)
        profile_picture_data = validated_data.get('profile_picture')

        # 2. Lógica especial para eliminar foto de perfil (si envían string "remove")
        # Nota: DRF suele esperar un archivo, pero si manejas el string "remove":
        if self.context['request'].data.get('profile_picture') == 'remove':
            if instance.profile_picture:
                instance.profile_picture.delete(save=False)
                instance.profile_picture = None
                validated_data.pop('profile_picture', None)

        # 3. Lógica para el modelo Doctor
        if hasattr(instance, 'doctor'):
            doctor = instance.doctor
            doctor_modified = False

            if description is not None:
                doctor.description = description
                doctor_modified = True

            if takes_virtual is not None:
                # Lógica de Appointment para virtual
                Appointment.objects.filter(
                    appointment__week_availability__doctor=instance,
                    appointment__place__isnull=True
                ).update(active=takes_virtual)
                doctor.takes_virtual = takes_virtual
                doctor_modified = True

            if takes_in_person is not None:
                # Lógica de Appointment para presencial
                Appointment.objects.filter(
                    appointment__week_availability__doctor=instance,
                    appointment__place__isnull=False
                ).update(active=takes_in_person)
                doctor.takes_in_person = takes_in_person
                doctor_modified = True

            if doctor_modified:
                doctor.save()

        # 4. Actualizar el usuario con el resto de validated_data
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['is_doctor'] = Doctor.objects.filter(user=instance).exists()
        # Aseguramos que la descripción aparezca en el GET aunque sea write_only arriba
        if hasattr(instance, 'doctor'):
            ret['description'] = instance.doctor.description
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
