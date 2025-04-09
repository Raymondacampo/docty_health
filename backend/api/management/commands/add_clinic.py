# api/management/commands/add_clinic.py
from django.core.management.base import BaseCommand
from api.models import Clinic
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Adds a new clinic by fetching data from Google Maps'

    def add_arguments(self, parser):
        parser.add_argument('clinic_query', type=str, help='Clinic name and location (e.g., "Clinica Abreu, Santo Domingo")')

    def handle(self, *args, **options):
        query = options['clinic_query']
        # Check if clinic exists, create if not
        clinic_name = query.split(',')[0].strip()
        clinic, created = Clinic.objects.get_or_create(name=clinic_name)
        
        if created or not clinic.location:  # Only fetch if new or location missing
            success = clinic.fetch_and_geocode_from_google_maps(query)
            if success:
                self.stdout.write(self.style.SUCCESS(f"Successfully added/updated {clinic.name} at {clinic.location}"))
            else:
                self.stdout.write(self.style.ERROR(f"Failed to fetch data for {query}"))
                clinic.delete()  # Remove if creation fails (optional)
        else:
            self.stdout.write(self.style.WARNING(f"Clinic {clinic.name} already exists with location {clinic.location}"))