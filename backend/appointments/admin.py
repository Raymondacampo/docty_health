from django.contrib import admin
from .models import Schedule, Appointment, WeekAvailability, WeekDay

# Registro de modelos
admin.site.register(Appointment)
admin.site.register(Schedule)
admin.site.register(WeekAvailability)
admin.site.register(WeekDay)