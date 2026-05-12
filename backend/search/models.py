from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
import requests
from django.contrib.gis.geos import Point
import logging
import os
from cloudinary.models import CloudinaryField

logger = logging.getLogger(__name__)
 
# Specialty Model
class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'api_specialty'

    def __str__(self):
        return self.name

# Clinic Model
class Clinic(models.Model):
    name = models.CharField(max_length=150)
    address = models.TextField()  # Keep for full address string
    state = models.CharField(max_length=100, blank=True, null=True)  # e.g., "New York"
    city = models.CharField(max_length=100, blank=True, null=True)  # e.g., "New York City"
    location = gis_models.PointField(null=True, blank=True)  # Stores latitude/longitude
    google_place_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.city}, {self.state}"

    def set_location(self, latitude, longitude):
        """Helper to set the PointField from lat/lon."""
        self.location = Point(longitude, latitude, srid=4326)  # SRID 4326 is WGS84 (standard for GPS)

    class Meta:
        db_table = 'api_clinic'
        indexes = [
            gis_models.Index(fields=['location']),  # Index for geospatial queries
        ]

    def fetch_and_geocode_from_google_maps(self, search_query):
        url = "https://places.googleapis.com/v1/places:searchText"
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": os.environ.get('YOUR_API_KEY'),  # Replace with your key
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location"
        }
        data = {"textQuery": search_query}
        try:
            response = requests.post(url, json=data, headers=headers)
            result = response.json()
            logger.info(f"Raw API response: {result}")
            if response.status_code == 200 and result.get('places'):
                place = result['places'][0]
                self.name = place['displayName']['text']
                self.address = place.get('formattedAddress', '')
                lat = place['location']['latitude']
                lng = place['location']['longitude']
                self.set_location(lat, lng)
                self.save()
                logger.info(f"Fetched and geocoded {self.name}: {lat}, {lng}")
                return True
            else:
                logger.warning(f"No results or error for {search_query}: {result}")
                return False
        except Exception as e:
            logger.error(f"Error fetching {search_query}: {str(e)}")
            return False
    
class Ensurance(models.Model):
    name = models.CharField(max_length=150, unique=True)
    logo = CloudinaryField('image', folder='ensurance_logos', blank=True, null=True)
    
    class Meta:
        db_table = 'api_ensurance'
    
    def __str__(self):
        return self.name
