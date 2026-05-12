from django.urls import path
from .views import (CreateScheduleView, UpdateScheduleView, DeleteScheduleView, MySchedulesView, CreateWeekDayView, WeekScheduleView, AvailableWeeksView,
                    DoctorAvailableDaysView, WeekSchedulesView,CreateAppointmentView, DeleteWeekAvailabilityView, UserAppointmentsView, DeleteAppointmentView)

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('create_schedule/', CreateScheduleView.as_view(), name='create_schedule'),
    path('update_schedule/<int:schedule_id>/', UpdateScheduleView.as_view(), name='update_schedule'),
    path('delete_schedule/<int:schedule_id>/', DeleteScheduleView.as_view(), name='delete_schedule'),
    path('my_schedules/', MySchedulesView.as_view(), name='my_schedules'),
    path('schedules/', MySchedulesView.as_view(), name='schedules'),  # Reuse MySchedulesView

    path('create_appointment/', CreateAppointmentView.as_view(), name='create_appointment'),
    path('appointments/', UserAppointmentsView.as_view(), name='user_appointments'),
    path('appointments/<int:appointment_id>/', DeleteAppointmentView.as_view(), name='delete_appointment'),

    path('create_weekday/', CreateWeekDayView.as_view(), name='create_week_day'),
    path('weekschedule/', WeekScheduleView.as_view(), name='week_schedule'),  # New endpoint
    path('available-weeks/', AvailableWeeksView.as_view(), name='available-weeks'),
    path('doctor/<int:doctor_id>/available_days/', DoctorAvailableDaysView.as_view(), name='doctor_available_days'),
    path('weekschedules/', WeekSchedulesView.as_view(), name='week_schedules'),
    path('delete_weekavailability/<int:week_availability_id>/', DeleteWeekAvailabilityView.as_view(), name='delete_week_availability'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)