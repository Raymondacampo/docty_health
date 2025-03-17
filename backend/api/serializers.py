from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
import uuid
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

class MinimalUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)  # Extra field for password confirmation

    class Meta:
        model = User
        fields = ['first_name', 'last_name', "email", "password", "confirm_password"]
        extra_kwargs = {"password": {"write_only": True}}
        
    # def validate(self, data):
    #     """Ensure passwords match before saving"""
    #     if data["password"] != data["confirm_password"]:
    #         raise serializers.ValidationError({"password": "Passwords do not match."})
    #     return data

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