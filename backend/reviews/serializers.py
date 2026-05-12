from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Review
from doctors.models import Doctor
User = get_user_model()
import logging
logger = logging.getLogger(__name__)

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
