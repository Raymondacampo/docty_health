import io
import os
import logging
from PIL import Image
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)

def process_profile_picture(instance_field):
    """
    Corta y redimensiona una imagen a un cuadrado de 200x200.
    Retorna un ContentFile listo para ser guardado.
    """
    try:
        with Image.open(instance_field.file) as img:
            # 1. Cortar para hacerla cuadrada
            width, height = img.size
            if width != height:
                size = min(width, height)
                left = (width - size) / 2
                top = (height - size) / 2
                right = (width + size) / 2
                bottom = (height + size) / 2
                img = img.crop((left, top, right, bottom))
            
            # 2. Redimensionar a 200x200
            img = img.resize((200, 200), Image.LANCZOS)
            img = img.convert('RGB') # Asegurar formato JPEG
            
            # 3. Guardar en buffer
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='JPEG', quality=90, optimize=True)
            img_byte_arr.seek(0)
            
            filename = os.path.basename(instance_field.name)
            return filename, ContentFile(img_byte_arr.read())
            
    except Exception as e:
        logger.error("Error processing image: %s", str(e))
        raise e