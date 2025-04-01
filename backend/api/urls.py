from django.urls import path
from .views import get_data, LoginView, UserProfileView, SignupView, LogoutView, GoogleLogin, DoctorSignupView, PasswordResetRequestView, PasswordChangeView, ValidateTokenView,AvailableSpecialtiesView, AddSpecialtyView, AddClinicView, AvailableClinicsView
from .views import RemoveClinicView, RemoveSpecialtyView, UploadDoctorDocumentView, BookAppointmentView, CreateDoctorAvailabilityView, AvailableSlotsView, DayOfWeekListView,UpdateDoctorAvailabilityView, DeleteDoctorAvailabilityView, DeleteDoctorDocumentView
from .views import AvailableEnsurancesView, AddEnsuranceView, RemoveEnsuranceView
from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView, TokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('data/', get_data),

    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/signup/", SignupView.as_view(), name="signup"),
    path('auth/doctor_signup/', DoctorSignupView.as_view(), name='doctor_signup'),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", UserProfileView.as_view(), name="user_profile"),
    path('auth/google/', GoogleLogin.as_view(), name='google-login'),
    path('auth/password_reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('auth/password_change/', PasswordChangeView.as_view(), name='password_change'),
    path('auth/validate_token/', ValidateTokenView.as_view(), name='validate_token'),
    
    path('auth/available_specialties/', AvailableSpecialtiesView.as_view(), name='available_specialties'),
    path('auth/add_specialty/', AddSpecialtyView.as_view(), name='add_specialty'),
    path('auth/available_clinics/', AvailableClinicsView.as_view(), name='available_clinics'),
    path('auth/add_clinic/', AddClinicView.as_view(), name='add_clinic'),
    path('auth/remove_specialty/<int:specialty_id>/', RemoveSpecialtyView.as_view(), name='remove_specialty'),
    path('auth/remove_clinic/<int:clinic_id>/', RemoveClinicView.as_view(), name='remove_clinic'),
    path('auth/available_ensurances/', AvailableEnsurancesView.as_view(), name='available_ensurances'),
    path('auth/add_ensurance/', AddEnsuranceView.as_view(), name='add_ensurance'),
    path('auth/remove_ensurance/<int:ensurance_id>/', RemoveEnsuranceView.as_view(), name='remove_ensurance'),

    path('auth/upload_document/', UploadDoctorDocumentView.as_view(), name='upload_doctor_document'),
    path('auth/delete_document/<int:document_id>/', DeleteDoctorDocumentView.as_view(), name='delete_doctor_document'),

    path('auth/days_of_week/', DayOfWeekListView.as_view(), name='days_of_week'),
    path('auth/create_availability/', CreateDoctorAvailabilityView.as_view(), name='create_doctor_availability'),
    path('auth/update_availability/<int:availability_id>/', UpdateDoctorAvailabilityView.as_view(), name='update_doctor_availability'),
    path('auth/delete_availability/<int:availability_id>/', DeleteDoctorAvailabilityView.as_view(), name='delete_doctor_availability'),
    path('auth/available_slots/<int:doctor_id>/<str:date>/', AvailableSlotsView.as_view(), name='available_slots'),
    path('auth/book_appointment/', BookAppointmentView.as_view(), name='book_appointment'),

    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # Login (returns access & refresh tokens)
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # ✅ Refresh access token
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),  # ✅ Verify if token is valid

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
