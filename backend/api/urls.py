from django.urls import path
from .views import (get_data
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('data/', get_data)

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)