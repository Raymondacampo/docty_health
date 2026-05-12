from django.urls import path

from search.views import AllClinicsView, AllEnsurancesView, AllSpecialtiesView, DoctorSearchView, ClinicDetailView
    
urlpatterns = [
    path('doctors/', DoctorSearchView.as_view(), name='doctor_search'),
    path('all_specialties/', AllSpecialtiesView.as_view(), name='all_specialties'),
    path('all_clinics/', AllClinicsView.as_view(), name='all_clinics'),
    path('all_ensurances/', AllEnsurancesView.as_view(), name='all_ensurances'),
    path('clinic/<int:clinic_id>/', ClinicDetailView.as_view(), name='clinic_detail'),
]