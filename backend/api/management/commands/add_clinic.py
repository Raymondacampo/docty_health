# api/management/commands/add_clinic.py
from django.core.management.base import BaseCommand
from api.models import Clinic
import logging
import requests
import os
import unicodedata

# Configure logging with UTF-8 encoding
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()  # Ensure the handler supports UTF-8
    ]
)
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Adds a new clinic by fetching data from Google Maps, including city and state'

    def add_arguments(self, parser):
        parser.add_argument('clinic_query', type=str, help='Clinic name and location (e.g., "Clinica Abreu, Santo Domingo")')

    def handle(self, *args, **options):
        query = options['clinic_query']
        clinic_name = query.split(',')[0].strip()
        clinic, created = Clinic.objects.get_or_create(name=clinic_name)
        
        if created or not clinic.location or not clinic.city or not clinic.state:
            logger.info(f"Fetching data for {query} (Created: {created})")
            success = self.fetch_and_geocode_clinic(clinic, query)
            if success:
                self.stdout.write(self.style.SUCCESS(
                    f"Successfully added/updated {clinic.name} at {clinic.location} "
                    f"(City: {clinic.city}, State: {clinic.state})"
                ))
            else:
                self.stdout.write(self.style.ERROR(f"Failed to fetch data for {query}"))
                if created:
                    clinic.delete()
        else:
            self.stdout.write(self.style.WARNING(
                f"Clinic {clinic.name} already exists with location {clinic.location}, "
                f"City: {clinic.city}, State: {clinic.state}"
            ))

    def fetch_and_geocode_clinic(self, clinic, search_query):
        """Fetch clinic data from Google Maps and update the Clinic instance."""
        url = "https://places.googleapis.com/v1/places:searchText"
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": os.environ.get('YOUR_GOOGLE_API_KEY'),
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.addressComponents"
        }
        data = {"textQuery": search_query}

        try:
            logger.info("Calling Google Places API")
            response = requests.post(url, json=data, headers=headers)
            response.encoding = 'utf-8'  # Explicitly set response encoding to UTF-8
            result = response.json()
            logger.info(f"Raw API response: {result}")
            if response.status_code == 200 and result.get('places'):
                place = result['places'][0]
                # Normalize Unicode characters to handle special cases
                clinic.name = unicodedata.normalize('NFKC', place['displayName']['text'])
                clinic.address = unicodedata.normalize('NFKC', place.get('formattedAddress', ''))
                lat = place['location']['latitude']
                lng = place['location']['longitude']
                clinic.set_location(lat, lng)

                # Extract city and state from addressComponents
                address_components = place.get('addressComponents', [])
                logger.info(f"Address components: {address_components}")
                for component in address_components:
                    types = component.get('types', [])
                    name = unicodedata.normalize('NFKC', component.get('longText', ''))
                    logger.info(f"Processing component: {name} with types {types}")
                    if 'locality' in types or 'postal_town' in types:
                        clinic.city = name
                        logger.info(f"Set city to: {name}")
                    elif 'administrative_area_level_1' in types:
                        clinic.state = name
                        logger.info(f"Set state to: {name}")

                # Log final values before saving
                logger.info(f"Before save - City: {clinic.city}, State: {clinic.state}")
                clinic.save()
                logger.info(f"Saved clinic - City: {clinic.city}, State: {clinic.state}")
                return True
            else:
                logger.warning(f"No results or error for {search_query}: {result}")
                return False
        except Exception as e:
            logger.error(f"Error fetching {search_query}: {str(e)}")
            return False