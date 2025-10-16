from urllib import request
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth import authenticate
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.generics import RetrieveUpdateAPIView
from .serializers import UserProfileSerializer, SignupSerializer, DoctorSignupSerializer, EnsuranceSerializer
from .serializers import ClinicSerializer, SpecialtySerializer, DoctorSerializer, ReviewSerializer, WeekAvailabilitySerializer, WeekDaySerializer, ScheduleSerializer, AppointmentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework import serializers
from google.oauth2 import id_token
from google.auth.transport import requests
import os
import uuid
import re
import logging
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from django.utils import timezone
from datetime import timedelta, datetime, date
from .models import PasswordResetToken, Specialty, Clinic, DoctorDocument, Doctor, Ensurance, Review, Schedule, WeekAvailability, WeekDay, Appointment
from rest_framework.pagination import PageNumberPagination
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D  # Distance measure
from django.contrib.gis.geos import Point
from django.db.models import Q, Count
from django.db import transaction
import json
import requests as http_requests



logger = logging.getLogger(__name__)
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

@api_view(['GET'])
def get_data(request):
    return Response({"message": "Hello from Django!"})

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

class DoctorSignupView(APIView):
    permission_classes = []
    
    def post(self, request):
        serializer = DoctorSignupSerializer(data=request.data)
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
            id_info = id_token.verify_oauth2_token(token, requests.Request(), os.getenv('GOOGLE_CLIENT_ID'))
            
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
            id_info = id_token.verify_oauth2_token(id_token_str, requests.Request(), os.getenv('GOOGLE_CLIENT_ID'))
            
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

        phone_number = data.get('phone_number', '')
        if phone_number:
            if not re.fullmatch(r'\+?\d{7,15}', phone_number):
                return Response(
                    {"error": "Invalid phone number format. Please enter a valid phone number."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if hasattr(user, 'phone_number'):
            user.phone_number = data.get('phone_number', user.phone_number)
        if hasattr(user, 'born_date'):
            born_date = data.get('born_date')
            if born_date:
                try:
                    user.born_date = datetime.strptime(born_date, '%Y-%m-%d').date()
                except ValueError:
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
                        appointment__week_availability__doctor=user,
                        appointment__place__isnull=True
                    ).update(active=True)
                else:  # If takes_virtual is being set to False
                    Appointment.objects.filter(
                        appointment__week_availability__doctor=user,
                        appointment__place__isnull=True
                    ).update(active=False)
                doctor.takes_virtual = new_takes_virtual
            if 'takes_in_person' in data:
                new_takes_in_person = data['takes_in_person']
                if new_takes_in_person:  # If takes_in_person is being set to True
                    Appointment.objects.filter(
                        appointment__week_availability__doctor=user,
                        appointment__place__isnull=False
                    ).update(active=True)
                else:  # If takes_in_person is being set to False
                    Appointment.objects.filter(
                        appointment__week_availability__doctor=user,
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
            "last_name": user.last_name,
            "phone_number": getattr(user, 'phone_number', ''),
            "born_date": getattr(user, 'born_date', ''),
            "is_doctor": hasattr(user, 'doctor'),
            "description": user.doctor.description if hasattr(user, 'doctor') else None,  # Add description
        })
    
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
        
# DOCTOR MANAGEMENTS
class AvailableSpecialtiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        doctor = user.doctor
        # Get all specialties excluding the ones the doctor already has
        current_specialties = doctor.specialties.values_list('id', flat=True)
        available_specialties = Specialty.objects.exclude(id__in=current_specialties).values('id', 'name')
        print(available_specialties)
        return Response(list(available_specialties), status=status.HTTP_200_OK)

class AddSpecialtyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        specialty_id = request.data.get('specialty_id')
        if not specialty_id:
            return Response({"error": "Specialty ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            specialty = Specialty.objects.get(id=specialty_id)
            doctor = user.doctor
            if specialty in doctor.specialties.all():
                return Response({"error": "Specialty already assigned"}, status=status.HTTP_400_BAD_REQUEST)
            
            doctor.specialties.add(specialty)
            return Response({"message": "Specialty added successfully"}, status=status.HTTP_200_OK)
        except Specialty.DoesNotExist:
            return Response({"error": "Specialty not found"}, status=status.HTTP_404_NOT_FOUND)
        
class AvailableClinicsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        doctor = user.doctor
        # Get all clinics excluding the ones the doctor already has
        current_clinics = doctor.clinics.values_list('id', flat=True)
        available_clinics = Clinic.objects.exclude(id__in=current_clinics).values('id', 'name', 'google_place_id')
        
        return Response(list(available_clinics), status=status.HTTP_200_OK)

class AddClinicView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        clinic_id = request.data.get('clinic_id')
        if not clinic_id:
            return Response({"error": "Clinic ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            clinic = Clinic.objects.get(id=clinic_id)
            doctor = user.doctor
            if clinic in doctor.clinics.all():
                return Response({"error": "Clinic already assigned"}, status=status.HTTP_400_BAD_REQUEST)
            
            doctor.clinics.add(clinic)
            return Response({"message": "Clinic added successfully"}, status=status.HTTP_200_OK)
        except Clinic.DoesNotExist:
            return Response({"error": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# View to remove a specialization from a doctor's profile
class RemoveSpecialtyView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, specialty_id):
        # Get the authenticated user
        user = request.user
        
        # Check if the user is a doctor
        if not hasattr(user, 'doctor'):
            return Response(
                {"error": "User is not a doctor"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get the doctor instance
        doctor = user.doctor
        
        try:
            # Retrieve the specialization by ID
            specialty = Specialty.objects.get(id=specialty_id)
            
            # Check if the specialization is associated with the doctor
            if specialty not in doctor.specialties.all():
                return Response(
                    {"error": "Specialty not associated with this doctor"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Remove the specialization
            doctor.specialties.remove(specialty)
            return Response(
                {"message": "Specialty removed successfully"},
                status=status.HTTP_200_OK
            )
        
        except Specialty.DoesNotExist:
            return Response(
                {"error": "Specialty not found"},
                status=status.HTTP_404_NOT_FOUND
            )

# View to remove a clinic from a doctor's profile
class RemoveClinicView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, clinic_id):
        # Get the authenticated user
        user = request.user
        
        # Check if the user is a doctor
        if not hasattr(user, 'doctor'):
            return Response(
                {"error": "User is not a doctor"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get the doctor instance
        doctor = user.doctor
        
        try:
            # Retrieve the clinic by ID
            clinic = Clinic.objects.get(id=clinic_id)
            
            # Check if the clinic is associated with the doctor
            if clinic not in doctor.clinics.all():
                return Response(
                    {"error": "Clinic not associated with this doctor"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Remove the clinic
            doctor.clinics.remove(clinic)
            return Response(
                {"message": "Clinic removed successfully"},
                status=status.HTTP_200_OK
            )
        
        except Clinic.DoesNotExist:
            return Response(
                {"error": "Clinic not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class AvailableEnsurancesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        doctor = user.doctor
        # Get all ensurances excluding the ones the doctor already has
        current_ensurances = doctor.ensurances.values_list('id', flat=True)
        available_ensurances = Ensurance.objects.exclude(id__in=current_ensurances).values('id', 'name')
        return Response(list(available_ensurances), status=status.HTTP_200_OK)

class AddEnsuranceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)

        insurance_id = request.data.get('insurance_id')
        if not insurance_id:
            return Response({"error": "Insurance ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            insurance = Ensurance.objects.get(id=insurance_id)
            doctor = user.doctor
            if insurance in doctor.ensurances.all():
                return Response({"error": "Insurance already assigned"}, status=status.HTTP_400_BAD_REQUEST)

            doctor.ensurances.add(insurance)
            return Response({"message": "Insurance added successfully"}, status=status.HTTP_200_OK)
        except Ensurance.DoesNotExist:
            return Response({"error": "Insurance not found"}, status=status.HTTP_404_NOT_FOUND)

class RemoveEnsuranceView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, ensurance_id):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        doctor = user.doctor
        try:
            ensurance = Ensurance.objects.get(id=ensurance_id)
            if ensurance not in doctor.ensurances.all():
                return Response({"error": "Ensurance not associated with this doctor"}, status=status.HTTP_400_BAD_REQUEST)
            
            doctor.ensurances.remove(ensurance)
            return Response({"message": "Ensurance removed successfully"}, status=status.HTTP_200_OK)
        except Ensurance.DoesNotExist:
            return Response({"error": "Ensurance not found"}, status=status.HTTP_404_NOT_FOUND)

class UpdateDoctorDescriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            logger.error(f"User {user.id} is not a doctor")
            return Response({"error": "User is not a doctor"}, status=status.HTTP_403_FORBIDDEN)

        serializer = DoctorSerializer(user.doctor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Description updated for doctor {user.id}")
            return Response({"message": "Description updated successfully"}, status=status.HTTP_200_OK)
        logger.error(f"Description update failed for doctor {user.id}: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# DOCTOR DOCUMENT MANAGEMENT
class UploadDoctorDocumentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)

        doctor = user.doctor
        if 'document' not in request.FILES:
            return Response({"error": "No document provided"}, status=status.HTTP_400_BAD_REQUEST)

        document_file = request.FILES['document']
        description = request.data.get('description', '')

        doctor_document = DoctorDocument(
            doctor=doctor,
            file=document_file,
            description=description
        )
        doctor_document.save()

        return Response({
            "message": "Document uploaded successfully",
            "id": doctor_document.id,
            "url": doctor_document.file.url,
            "description": doctor_document.description,
            "uploaded_at": doctor_document.uploaded_at.isoformat()  # Add this
        }, status=status.HTTP_201_CREATED)
    
class DeleteDoctorDocumentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, document_id):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_403_FORBIDDEN)

        try:
            document = DoctorDocument.objects.get(id=document_id, doctor=user.doctor)
            document.delete()
            return Response({"message": "Document deleted successfully"}, status=status.HTTP_200_OK)
        except DoctorDocument.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

# DATES SYSTEM

class DoctorPagination(PageNumberPagination):
    page_size = 6  # 10 doctors per page
    page_size_query_param = 'page_size'
    max_page_size = 100

# api/views.py
class DoctorSearchView(APIView):
    permission_classes = [AllowAny]
    pagination_class = DoctorPagination

    def get(self, request):
        queryset = Doctor.objects.all()
        specialty = request.query_params.get('specialty')
        ensurance = request.query_params.get('ensurance')
        location_name = request.query_params.get('location')  # e.g., "Santo Domingo, Distrito Nacional"
        latitude = request.query_params.get('latitude')
        longitude = request.query_params.get('longitude')
        radius = request.query_params.get('radius', 10)  # Default 10 km
        sex = request.query_params.get('sex')
        takes_dates = request.query_params.get('takes_dates')
        experience_min = request.query_params.get('experience_min')

        # Filter by city/state if location is provided
        if location_name:
            try:
                city, state = [part.strip() for part in location_name.split(',', 1)]
            except ValueError:
                city, state = location_name.strip(), None
            clinic_filter = Q()
            if city:
                clinic_filter |= Q(city__iexact=city)
            if state:
                clinic_filter |= Q(state__iexact=state)
            matching_clinics = Clinic.objects.filter(clinic_filter)
            queryset = queryset.filter(clinics__in=matching_clinics)

        # Existing filters
        if experience_min and experience_min != 'any':
            try:
                queryset = queryset.filter(experience__gte=int(experience_min))
            except ValueError:
                pass
        if specialty:
            queryset = queryset.filter(specialties__name=specialty)
        if ensurance:
            queryset = queryset.filter(ensurances__name=ensurance)
        if sex and sex != 'both':
            queryset = queryset.filter(sex=sex)
        if takes_dates:
            if takes_dates == 'true':
                queryset = queryset.filter(taking_dates=True)
            elif takes_dates == 'virtual':
                queryset = queryset.filter(taking_dates=True, takes_virtual=True)
            elif takes_dates == 'in_person':
                queryset = queryset.filter(taking_dates=True, takes_in_person=True)

        # Geospatial filter if lat/lon provided
        if latitude and longitude:
            try:
                lat = float(latitude)
                lon = float(longitude)
                radius_km = float(radius)
                user_point = Point(lon, lat, srid=4326)
                queryset = queryset.filter(
                    clinics__location__distance_lte=(user_point, D(km=radius_km))
                ).annotate(
                    distance=Distance('clinics__location', user_point)
                ).order_by('distance')
            except ValueError:
                return Response({"error": "Invalid latitude, longitude, or radius"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = queryset.distinct()

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = DoctorSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)
    
class DoctorDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, doctor_id):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            serializer = DoctorSerializer(doctor, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ReviewPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ReviewsDetailView(APIView):
    permission_classes = [AllowAny]
    pagination_class = ReviewPagination

    def get(self, request, doctor_id):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            reviews = Review.objects.filter(doctor=doctor).order_by('-created_at')
            total_reviews = reviews.count()

            # Compute rating distribution
            rating_distribution = (
                reviews.values('rating')
                .annotate(count=Count('rating'))
                .order_by('rating')
            )
            # Initialize counts for all ratings (1 to 5)
            distribution = {str(i): 0 for i in range(1, 6)}
            for item in rating_distribution:
                distribution[str(item['rating'])] = item['count']

            paginator = self.pagination_class()
            page = paginator.paginate_queryset(reviews, request)
            serializer = ReviewSerializer(page, many=True)

            return Response({
                'reviews': serializer.data,
                'total_reviews': total_reviews,
                'page_size': paginator.page_size,
                'current_page': paginator.page.number,
                'total_pages': paginator.page.paginator.num_pages,
                'rating_distribution': distribution,
            }, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CreateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, doctor_id):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            user = request.user

            # Check if user has already reviewed this doctor
            if Review.objects.filter(user=user, doctor=doctor).exists():
                return Response(
                    {"error": "You have already reviewed this doctor"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            data = {
                'user_id': user.id,
                'doctor_id': doctor.id,
                'rating': request.data.get('rating'),
                'headline': request.data.get('headline', ''),
                'body': request.data.get('body', '')
            }

            serializer = ReviewSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Review created successfully"},
                    status=status.HTTP_201_CREATED
                )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Doctor.DoesNotExist:
            return Response(
                {"error": "Doctor not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class UpdateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
            data = {
                'user_id': request.user.id,
                'doctor_id': review.doctor.id,
                'rating': request.data.get('rating', review.rating),
                'headline': request.data.get('headline', review.headline),
                'body': request.data.get('body', review.body)
            }
            serializer = ReviewSerializer(review, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Review updated successfully"},
                    status=status.HTTP_200_OK
                )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Review.DoesNotExist:
            return Response(
                {"error": "Review not found or not authorized"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeleteReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
            review.delete()
            return Response(
                {"message": "Review deleted successfully"},
                status=status.HTTP_200_OK
            )
        except Review.DoesNotExist:
            return Response(
                {"error": "Review not found or not authorized"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, doctor_id):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            review = Review.objects.filter(user=request.user, doctor=doctor).first()
            if review:
                serializer = ReviewSerializer(review)
                return Response({"review": serializer.data}, status=status.HTTP_200_OK)
            return Response({"review": None}, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response(
                {"error": "Doctor not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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
    
class AllSpecialtiesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        specialties = Specialty.objects.all()
        serializer = SpecialtySerializer(specialties, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# View to return all clinics
class AllClinicsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        clinics = Clinic.objects.all()
        serializer = ClinicSerializer(clinics, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# View to return all ensurances
class AllEnsurancesView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        ensurances = Ensurance.objects.all()
        serializer = EnsuranceSerializer(ensurances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class IsDoctorView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        is_doctor = hasattr(user, 'doctor')
        return Response({
            "is_doctor": is_doctor
        }, status=status.HTTP_200_OK)
    
class CreateScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['doctor'] = user.doctor.id
        serializer = ScheduleSerializer(data=data)
        if serializer.is_valid():
            schedule = serializer.save()
            return Response({
                "message": "Schedule created successfully",
                "id": schedule.id,
                "title": schedule.title,
                "hours": schedule.hours,
                "place": schedule.place.id if schedule.place else None,
                "created_at": schedule.created_at.isoformat()
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, schedule_id):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            schedule = Schedule.objects.get(id=schedule_id, doctor=user.doctor)
            data = request.data.copy()
            data['doctor'] = user.doctor.id
            serializer = ScheduleSerializer(schedule, data=data, partial=True)
            if serializer.is_valid():
                schedule = serializer.save()
                return Response({
                    "message": "Schedule updated successfully",
                    "id": schedule.id,
                    "title": schedule.title,
                    "hours": schedule.hours,
                    "place": schedule.place.id if schedule.place else None,
                    "created_at": schedule.created_at.isoformat()
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Schedule.DoesNotExist:
            return Response({"error": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND)
        
class DeleteScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, schedule_id):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            schedule = Schedule.objects.get(id=schedule_id, doctor=user.doctor)
            schedule.delete()
            return Response({"message": "Schedule deleted successfully"}, status=status.HTTP_200_OK)
        except Schedule.DoesNotExist:
            return Response({"error": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND)
        
class MySchedulesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_403_FORBIDDEN)

        schedules = Schedule.objects.filter(doctor=user.doctor)
        serializer = ScheduleSerializer(schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateWeekDayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = WeekDaySerializer(data=request.data)
        if serializer.is_valid():
            week_availability = serializer.validated_data['week_availability']
            if week_availability.doctor != user:
                return Response({"error": "Unauthorized week availability"}, status=status.HTTP_403_FORBIDDEN)
            week_day = serializer.save()
            return Response({
                "message": "Week day created successfully",
                "id": week_day.id,
                "day": week_day.day.isoformat(),
                "hours": week_day.hours,
                "place": week_day.place.id if week_day.place else None
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class WeekScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        doctor = user.doctor

        week = request.data.get('week')
        try:
            parsed_week = datetime.strptime(week, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format for 'week'. Expected YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        normalized_week = parsed_week
        weekdays = request.data.get('weekdays', [])

        if not week or not weekdays:
            return Response({"error": "Week and at least one weekday are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Create WeekAvailability
                week_data = {
                    'doctor': user.id,
                    'week': normalized_week
                }
                week_serializer = WeekAvailabilitySerializer(data=week_data)
                if not week_serializer.is_valid():
                    return Response(week_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                # Explicitly pass doctor to save
                week_availability = week_serializer.save(doctor=user)

                # Validate that all clinics belong to the doctor
                doctor_clinics = doctor.clinics.values_list('id', flat=True)
                for weekday in weekdays:
                    place_id = weekday.get('place')
                    if place_id and place_id not in doctor_clinics:
                        return Response(
                            {"error": f"Clinic ID {place_id} is not associated with this doctor"},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                # Create WeekDay entries
                created_weekdays = []
                for weekday in weekdays:

                    weekday_data = {
                        'week_availability': week_availability.id,
                        'day': weekday['day'],
                        'hours': weekday['hours'],
                        'place': weekday.get('place'),
                    }
                    weekday_serializer = WeekDaySerializer(data=weekday_data)
                    if not weekday_serializer.is_valid():
                        return Response(weekday_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    # Explicitly pass doctor to save
                    week_day = weekday_serializer.save()
                    created_weekdays.append({
                        'id': week_day.id,
                        'day': week_day.day,
                        'hours': week_day.hours,
                        'place': week_day.place.id if week_day.place else None,
                    })


                return Response({
                    "message": "Week schedule created successfully",
                    "week_availability": {
                        'id': week_availability.id,
                        'week': week_availability.week,
                        'doctor': week_availability.doctor.id
                    },
                    "weekdays": created_weekdays
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request):
        user = request.user
        
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        week_availability_id = request.data.get('week_availability_id')
        week = request.data.get('week')
        weekdays = request.data.get('weekdays', [])

        if not week_availability_id or not week or not weekdays:
            return Response({"error": "Week availability ID, week, and weekdays are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Verify WeekAvailability exists and belongs to user
                week_availability = WeekAvailability.objects.get(id=week_availability_id, doctor=user)
                week_data = {'week': week}
                week_serializer = WeekAvailabilitySerializer(week_availability, data=week_data, partial=True)
                if not week_serializer.is_valid():
                    return Response(week_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                week_serializer.save()

                # Validate clinics
                doctor_clinics = user.doctor.clinics.values_list('id', flat=True)
                for weekday in weekdays:
                    place_id = weekday.get('place')
                    if place_id and place_id not in doctor_clinics:
                        return Response(
                            {"error": f"Clinic ID {place_id} is not associated with this doctor"},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                # Delete existing WeekDay entries
                WeekDay.objects.filter(week_availability=week_availability).delete()

                # Create new WeekDay entries
                created_weekdays = []
                for weekday in weekdays:
                    weekday_data = {
                        'week_availability': week_availability.id,
                        'day': weekday['day'],
                        'hours': weekday['hours'],
                        'place': weekday.get('place'),
                    }
                    weekday_serializer = WeekDaySerializer(data=weekday_data)
                    if not weekday_serializer.is_valid():
                        return Response(weekday_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    week_day = weekday_serializer.save()
                    created_weekdays.append({
                        'id': week_day.id,
                        'day': week_day.day,
                        'hours': week_day.hours,
                        'place': week_day.place.id if week_day.place else None,
                    })

                return Response({
                    "message": "Week schedule updated successfully",
                    "week_availability": {
                        'id': week_availability.id,
                        'week': week_availability.week,
                        'doctor': week_availability.doctor.id
                    },
                    "weekdays": created_weekdays
                }, status=status.HTTP_200_OK)

        except WeekAvailability.DoesNotExist:
            return Response({"error": "Week availability not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WeekSchedulesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Fetch all WeekAvailability objects for the user
            week_availabilities = WeekAvailability.objects.filter(doctor=user).order_by('week')

            # Serialize WeekAvailability with nested WeekDay objects
            response_data = []
            for week_availability in week_availabilities:
                weekdays = WeekDay.objects.filter(week_availability=week_availability)
                week_serializer = WeekAvailabilitySerializer(week_availability)
                weekday_serializer = WeekDaySerializer(weekdays, many=True)
                
                response_data.append({
                    'week_availability': week_serializer.data,
                    'weekdays': weekday_serializer.data
                })

            return Response({
                "weekschedules": response_data
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": "Failed to fetch week schedules"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ClinicDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, clinic_id):
        try:
            clinic = Clinic.objects.get(id=clinic_id)
            doctor = request.user.doctor
            # Ensure the clinic is associated with the authenticated doctor
            if clinic not in doctor.clinics.all():
                return Response({'error': 'Clinic not associated with this doctor'}, status=status.HTTP_403_FORBIDDEN)
            serializer = ClinicSerializer(clinic)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Clinic.DoesNotExist:
            return Response({'error': 'Clinic not found'}, status=status.HTTP_404_NOT_FOUND)

class AvailableWeeksView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user

        today = date.today()
        start_of_this_week = today - timedelta(days=(today.weekday() + 1) % 7)
        
        # Generate next 10 weeks from this Monday
        candidate_weeks = [start_of_this_week + timedelta(weeks=i) for i in range(6)]

        # Get already scheduled weeks for the user
        taken_weeks = set(
            WeekAvailability.objects.filter(doctor=user).values_list('week', flat=True)
        )

        # Filter out taken weeks
        free_weeks = [w for w in candidate_weeks if w not in taken_weeks]
        logger.info(f"Free weeks for user {user.id}: {free_weeks} and {taken_weeks}")
        return Response({
            "available_weeks": [w.isoformat() for w in free_weeks]
        })
    
# views.py
class DoctorAvailableDaysView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, doctor_id):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            if not doctor.taking_dates:
                return Response({
                    "error": "Doctor is not taking appointments",
                    "available_days": []
                }, status=status.HTTP_200_OK)

            weekdays = WeekDay.objects.filter(
                week_availability__doctor=doctor.user
            ).select_related('place').order_by('day')

            today = date.today()
            available_days = []
            for weekday in weekdays:
                if weekday.day < today:
                    continue

                # Get booked hours for this weekday
                booked_hours = Appointment.objects.filter(
                    appointment=weekday
                ).values_list('time', flat=True)

                # Remove booked hours from available hours
                available_hours = [
                    hour for hour in weekday.hours
                    if hour not in booked_hours
                ]

                # Only include days with available hours
                if available_hours:
                    available_days.append({
                        'id': weekday.id,
                        'day': weekday.day.isoformat(),
                        'hours': available_hours,
                        'place': {
                            'id': weekday.place.id,
                            'name': weekday.place.name,
                            'city': weekday.place.city,
                            'state': weekday.place.state,
                            'address': weekday.place.address
                        } if weekday.place else None,
                        'is_virtual': weekday.place is None
                    })

            return Response({
                "available_days": available_days
            }, status=status.HTTP_200_OK)

        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CreateAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        weekday_id = request.data.get('weekday_id')
        hour = request.data.get('hour')

        if not weekday_id or not hour:
            return Response({
                'error': 'weekday_id and hour are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            weekday = WeekDay.objects.get(id=weekday_id)
            # Verify hour is available
            if hour not in weekday.hours:
                return Response({
                    'error': 'Selected hour is not available'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Check if the hour is already booked
            if Appointment.objects.filter(appointment=weekday, time=hour).exists():
                return Response({
                    'error': 'This time slot is already booked'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create appointment
            appointment = Appointment(
                patient=user,
                appointment=weekday,
                time=hour,
            )
            appointment.save()

            return Response({
                'message': 'Appointment created successfully',
                'appointment': {
                    'id': appointment.id,
                    'weekday_id': weekday.id,
                    'day': weekday.day.isoformat(),
                    'hour': hour,
                    'doctor': f"{appointment.appointment.week_availability.doctor.first_name} {appointment.appointment.week_availability.doctor.last_name}",
                }
            }, status=status.HTTP_201_CREATED)

        except WeekDay.DoesNotExist:
            return Response({
                'error': 'WeekDay not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class DeleteWeekAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, week_availability_id):
        user = request.user
        
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            week_availability = WeekAvailability.objects.get(id=week_availability_id, doctor=user)
            week_availability.delete()
            return Response({"message": "Week availability deleted successfully"}, status=status.HTTP_200_OK)
        except WeekAvailability.DoesNotExist:
            return Response({"error": "Week availability not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UserAppointmentsView(APIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        is_doctor = hasattr(user, 'doctor')
        status_filter = request.query_params.get('status', None)

        # Base queryset based on user type
        if is_doctor:
            appointments = Appointment.objects.filter(
                appointment__week_availability__doctor=user
            ).select_related(
                'patient', 'appointment', 'appointment__week_availability', 'appointment__place'
            ).order_by('appointment__day', 'time')
        else:
            appointments = Appointment.objects.filter(
                patient=user
            ).select_related(
                'appointment', 'appointment__week_availability', 'appointment__place'
            ).order_by('appointment__day', 'time')

        # Filter by status if provided
        if status_filter == 'active':
            appointments = appointments.filter(active=True)
        elif status_filter == 'inactive':
            appointments = appointments.filter(active=False)

        # Serialize appointments
        serializer = self.serializer_class(
            appointments, 
            many=True, 
            context={'request': request}  # Pass request context for is_favorited, etc.
        )
        serialized_data = serializer.data

        # Separate appointments based on active status if no specific filter
        active_appointments = []
        inactive_appointments = []
        
        if status_filter is None or status_filter not in ['active', 'inactive']:
            active_appointments = [appt for appt in serialized_data if appt['active']]
            inactive_appointments = [appt for appt in serialized_data if not appt['active']]
        elif status_filter == 'active':
            active_appointments = serialized_data
        elif status_filter == 'inactive':
            inactive_appointments = serialized_data

        # Return response based on status filter
        if status_filter == 'active':
            return Response({'active_appointments': active_appointments}, status=status.HTTP_200_OK)
        elif status_filter == 'inactive':
            return Response({'inactive_appointments': inactive_appointments}, status=status.HTTP_200_OK)
        else:
            return Response({
                'active_appointments': active_appointments,
                'inactive_appointments': inactive_appointments
            }, status=status.HTTP_200_OK)            
class DeleteAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, appointment_id):
        try:
            appointment = Appointment.objects.get(id=appointment_id)
            if appointment.appointment.week_availability.doctor == request.user or appointment.patient == request.user: 
                appointment.delete()  # Delete the appointment
            return Response({"message": "Appointment deleted successfully"}, status=status.HTTP_200_OK)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found or not authorized"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DoctorPatientsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_403_FORBIDDEN)

        try:
            # Fetch appointments where the doctor matches the user
            appointments = Appointment.objects.filter(
                appointment__week_availability__doctor=user,
                active=True
            ).select_related(
                'patient', 'appointment', 'appointment__week_availability', 'appointment__place'
            ).order_by('patient__id', 'appointment__day', 'time')

            # Create a map to store unique patients and their appointments
            patient_map = {}
            for appt in appointments:
                patient = appt.patient
                if patient.id not in patient_map:
                    patient_map[patient.id] = {
                        'patient': patient,
                        'appointments': []
                    }
                patient_map[patient.id]['appointments'].append({
                    'appointment_id': appt.id,
                    'weekday': WeekDaySerializer(appt.appointment).data,
                    'time': appt.time,
                    'active': appt.active
                })

            # Convert to list of patient data
            response_data = [
                {
                    'patient': {
                        'id': data['patient'].id,
                        'first_name': data['patient'].first_name,
                        'last_name': data['patient'].last_name,
                        'profile_picture': data['patient'].profile_picture.url if data['patient'].profile_picture else None
                    },
                    'last_appointment': data['appointments'][0]['weekday']['day'] if data['appointments'] else None
                }
                for data in patient_map.values()
            ]

            return Response({
                'patients': response_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"DoctorPatientsView error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)