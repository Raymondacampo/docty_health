import os
from django.core.management import call_command
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import status
from django.conf import settings
from doctors.serializers import DoctorSerializer
from .serializers import EnsuranceSerializer
from .serializers import ClinicSerializer, SpecialtySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
import logging
from itsdangerous import URLSafeTimedSerializer
from .models import Specialty, Clinic, Ensurance
from doctors.models import Doctor
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q


logger = logging.getLogger(__name__)
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)


class DoctorPagination(PageNumberPagination):
    page_size = 6  # 10 doctors per page
    page_size_query_param = 'page_size'
    max_page_size = 100

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
        logger.info(f"Fetched {serializer.data} clinics")
        return Response(serializer.data, status=status.HTTP_200_OK)

# View to return all ensurances
class AllEnsurancesView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        ensurances = Ensurance.objects.all()
        serializer = EnsuranceSerializer(ensurances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
class DoctorSearchView(APIView):
    permission_classes = [AllowAny]
    pagination_class = DoctorPagination

    def get(self, request):
        queryset = Doctor.objects.all()
        
        # 1. Obtener parámetros
        specialty = request.query_params.get('specialty')
        ensurance = request.query_params.get('ensurance')
        location_name = request.query_params.get('location') 
        sex = request.query_params.get('sex')
        takes_dates = request.query_params.get('takes_dates')
        appointment_type = request.query_params.get('appointment_type')
        experience_min = request.query_params.get('experience_min')

        # 2. Filtrado por Ubicación (Ciudad y Estado)
        if location_name:
            try:
                # Separamos "Santo Domingo, Distrito Nacional"
                parts = [part.strip() for part in location_name.split(',', 1)]
                city = parts[0]
                state = parts[1] if len(parts) > 1 else None
                
                clinic_filter = Q()
                if city:
                    clinic_filter &= Q(city__iexact=city)
                if state:
                    clinic_filter &= Q(state__iexact=state)
                
                # Filtramos doctores que tengan al menos una clínica en esa ubicación
                matching_clinics = Clinic.objects.filter(clinic_filter)
                queryset = queryset.filter(clinics__in=matching_clinics)
            except Exception as e:
                logger.error(f"Error filtering location: {e}")

        # 3. Otros Filtros Directos
        if specialty:
            queryset = queryset.filter(specialties__name__icontains=specialty)
        
        if ensurance and ensurance != 'any':
            queryset = queryset.filter(ensurances__name__icontains=ensurance)
            
        if sex and sex != 'both':
            queryset = queryset.filter(sex=sex)
            
        if experience_min and experience_min != 'any':
            try:
                queryset = queryset.filter(experience__gte=int(experience_min))
            except ValueError:
                pass

        if takes_dates == 'true':
            queryset = queryset.filter(taking_dates=True)

        if appointment_type == 'virtual':
            queryset = queryset.filter(takes_virtual=True)
        elif appointment_type == 'in_person':
            queryset = queryset.filter(takes_in_person=True)

        # 4. Limpieza y Paginación
        queryset = queryset.distinct()
        
        paginator = self.pagination_class()
        # IMPORTANTE: Usa 'queryset', no 'doctors'
        page = paginator.paginate_queryset(queryset, request)
        serializer = DoctorSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)

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
        
def trigger_add_clinic(request):
    # 1. Validación de seguridad por Token en la URL
    # Ejemplo: /api/setup-clinic/?token=mi_clave_secreta&query=Clinica Abreu, Santo Domingo
    safe_token = os.environ.get('MAINTENANCE_TOKEN', 'token-por-defecto-muy-largo')
    user_token = request.GET.get('token')
    query = request.GET.get('query')

    if user_token != safe_token:
        return JsonResponse({"error": "No autorizado"}, status=403)

    if not query:
        return JsonResponse({"error": "Falta el parámetro 'query'"}, status=400)

    try:
        # 2. Llamar a tu comando personalizado
        call_command('add_clinic', query)
        return JsonResponse({
            "status": "Proceso completado",
            "message": f"Se intentó agregar: {query}"
        })
    except Exception as e:
        return JsonResponse({"status": "Error", "message": str(e)}, status=500)