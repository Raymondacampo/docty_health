from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.conf import settings

from appointments.serializers import WeekDaySerializer

from .serializers import DoctorSignupSerializer
from .serializers import ClinicSerializer, DoctorSerializer 
from rest_framework.permissions import IsAuthenticated, AllowAny
import logging
from itsdangerous import URLSafeTimedSerializer
from .models import  DoctorDocument, Doctor
from search.models import Specialty, Clinic, Ensurance
from appointments.models import Appointment

from django.db import transaction


logger = logging.getLogger(__name__)
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

class DoctorSignupView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = DoctorSignupSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            # This ensures BOTH user + doctor are saved atomically
            with transaction.atomic():
                user = serializer.save()  # This should return the User instance

            # Now safely generate tokens AFTER everything is saved
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_doctor': True,
                    # Optional: include doctor-specific info
                    'doctor_id': user.doctor.id if hasattr(user, 'doctor') else None,
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({
                'error': 'Signup failed',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

class DoctorDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, doctor_id):
        print("User:", request.user)
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            serializer = DoctorSerializer(doctor, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
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
