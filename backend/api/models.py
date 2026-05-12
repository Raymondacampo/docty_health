from django.core.exceptions import ValidationError
from PIL import Image
import logging


logger = logging.getLogger(__name__)


def validate_square_image(image):
    """Ensure the uploaded image is square (width == height)."""
    try:
        with Image.open(image) as img:
            width, height = img.size
            if width != height:
                raise ValidationError("Profile picture must be square (width must equal height).")
    except Exception as e:
        logger.error("validate_square_image error: %s", str(e))
        raise ValidationError(f"Invalid image file: {str(e)}")
