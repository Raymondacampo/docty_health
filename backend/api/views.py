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
from .serializers import UserProfileSerializer, SignupSerializer, DoctorSignupSerializer, DoctorAvailabilitySerializer, DayOfWeekSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from google.oauth2 import id_token
from google.auth.transport import requests
import os
import uuid
import re
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from django.utils import timezone
from datetime import timedelta, datetime
from .models import PasswordResetToken, Specialty, Clinic, DoctorDocument, Doctor, DoctorAvailability, Appointment, DayOfWeek, Ensurance

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
        print('comenzo')
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
    def post(self, request):
        token = request.data.get('token')
        try:
            # Validate the Google ID token
            id_info = id_token.verify_oauth2_token(token, requests.Request(), os.getenv('GOOGLE_CLIENT_ID'))
            
            # Get or create user
            user, created = User.objects.get_or_create(
                email=id_info['email'],
                defaults={
                    'username': f"{id_info.get('given_name', '')}_{uuid.uuid4().hex[:10]}",  # 10-character UUID
                    'first_name': id_info.get('given_name', ''),
                    'last_name': id_info.get('family_name', '')
                }
            )
            
            # Generate JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'email': user.email,
                'username':user.username            
                })
        except ValueError:
            return Response({'error': 'Invalid token'}, status=400)

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
            "profile_picture": user.profile_picture.url if user.profile_picture else None,  # Add profile picture
            "is_doctor": hasattr(user, 'doctor')
        }

        # If the user is a doctor, add doctor-specific fields
        if hasattr(user, 'doctor'):
            doctor = user.doctor
            response_data.update({
                "exequatur": doctor.exequatur,
                "experience": doctor.experience,
                "specializations": [{"id":specialty.id, "name": specialty.name} for specialty in doctor.specialties.all()],
                "clinics": [{"id":clinic.id, "name": clinic.name} for clinic in doctor.clinics.all()],
                "ensurances": [{"id": ensurance.id, "name": ensurance.name, "logo": ensurance.logo.url if ensurance.logo else None} for ensurance in doctor.ensurances.all()],  
                "documents": [
                    {"id": doc.id, "url": doc.file.url, "description": doc.description}
                    for doc in doctor.documents.all()
                ],
                # Add DoctorAvailability data
                "availabilities": [
                    {
                        "id": avail.id,
                        "clinic": {"id": avail.clinic.id, "name": avail.clinic.name},
                        "specialization": {"id": avail.specialization.id, "name": avail.specialization.name},
                        "days": [{"id": day.id, "name": day.name} for day in avail.days.all()],
                        "start_time": avail.start_time.strftime('%H:%M'),
                        "end_time": avail.end_time.strftime('%H:%M'),
                        "slot_duration": avail.slot_duration
                    }
                    for avail in DoctorAvailability.objects.filter(doctor=doctor)
                ],
                "taking_dates": doctor.taking_dates
            })

        return Response(response_data)  

    def put(self, request):
        user = request.user
        data = request.data

        # Update user fields
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.username = data.get('username', user.username)

        phone_number = data.get('phone_number', '')
        if phone_number:
        # This regex allows an optional '+' followed by 7 to 15 digits.
            if not re.fullmatch(r'\+?\d{7,15}', phone_number):
                return Response(
                    {"error": "Invalid phone number format. Please enter a valid phone number."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Assuming you have these fields in your User model or a related profile model
        if hasattr(user, 'phone_number'):
            user.phone_number = data.get('phone_number', user.phone_number)
        if hasattr(user, 'born_date'):
            user.born_date = data.get('born_date', user.born_date)

        if 'profile_picture' in request.FILES:
            try:
                user.profile_picture = request.FILES['profile_picture']
                user.full_clean()  # Trigger validators
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        elif data.get('profile_picture') == 'remove':
            if user.profile_picture:
                user.profile_picture.delete(save=False)
                user.profile_picture = None
            
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
            "taking_dates": user.doctor.taking_dates if hasattr(user, 'doctor') else None
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

        # Validate slot_duration is 30, 45, or 60
        slot_duration = data.get('slot_duration', 30)
        if slot_duration not in [30, 45, 60]:
            return Response({"error": "Slot duration must be 30, 45, or 60 minutes"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DoctorAvailabilitySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
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
            return Response({"message": "Availability deleted successfully"}, status=status.HTTP_200_OK)
        except DoctorAvailability.DoesNotExist:
            return Response({"error": "Availability not found"}, status=status.HTTP_404_NOT_FOUND)

class DayOfWeekListView(generics.ListAPIView):
    queryset = DayOfWeek.objects.all()
    serializer_class = DayOfWeekSerializer

