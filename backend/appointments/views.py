from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import status
from django.conf import settings
from .serializers import WeekAvailabilitySerializer, WeekDaySerializer, ScheduleSerializer, AppointmentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
import logging
from itsdangerous import URLSafeTimedSerializer
from datetime import timedelta, datetime, date
from .models import Schedule, WeekAvailability, WeekDay, Appointment
from doctors.models import Doctor
from django.db import transaction
import traceback

logger = logging.getLogger(__name__)
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

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
        doc = Doctor.objects.get(user=user.id)
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_403_FORBIDDEN)

        schedules = Schedule.objects.filter(doctor=doc)
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
            if week_availability.doctor != user.doctor:
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
        
        # 1. Verificar atributo doctor
        if not hasattr(user, 'doctor'):
            return Response({"error": "User has no doctor attribute"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Localizador 1: ¿Falla al obtener el objeto doctor?
            try:
                doc = user.doctor
            except Exception as e:
                print("❌ ERROR LOCALIZADO EN: Obtención de user.doctor")
                traceback.print_exc()
                return Response({"error": f"Doctor profile error: {str(e)}"}, status=status.HTTP_404_NOT_FOUND)

            week = request.data.get('week')
            weekdays = request.data.get('weekdays', [])

            # Validaciones de fecha
            try:
                parsed_week = datetime.strptime(week, "%m/%d/%Y").date()
            except Exception as e:
                return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                # Localizador 2: ¿Falla el Serializador de disponibilidad?
                # A veces los serializadores hacen consultas automáticas al validar
                # week_data = {'doctor': doc.id, 'week': parsed_week}
                week_data = {
                    'week': parsed_week
                }
                week_data['doctor'] = doc.id
                week_serializer = WeekAvailabilitySerializer(data=week_data)
                if not week_serializer.is_valid():
                    print(week_serializer.errors)
                    return Response(week_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                week_availability = week_serializer.save(doctor=doc)

                # Localizador 3: ¿Falla la relación de clínicas?
                try:
                    doctor_clinics = list(doc.clinics.values_list('id', flat=True))
                except Exception as e:
                    print("❌ ERROR LOCALIZADO EN: doc.clinics query")
                    traceback.print_exc()
                    raise e

                created_weekdays = []
                for i, weekday in enumerate(weekdays):
                    # Localizador 4: ¿Falla el Serializador de WeekDay?
                    # OJO: Aquí es donde más suele saltar el "Matching query does not exist" 
                    # si el place_id no existe en la DB.
                    weekday_data = {
                        'week_availability': week_availability.id,
                        'day': weekday.get('day'),
                        'hours': weekday.get('hours'),
                        'place_id': weekday.get('place') # Verifica si tu JSON manda 'place' o 'place_id'
                    }
                    
                    wd_serializer = WeekDaySerializer(data=weekday_data)
                    if not wd_serializer.is_valid():
                        print(f"❌ ERROR LOCALIZADO EN: WeekDaySerializer (Índice {i})")
                        print("Data enviada:", weekday_data)
                        print("Errores:", wd_serializer.errors)
                        return Response(wd_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    
                    week_day = wd_serializer.save()
                    created_weekdays.append({
                        'id': week_day.id,
                        'day': week_day.day,
                        'place': weekday.get('place'),
                    })

                return Response({"message": "Created", "weekdays": created_weekdays}, status=status.HTTP_201_CREATED)

        except Exception as e:
            # ESTE ES TU RADAR PRINCIPAL
            print("🚨 --- ERROR FATAL NO CONTROLADO --- 🚨")
            print(f"Tipo de error: {type(e).__name__}")
            print(f"Mensaje: {str(e)}")
            print("--- TRACEBACK COMPLETO ---")
            traceback.print_exc() # Esto imprimirá en la consola la línea exacta del error
            return Response({"error": "Internal Server Error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # def post(self, request):
    #     user = request.user
        
    #     if not hasattr(user, 'doctor'):
    #         return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
    #     # doc = Doctor.objects.get(user=user.id)
    #     # logger.info(doc)

    #     try:
    #         doc = user.doctor # Si usas OneToOneField, esto funciona
    #     except Doctor.DoesNotExist:
    #         logger.info('hola')
    #         return Response({"error": "El perfil de doctor no existe para este usuario."}, status=status.HTTP_404_NOT_FOUND)

    #     week = request.data.get('week')
    #     try:
    #         parsed_week = datetime.strptime(week, "%m/%d/%Y").date()
    #     except ValueError as e:
    #         return Response({"error": f"Invalid date format for 'week'. Expected MM/DD/YYYY. "}, status=status.HTTP_400_BAD_REQUEST)

    #     normalized_week = parsed_week
    #     weekdays = request.data.get('weekdays', [])

    #     if not week or not weekdays:
    #         return Response({"error": "Week and at least one weekday are required"}, status=status.HTTP_400_BAD_REQUEST)

    #     try:
    #         with transaction.atomic():
    #             # Create WeekAvailability
    #             week_data = {
    #                 'doctor': doc.id,
    #                 'week': normalized_week
    #             }
    #             week_serializer = WeekAvailabilitySerializer(data=week_data)
    #             if not week_serializer.is_valid():
    #                 return Response(week_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #             # Explicitly pass doctor to save
    #             week_availability = week_serializer.save(doctor=doc)

    #             # Validate that all clinics belong to the doctor
    #             doctor_clinics = doc.clinics.values_list('id', flat=True)
    #             for weekday in weekdays:
    #                 place_id = weekday.get('place')
    #                 if place_id and place_id not in doctor_clinics:
    #                     print("DEBUG: Error en WeekAvailabilitySerializer:")
    #                     return Response(
    #                         {"error": f"Clinic ID {place_id} is not associated with this doctor"},
    #                         status=status.HTTP_400_BAD_REQUEST
    #                     )

    #             # Create WeekDay entries
    #             created_weekdays = []
    #             for weekday in weekdays:
    #                 weekday_data = {
    #                     'week_availability': week_availability.id,
    #                     'day': weekday['day'],
    #                     'hours': weekday['hours'],
    #                     'place_id': weekday.get('place_id') if weekday.get('place_id') else None,
    #                 }
    #                 weekday_serializer = WeekDaySerializer(data=weekday_data)
    #                 logger.info(f"Constructed weekday_data: {weekday_serializer} MIUUUU 1111")
    #                 if not weekday_serializer.is_valid():
    #                     # print("DEBUG: Error en WeekAvailabilitySerializer:")
    #                     return Response(weekday_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #                 # Explicitly pass doctor to save
    #                 week_day = weekday_serializer.save()
    #                 created_weekdays.append({
    #                     'id': week_day.id,
    #                     'day': week_day.day,
    #                     'hours': week_day.hours,
    #                     'place': weekday.get('place_id') if weekday.get('place_id') else None,
    #                 })


    #             return Response({
    #                 "message": "Week schedule created successfully",
    #                 "week_availability": {
    #                     'id': week_availability.id,
    #                     'week': week_availability.week,
    #                     'doctor': week_availability.doctor.id
    #                 },
    #                 "weekdays": created_weekdays
    #             }, status=status.HTTP_201_CREATED)

    #     except Exception as e:
    #         print("DEBUG", str(e))
    #         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request):
        user = request.user
        
        if not hasattr(user, 'doctor'):
            logger.info("User is not a doctor")
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        doc = Doctor.objects.get(user=user.id)

        week_availability_id = request.data.get('week_availability_id')
        week = request.data.get('week')
        weekdays = request.data.get('weekdays', [])

        if not week_availability_id or not week or not weekdays:
            logger.info(f"Missing data: week_availability_id={week_availability_id}, week={week}, weekdays={weekdays}")
            return Response({"error": "Week availability ID, week, and weekdays are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Verify WeekAvailability exists and belongs to user
                week_availability = WeekAvailability.objects.get(id=week_availability_id, doctor=doc)
                week_data = {'week': week}
                week_serializer = WeekAvailabilitySerializer(week_availability, data=week_data, partial=True)
                if not week_serializer.is_valid():
                    return Response(week_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                week_serializer.save()

                # Validate clinics
                # doctor_clinics = user.doctor.clinics.values_list('id', flat=True)
                doctor_clinic_ids = list(doc.clinics.values_list('id', flat=True))
                for weekday in weekdays:
                    place_id = weekday.get('place') if weekday.get('place') else None
                    if place_id and place_id not in doctor_clinic_ids:
                        return Response(
                            {"error": f"Clinic ID {place_id} is not associated with this doctor"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                # Delete existing WeekDay entries
                WeekDay.objects.filter(week_availability=week_availability).delete()

                # Create new WeekDay entries
                created_weekdays = []
                for weekday in weekdays:
                    if not isinstance(weekday, dict):
                        logger.error(f"Invalid weekday data type: Expected dict, got {type(weekday)}")
                        return Response(
                            {"error": "Each weekday entry must be a dictionary"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    logger.info(f"Processing weekday data: {weekday}")
                    logger.info(f"Processing weekday data: {weekday}")
                    weekday_data = {
                        'week_availability': week_availability.id,
                        'day': weekday['day'],
                        'hours': weekday['hours'],
                        'place': weekday.get('place') if weekday.get('place') else None,
                    }
                    logger.info(f"Constructed weekday_data: {weekday_data}")
                    weekday_serializer = WeekDaySerializer(data=weekday_data)
                    if not weekday_serializer.is_valid():
                        logger.info(f"Weekday serializer errors: {weekday_serializer.errors}")
                        return Response(weekday_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    week_day = weekday_serializer.save()
                    logger.info(f"PPPPPPPRRRRRROOOOOOCCCCCCEEEEEESSSSSSOOOOOOOUUUUUUUU 333 {week_day.id}")
                    created_weekdays.append({
                        'id': week_day.id,
                        'day': week_day.day,
                        'hours': week_day.hours,
                        'place': weekday.get('place') if weekday.get('place') else None,
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
            logger.info("Week availability not found or unauthorized")
            return Response({"error": "Week availability not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error updating week schedule HAHAHA: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WeekSchedulesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        doc = Doctor.objects.get(user=user.id)
        
        if not hasattr(user, 'doctor'):
            return Response({"error": "User is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Fetch all WeekAvailability objects for the user
            week_availabilities = WeekAvailability.objects.filter(doctor=doc).order_by('week')

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


class AvailableWeeksView(APIView):  
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        doc = Doctor.objects.get(user=user.id)

        # 1. Determine the start of the current week (Monday)
        today = date.today()
        # today.weekday() returns 0 for Monday, 6 for Sunday. 
        # Subtracting this number of days always lands on the preceding Monday.
        current_monday = today - timedelta(days=today.weekday())
        
        # 2. Generate the next 5 Mondays (representing 5 candidate weeks)
        NUM_WEEKS = 5
        candidate_weeks = [current_monday + timedelta(weeks=i) for i in range(NUM_WEEKS)]

        # 3. Get already scheduled weeks for the doctor
        # We assume the 'week' field in WeekAvailability is stored as a date object.
        try:
            taken_weeks = set(
                WeekAvailability.objects.filter(doctor=doc).values_list('week', flat=True)
            )
        except AttributeError:
            # Handle case where user is not associated with a doctor (safety check)
            return Response({"error": "User is not a doctor."}, status=400)
        except Exception as e:
            logger.error(f"Database error fetching taken weeks: {str(e)}")
            return Response({"error": "Failed to fetch scheduled weeks."}, status=500)

        # 4. Filter out taken weeks
        # Note: We compare date objects directly, which is clean and reliable.
        free_weeks = [w for w in candidate_weeks if w not in taken_weeks]
        
        # Optional: Logging for visibility
        logger.info(f"Generated candidate weeks: {[w.isoformat() for w in candidate_weeks]}")
        logger.info(f"Taken weeks: {[t.isoformat() for t in taken_weeks]}")
        logger.info(f"Free weeks for doctor {user.doctor.id}: {[w.isoformat() for w in free_weeks]}")
        
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
                week_availability__doctor=doctor
            ).select_related('place').order_by('day')
            logger.info(f"Fetched {weekdays.count()} weekdays for doctor {doctor_id}")
            today = date.today()
            available_days = []
            for weekday in weekdays:
                if weekday.day < today:
                    continue

                # Get booked hours for this weekday
                booked_hours = Appointment.objects.filter(
                    appointment=weekday
                ).values_list('time', flat=True)
                logger.info(f"Weekday {weekday.day} booked hours: {list(booked_hours)}")
                # Remove booked hours from available hours
                available_hours = [
                    hour for hour in weekday.hours
                    if hour not in booked_hours
                ]
                logger.info(f"Weekday {weekday.day} available hours after filtering: {available_hours}")
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
            return Response({"error": f"{str(e)} ddddd"} , status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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
        # status_filter = request.query_params.get('status', None)

        # Base queryset based on user type
        if is_doctor:
            doc = Doctor.objects.get(user=user.id)
            appointments = Appointment.objects.filter(
                appointment__week_availability__doctor=doc
            ).select_related(
                'patient', 'appointment', 'appointment__week_availability', 'appointment__place'
            ).order_by('appointment__day', 'time')
        else:
            appointments = Appointment.objects.filter(
                patient=user
            ).select_related(
                'appointment', 'appointment__week_availability', 'appointment__place'
            ).order_by('appointment__day', 'time')
        logger.info(f"{appointments}")

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
        
        # if status_filter is None or status_filter not in ['active', 'inactive']:
        active_appointments = [appt for appt in serialized_data if appt['active']]
        inactive_appointments = [appt for appt in serialized_data if not appt['active']]

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
            else:
                return Response({"error": "Not authorized to delete this appointment"}, status=status.HTTP_403_FORBIDDEN)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found or not authorized"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)