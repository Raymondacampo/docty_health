from django.urls import path
from .views import (DoctorSignupView,AvailableSpecialtiesView, AddSpecialtyView, AddClinicView, AvailableClinicsView,
RemoveClinicView, RemoveSpecialtyView, UploadDoctorDocumentView, DeleteDoctorDocumentView, AvailableEnsurancesView, 
AddEnsuranceView, RemoveEnsuranceView, DoctorDetailView, UpdateDoctorDescriptionView
, DoctorPatientsView
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('auth/doctor_signup/', DoctorSignupView.as_view(), name='doctor_signup'),
    path('available_specialties/', AvailableSpecialtiesView.as_view(), name='available_specialties'),
    path('add_specialty/', AddSpecialtyView.as_view(), name='add_specialty'),
    path('available_clinics/', AvailableClinicsView.as_view(), name='available_clinics'),
    path('add_clinic/', AddClinicView.as_view(), name='add_clinic'),
    path('remove_specialty/<int:specialty_id>/', RemoveSpecialtyView.as_view(), name='remove_specialty'),
    path('remove_clinic/<int:clinic_id>/', RemoveClinicView.as_view(), name='remove_clinic'),
    path('available_insurances/', AvailableEnsurancesView.as_view(), name='available_ensurances'),
    path('add_insurance/', AddEnsuranceView.as_view(), name='add_ensurance'),
    path('remove_insurance/<int:ensurance_id>/', RemoveEnsuranceView.as_view(), name='remove_ensurance'),
    path('update_description/', UpdateDoctorDescriptionView.as_view(), name='update_doctor_description'),

    path('upload_document/', UploadDoctorDocumentView.as_view(), name='upload_doctor_document'),
    path('delete_document/<int:document_id>/', DeleteDoctorDocumentView.as_view(), name='delete_doctor_document'),
    path('doctor/<int:doctor_id>/', DoctorDetailView.as_view(), name='doctor_detail'),
    path('doctor/patients/', DoctorPatientsView.as_view(), name='doctor_patients'),

]