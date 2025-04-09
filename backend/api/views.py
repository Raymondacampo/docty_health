from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.generics import RetrieveUpdateAPIView
from .serializers import UserProfileSerializer, SignupSerializer, DoctorSignupSerializer, DoctorAvailabilitySerializer, DayOfWeekSerializer, EnsuranceSerializer, ClinicSerializer, SpecialtySerializer, DoctorSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from google.oauth2 import id_token
from google.auth.transport import requests
import os
import uuid
import re
import logging
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from django.utils import timezone
from datetime import timedelta, datetime
from .models import PasswordResetToken, Specialty, Clinic, DoctorDocument, Doctor, DoctorAvailability, Appointment, DayOfWeek, Ensurance
from rest_framework.pagination import PageNumberPagination
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D  # Distance measure
from django.contrib.gis.geos import Point
from django.db.models import Q

logger = logging.getLogger(__name__)
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

@api_view(['GET'])
def get_data(request):
    return Response({"message": "Hello from Django!"})

# Generate JWT Tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}

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
        logger.info("DoctorSignupView POST request received: %s", request.data)
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

# Login API
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(email=email, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'email': user.email
                }
            }, status=status.HTTP_200_OK)
        
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

# Google Auth
class GoogleLogin(APIView):
    permission_classes = [AllowAny]  # Explicitly allow all requests

    def post(self, request):
        print("GoogleLogin: Request received")  # Debug start
        token = request.data.get('token')
        if not token:
            print("GoogleLogin: No token provided")
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            print("GoogleLogin: Validating token:", token[:10] + "...")  # Truncate for readability
            id_info = id_token.verify_oauth2_token(token, requests.Request(), os.getenv('GOOGLE_CLIENT_ID'))
            print("GoogleLogin: Token validated, ID Info:", id_info)
            
            user, created = User.objects.get_or_create(
                email=id_info['email'],
                defaults={
                    'username': f"{id_info.get('given_name', '')}_{uuid.uuid4().hex[:10]}",
                    'first_name': id_info.get('given_name', ''),
                    'last_name': id_info.get('family_name', '')
                }
            )
            print("GoogleLogin: User:", user.email, "Created:", created)
            
            refresh = RefreshToken.for_user(user)
            response = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'email': user.email,
                'username': user.username            
            }
            print("GoogleLogin: Success, Response:", response)
            return Response(response, status=status.HTTP_200_OK)
        except ValueError as e:
            print("GoogleLogin: Token validation failed:", str(e))
            return Response({'error': 'Invalid token', 'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("GoogleLogin: Unexpected error:", str(e))
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
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not all([token, new_password]):
            return Response({'error': 'Token and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
            if not reset_token.is_valid():
                return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
            
            email = serializer.loads(token, salt='password-reset-salt', max_age=3600)
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            
            # Mark the token as used
            reset_token.used = True
            reset_token.save()
            
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
        except (PasswordResetToken.DoesNotExist, SignatureExpired, BadSignature):
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
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
        
# Profile API
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
            "is_doctor": hasattr(user, 'doctor')
        }

        if hasattr(user, 'doctor'):
            doctor = user.doctor
            response_data.update({
                "exequatur": doctor.exequatur,
                "experience": doctor.experience,
                "specializations": [{"id": specialty.id, "name": specialty.name} for specialty in doctor.specialties.all()],
                "clinics": [{"id": clinic.id, "name": clinic.name} for clinic in doctor.clinics.all()],
                "ensurances": [{"id": ensurance.id, "name": ensurance.name, "logo": ensurance.logo.url if ensurance.logo else None} for ensurance in doctor.ensurances.all()],
                "documents": [
                    {"id": doc.id, "url": doc.file.url, "description": doc.description}
                    for doc in doctor.documents.all()
                ],
                "availabilities": [
                    {
                        "id": avail.id,
                        "clinic": {"id": avail.clinic.id, "name": avail.clinic.name} if avail.clinic else None,
                        "specialization": {"id": avail.specialization.id, "name": avail.specialization.name} if avail.specialization else None,
                        "days": [{"id": day.id, "name": day.name} for day in avail.days.all()],
                        "start_time": avail.start_time.strftime('%H:%M'),
                        "end_time": avail.end_time.strftime('%H:%M'),
                        "slot_duration": avail.slot_duration,
                        "virtual": avail.virtual,
                        "active": avail.active
                    }
                    for avail in DoctorAvailability.objects.filter(doctor=doctor)
                ],
                "taking_dates": doctor.taking_dates,
                "takes_virtual": doctor.takes_virtual,
                "takes_in_person": doctor.takes_in_person
            })

        return Response(response_data)

    def put(self, request):
        user = request.user
        data = request.data

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
            user.born_date = data.get('born_date', user.born_date)

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
            if 'takes_virtual' in data:
                new_takes_virtual = data['takes_virtual']
                if new_takes_virtual:  # If takes_virtual is being set to True
                    DoctorAvailability.objects.filter(doctor=doctor, virtual=True).update(active=True)
                else:  # If takes_virtual is being set to False
                    DoctorAvailability.objects.filter(doctor=doctor, virtual=True).update(active=False)
                doctor.takes_virtual = new_takes_virtual
            if 'takes_in_person' in data:
                new_takes_in_person = data['takes_in_person']
                if new_takes_in_person:  # If takes_in_person is being set to True
                    DoctorAvailability.objects.filter(
                        doctor=doctor,
                        virtual=False,
                        clinic__isnull=False,
                        specialization__isnull=False
                    ).update(active=True)
                else:  # If takes_in_person is being set to False
                    DoctorAvailability.objects.filter(
                        doctor=doctor,
                        virtual=False,
                        clinic__isnull=False,
                        specialization__isnull=False
                    ).update(active=False)
                doctor.takes_in_person = new_takes_in_person
            doctor.update_taking_dates()  # Recalculate taking_dates based on active availabilities
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
            "taking_dates": user.doctor.taking_dates if hasattr(user, 'doctor') else None,
            "takes_virtual": user.doctor.takes_virtual if hasattr(user, 'doctor') else None,
            "takes_in_person": user.doctor.takes_in_person if hasattr(user, 'doctor') else None
        })
        
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
        
        ensurance_id = request.data.get('ensurance_id')
        if not ensurance_id:
            return Response({"error": "Ensurance ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            ensurance = Ensurance.objects.get(id=ensurance_id)
            doctor = user.doctor
            if ensurance in doctor.ensurances.all():
                return Response({"error": "Ensurance already assigned"}, status=status.HTTP_400_BAD_REQUEST)
            
            doctor.ensurances.add(ensurance)
            return Response({"message": "Ensurance added successfully"}, status=status.HTTP_200_OK)
        except Ensurance.DoesNotExist:
            return Response({"error": "Ensurance not found"}, status=status.HTTP_404_NOT_FOUND)

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

# CREATION
class CreateDoctorAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['doctor'] = user.doctor.id

        slot_duration = data.get('slot_duration', 30)
        if slot_duration not in [30, 45, 60]:
            return Response({"error": "Slot duration must be 30, 45, or 60 minutes"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DoctorAvailabilitySerializer(data=data)
        if serializer.is_valid():
            availability = serializer.save()
            doctor = user.doctor
            if availability.virtual:
                doctor.takes_virtual = True
            else:
                doctor.takes_in_person = True  # Set for in-person availability
            doctor.update_taking_dates()  # Reflect active availabilities
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# AVAILABILITY
class AvailableSlotsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, doctor_id, date):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            date_obj = datetime.strptime(date, '%Y-%m-%d').date()
            day_name = date_obj.strftime('%A')

            availabilities = DoctorAvailability.objects.filter(
                doctor=doctor,
                days__name=day_name
            )

            available_slots = []
            for availability in availabilities:
                start = datetime.combine(date_obj, availability.start_time)
                end = datetime.combine(date_obj, availability.end_time)
                slot_duration = timedelta(minutes=availability.slot_duration)

                current = start
                while current + slot_duration <= end:
                    slot_end = current + slot_duration
                    # Fixed: Use Q objects as a single filter argument
                    overlapping_appointments = Appointment.objects.filter(
                        doctor=doctor,
                        date=date_obj,
                        start_time__lt=slot_end.time(),
                        end_time__gt=current.time()
                    )
                    if not overlapping_appointments.exists():
                        available_slots.append({
                            'start_time': current.time().strftime('%H:%M'),
                            'end_time': slot_end.time().strftime('%H:%M')
                        })
                    current += slot_duration

            return Response(available_slots, status=status.HTTP_200_OK)

        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        
# CREATE
class BookAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        try:
            doctor = Doctor.objects.get(id=data['doctor_id'])
            date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            start_time = datetime.strptime(data['start_time'], '%H:%M').time()
            slot_duration = data.get('slot_duration', 30)  # From availability
            end_time = (datetime.combine(date, start_time) + timedelta(minutes=slot_duration)).time()

            # Check availability and slot
            availability = DoctorAvailability.objects.filter(
                doctor=doctor,
                days__name=date.strftime('%A'),
                start_time__lte=start_time,
                end_time__gte=end_time
            ).first()
            if not availability:
                return Response({"error": "Slot not available"}, status=status.HTTP_400_BAD_REQUEST)

            # Check no overlapping appointments
            overlapping = Appointment.objects.filter(
                doctor=doctor,
                date=date,
                start_time__lt=end_time,
                end_time__gt=start_time
            )
            if overlapping.exists():
                return Response({"error": "Slot already booked"}, status=status.HTTP_400_BAD_REQUEST)

            appointment = Appointment.objects.create(
                doctor=doctor,
                patient=user,
                date=date,
                start_time=start_time,
                end_time=end_time
            )
            return Response({
                "message": "Appointment booked successfully",
                "id": appointment.id
            }, status=status.HTTP_201_CREATED)

        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({"error": "Invalid date or time format"}, status=status.HTTP_400_BAD_REQUEST)
        
class UpdateDoctorAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, availability_id):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            availability = DoctorAvailability.objects.get(id=availability_id, doctor=user.doctor)
            data = request.data.copy()
            data['doctor'] = user.doctor.id

            slot_duration = data.get('slot_duration', availability.slot_duration)
            if slot_duration not in [30, 45, 60]:
                return Response({"error": "Slot duration must be 30, 45, or 60 minutes"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = DoctorAvailabilitySerializer(availability, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                # Update doctor's taking_dates, takes_virtual, and takes_in_person
                availability.doctor.update_taking_dates()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DoctorAvailability.DoesNotExist:
            return Response({"error": "Availability not found"}, status=status.HTTP_404_NOT_FOUND)

class DeleteDoctorAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, availability_id):
        user = request.user
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            availability = DoctorAvailability.objects.get(id=availability_id, doctor=user.doctor)
            availability.delete()
            # Update doctor's taking_dates, takes_virtual, and takes_in_person
            user.doctor.update_taking_dates()
            return Response({"message": "Availability deleted successfully"}, status=status.HTTP_200_OK)
        except DoctorAvailability.DoesNotExist:
            return Response({"error": "Availability not found"}, status=status.HTTP_404_NOT_FOUND)

class DayOfWeekListView(generics.ListAPIView):
    queryset = DayOfWeek.objects.all()
    serializer_class = DayOfWeekSerializer

class DoctorPagination(PageNumberPagination):
    page_size = 10  # 10 doctors per page
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