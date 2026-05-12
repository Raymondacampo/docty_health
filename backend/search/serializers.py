from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Clinic, Specialty, Ensurance
User = get_user_model()
import logging
logger = logging.getLogger(__name__)


class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name']

class ClinicSerializer(serializers.ModelSerializer):
    # location = serializers.SerializerMethodField()  # Custom field for lat/lon

    class Meta:
        model = Clinic
        fields = ['id', 'name', 'city', 'state']  # Add 'location'
        # ,'location', 'address'

class EnsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ensurance
        fields = '__all__'  # You can add 'logo' if needed

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.logo:
            # .url es proporcionado por CloudinaryField para dar la dirección completa
            representation['logo'] = instance.logo.url
        return representation

class ClinicNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = ['id', 'name']