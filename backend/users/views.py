import traceback

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth import authenticate
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.generics import RetrieveUpdateAPIView
from appointments.models import Appointment
from .serializers import UserProfileSerializer, SignupSerializer
from .serializers import DoctorSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework import serializers
from google.oauth2 import id_token
import os
import uuid
import re
import logging
from itsdangerous import URLSafeTimedSerializer
from django.utils import timezone
from datetime import timedelta, datetime
from .models import PasswordResetToken 
from doctors.models import Doctor
from doctors.serializers import DoctorSerializer
import requests as http_requests

logger = logging.getLogger(__name__)
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    is_doctor = Doctor.objects.filter(user=user).exists()  # Explicit query
    refresh['is_doctor'] = is_doctor
    access = AccessToken.for_user(user)
    access['is_doctor'] = is_doctor
    logger.info(f"Generated tokens for user {user.id}: is_doctor={is_doctor}")
    return {"refresh": str(refresh), "access": str(access)} 

User = get_user_model()

class SignupView(APIView):
    permission_classes = []
    
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=email, password=password)
        if user:
            tokens = get_tokens_for_user(user)  # Use get_tokens_for_user
            return Response({
                'access': tokens['access'],
                'refresh': tokens['refresh'],
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username
                }
            }, status=status.HTTP_200_OK)
        
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

# Google Auth
class GoogleLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            from google.auth.transport import requests as google_requests
            request_adapter = google_requests.Request()
            id_info = id_token.verify_oauth2_token(token, request_adapter, os.getenv('GOOGLE_CLIENT_ID'), clock_skew_in_seconds=10)
            
            user, created = User.objects.get_or_create(
                email=id_info['email'],
                defaults={
                    'username': f"{id_info.get('given_name', '')}_{uuid.uuid4().hex[:10]}",
                    'first_name': id_info.get('given_name', ''),
                    'last_name': id_info.get('family_name', '')
                }
            )
            
            refresh = RefreshToken.for_user(user)
            refresh['is_doctor'] = hasattr(user, 'doctor')
            access = AccessToken.for_user(user)
            access['is_doctor'] = hasattr(user, 'doctor')
            response = {
                'refresh': str(refresh),
                'access': str(access),
                'user_id': user.id,
                'email': user.email,
                'username': user.username            
            }
            return Response(response, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': 'Invalid token', 'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Server error', 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GoogleCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Authorization code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Exchange authorization code for tokens
            token_response = http_requests.post('https://oauth2.googleapis.com/token', data={
                'code': code,
                'client_id': os.getenv('GOOGLE_CLIENT_ID'),
                'client_secret': os.getenv('GOOGLE_CLIENT_SECRET'),
                'redirect_uri': f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/auth/callback",
                'grant_type': 'authorization_code'
            })
            token_data = token_response.json()
            if 'error' in token_data:
                return Response({'error': 'Failed to exchange code', 'detail': token_data['error']}, status=status.HTTP_400_BAD_REQUEST)

            id_token_str = token_data.get('id_token')
            if not id_token_str:
                return Response({'error': 'No ID token received'}, status=status.HTTP_400_BAD_REQUEST)

            # Verify the ID token
            from google.auth.transport import requests as google_requests
            request_adapter = google_requests.Request()

            id_info = id_token.verify_oauth2_token(id_token_str, request_adapter, os.getenv('GOOGLE_CLIENT_ID'), clock_skew_in_seconds=10)
            
            user, created = User.objects.get_or_create(
                email=id_info['email'],
                defaults={
                    'username': f"{id_info.get('given_name', '')}_{uuid.uuid4().hex[:10]}",
                    'first_name': id_info.get('given_name', ''),
                    'last_name': id_info.get('family_name', '')
                }
            )
            
            refresh = RefreshToken.for_user(user)
            refresh['is_doctor'] = hasattr(user, 'doctor')
            access = AccessToken.for_user(user)
            access['is_doctor'] = hasattr(user, 'doctor')
            response = {
                'refresh': str(refresh),
                'access': str(access),
                'user_id': user.id,
                'email': user.email,
                'username': user.username            
            }
            return Response(response, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': 'Invalid token', 'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Server error', 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        
        
# Logout Api
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ Only logged-in users can logout

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")  # ✅ Get refresh token from request
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    
class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            token = serializer.dumps(email, salt='password-reset-salt')
            # Save the token to the database
            reset_token = PasswordResetToken(
                email=email,
                token=token,
                expires_at=timezone.now() + timedelta(hours=1)  # 1-hour expiry
            )
            reset_token.save()
            
            reset_link = f"https://juanpabloduarte.com/change_password?token={token}"
            send_mail(
                'Password Reset Request - Juan Pablo Duarte',
                f'''
                Hello,

                You requested a password reset for your account at Juan Pablo Duarte.
                Click the link below to reset your password:

                {reset_link}

                This link will expire in 1 hour. If you didn’t request this, ignore this email or contact support at support@juanpabloduarte.com.

                Thanks,
                The Juan Pablo Duarte Team
                ''',
                'noreply@juanpabloduarte.com',
                [email],
                fail_silently=False,
            )
        except User.DoesNotExist:
            pass  # Don’t reveal non-existence
        
        return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)
    
class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        new_password = request.data.get('new_password')

        if not new_password:
            return Response(
                {'error': 'New password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {'error': 'Password must be at least 8 characters long'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = request.user
            user.set_password(new_password)
            user.save()
            return Response(
                {'message': 'Password changed successfully'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': 'Failed to change password'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class ValidateTokenView(APIView):
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
            if not reset_token.is_valid():
                return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
            # Ensure the email exists
            User.objects.get(email=reset_token.email)
            return Response({'message': 'Token is valid'}, status=status.HTTP_200_OK)
        except PasswordResetToken.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        
class Me(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            # 'email': user.email,
            # 'username': user.username,
            'is_doctor': hasattr(user, 'doctor'),
            'first_name': user.first_name,
            'last_name': user.last_name,
        })

# Profile API
# auth/personal-data/
class UserProfileView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        logger.info(f"Updating user profile with data: {self.request.data}")
        if 'email' in self.request.data and self.request.data['email'] != self.request.user.email:
            raise serializers.ValidationError({'email': 'Email cannot be modified'})
        serializer.save()
        logger.info(f"Updated user profile: {serializer.data}")

# personal-data/
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        response_data = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "gender": user.gender,
            "phone_number": getattr(user, 'phone_number', ''),
            "born_date": getattr(user, 'born_date', ''),
            "profile_picture": user.profile_picture.url if user.profile_picture else None,
            "is_doctor": hasattr(user, 'doctor'),
            "favorite_doctors": DoctorSerializer(user.favorite_doctors.all(), many=True, context={'request': request}).data
        }
        logger.info(f"Fetching profile for user {user.id}")

        if Doctor.objects.filter(user=user).exists():
            doctor = user.doctor
            logger.info(f"Fetching profile for doctor {doctor.id}")
            response_data.update({
                "doctor_id": doctor.id,
                "exequatur": doctor.exequatur,
                "experience": doctor.experience,
                "description": doctor.description,
                "specializations": [{"id": specialty.id, "name": specialty.name} for specialty in doctor.specialties.all()],
                "clinics": [{"id": clinic.id, "name": clinic.name} for clinic in doctor.clinics.all()],
                "ensurances": [{"id": ensurance.id, "name": ensurance.name, "logo": ensurance.logo.url if ensurance.logo else None} for ensurance in doctor.ensurances.all()],
                "documents": [
                    {"id": doc.id, "url": doc.file.url, "description": doc.description}
                    for doc in doctor.documents.all()
                ],
                "taking_dates": doctor.taking_dates,
                "takes_virtual": doctor.takes_virtual,
                "takes_in_person": doctor.takes_in_person
            })

        return Response(response_data)

    def put(self, request):
        # logger.info(f"Updating profile for user {request.user.id} with data: {request.data}")
        logger.debug(f"Request data: {request.data['description']}")
        user = request.user
        data = request.data
        logger.debug(f"Request data: {data.get('description')}")
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.username = data.get('username', user.username)
        user.gender = data.get('gender', user.gender)

        phone_number = data.get('phone_number', '')
        if phone_number:
            if not re.fullmatch(r'\+?\d{7,15}', phone_number):
                return Response(
                    {"error": "Invalid phone number format. Please enter a valid phone number."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if hasattr(user, 'phone_number'):
            user.phone_number = data.get('phone_number', user.phone_number)

        if hasattr(user, 'gender'):
            user.gender = data.get('gender', user.gender)

        if hasattr(user, 'born_date'):
            born_date = data.get('born_date')
            if born_date:
                try:
                    user.born_date = datetime.strptime(born_date, '%Y-%m-%d').date()
                except ValueError:
                    logger.info('hola')
                    return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user.born_date = None


        if 'profile_picture' in request.FILES:
            try:
                user.profile_picture = request.FILES['profile_picture']
                user.full_clean()
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        elif data.get('profile_picture') == 'remove':
            if user.profile_picture:
                user.profile_picture.delete(save=False)
                user.profile_picture = None

        if hasattr(user, 'doctor'):
            doctor = user.doctor
            if 'description' in data:  # Handle description update
                doctor.description = data['description']
            if 'takes_virtual' in data:
                new_takes_virtual = data['takes_virtual']
                if new_takes_virtual:  # If takes_virtual is being set to True
                    Appointment.objects.filter(
                        appointment__week_availability__doctor=doctor,
                        appointment__place__isnull=True
                    ).update(active=True)
                else:  # If takes_virtual is being set to False
                    Appointment.objects.filter(
                        appointment__week_availability__doctor=doctor,
                        appointment__place__isnull=True
                    ).update(active=False)
                doctor.takes_virtual = new_takes_virtual
            if 'takes_in_person' in data:
                new_takes_in_person = data['takes_in_person']
                if new_takes_in_person:  # If takes_in_person is being set to True
                    Appointment.objects.filter(
                        appointment__week_availability__doctor=doctor,
                        appointment__place__isnull=False
                    ).update(active=True)
                else:  # If takes_in_person is being set to False
                    Appointment.objects.filter(
                        appointment__week_availability__doctor=doctor,
                        appointment__place__isnull=False
                    ).update(active=False)
                doctor.takes_in_person = new_takes_in_person
            doctor.save()

        user.save()
        return Response({
            "message": "Profile updated successfully",
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            'email': user.email,
            "last_name": user.last_name,
            "phone_number": getattr(user, 'phone_number', ''),
            "gender": user.gender,
            "born_date": getattr(user, 'born_date', ''),
            "is_doctor": hasattr(user, 'doctor'),
            "description": user.doctor.description if hasattr(user, 'doctor') else None,  # Add description
        })
    

class DoctorInFavorite(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, doctor_id):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            is_favorite = doctor in request.user.favorite_doctors.all()
            return Response({"is_favorite": is_favorite}, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ToggleFavoriteDoctorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, doctor_id):
        user = request.user
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            if doctor in user.favorite_doctors.all():
                user.favorite_doctors.remove(doctor)
                return Response({
                    "message": "Doctor removed from favorites",
                    "is_favorited": False
                }, status=status.HTTP_200_OK)
            else:
                user.favorite_doctors.add(doctor)
                return Response({
                    "message": "Doctor added to favorites",
                    "is_favorited": True
                }, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response(
                {"error": "Doctor not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class IsDoctorView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        is_doctor = hasattr(user, 'doctor')
        return Response({
            "is_doctor": is_doctor
        }, status=status.HTTP_200_OK)