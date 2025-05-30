from allauth.socialaccount.signals import social_account_added
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from .models import User, WeekAvailability, WeekDay, Doctor
import logging

logger = logging.getLogger(__name__)


@receiver(social_account_added)
def save_google_profile_picture(request, sociallogin, **kwargs):
    user = sociallogin.user
    if sociallogin.account.provider == "google":
        user.profile_picture = sociallogin.account.extra_data.get("picture", "")
        user.save()

logger.info("Signals module loaded")  # Debug signal module loading

@receiver(post_save, sender=WeekDay)
def update_doctor_availability_on_create(sender, instance, created, **kwargs):
    """
    Signal to update Doctor's takes_in_person, takes_virtual, and taking_dates fields
    when a WeekDay is created.
    """
    logger.info(f"Signal post_save triggered for WeekDay {instance.id}, created={created}")
    if created:
        logger.info(f"Processing WeekDay creation {instance.id}")
        try:
            week_availability = instance.week_availability
            # Assume week_availability.doctor is a User instance
            user = week_availability.doctor
            # Fetch the Doctor instance related to the User
            try:
                doctor = Doctor.objects.get(user=user)
            except Doctor.DoesNotExist:
                logger.error(f"No Doctor found for User {user.id} (WeekAvailability {week_availability.id})")
                return

            weekdays = WeekDay.objects.filter(week_availability__doctor=user)
            logger.info(f"Found {weekdays.count()} WeekDay objects for Doctor {doctor.id}")

            # Check for in-person (place is not null), virtual (place is null), and any availability
            has_in_person = any(weekday.place is not None for weekday in weekdays)
            has_virtual = any(weekday.place is None for weekday in weekdays)
            has_availability = weekdays.exists()
            logger.info(f"has_in_person={has_in_person}, has_virtual={has_virtual}, has_availability={has_availability}")

            # Update Doctor fields if necessary
            updated = False
            if has_in_person and not doctor.takes_in_person:
                doctor.takes_in_person = True
                updated = True
                logger.info(f"Set takes_in_person=True for Doctor {doctor.id}")
            if has_virtual and not doctor.takes_virtual:
                doctor.takes_virtual = True
                updated = True
                logger.info(f"Set takes_virtual=True for Doctor {doctor.id}")
            if has_availability and not doctor.taking_dates:
                doctor.taking_dates = True
                updated = True
                logger.info(f"Set taking_dates=True for Doctor {doctor.id}")

            # Save the Doctor instance if any changes were made
            if updated:
                doctor.save()
                logger.info(f"Doctor {doctor.id} updated with new availability settings")
        except AttributeError as e:
            logger.error(f"AttributeError in update_doctor_availability_on_create: {str(e)} (WeekAvailability {week_availability.id})")
        except Exception as e:
            logger.error(f"Error in update_doctor_availability_on_create signal: {str(e)} (WeekDay {instance.id})")

@receiver(post_delete, sender=WeekAvailability)
def update_doctor_availability_on_week_delete(sender, instance, **kwargs):
    """
    Signal to update Doctor's takes_in_person, takes_virtual, and taking_dates fields
    when a WeekAvailability is deleted.
    """
    logger.info(f"Signal post_delete triggered for WeekAvailability {instance.id}")
    try:
        user = instance.doctor  # Assume doctor is a User instance
        try:
            doctor = Doctor.objects.get(user=user)
        except Doctor.DoesNotExist:
            logger.error(f"No Doctor found for User {user.id} (WeekAvailability {instance.id})")
            return

        # Check if the doctor has any remaining WeekAvailability objects
        remaining_weeks = WeekAvailability.objects.filter(doctor=user)
        logger.info(f"Found {remaining_weeks.count()} remaining WeekAvailability objects for Doctor {doctor.id}")

        if not remaining_weeks.exists():
            # No WeekAvailability left, set all to False
            updated = False
            if doctor.takes_in_person:
                doctor.takes_in_person = False
                updated = True
                logger.info(f"Set takes_in_person=False for Doctor {doctor.id} (no WeekAvailability)")
            if doctor.takes_virtual:
                doctor.takes_virtual = False
                updated = True
                logger.info(f"Set takes_virtual=False for Doctor {doctor.id} (no WeekAvailability)")
            if doctor.taking_dates:
                doctor.taking_dates = False
                updated = True
                logger.info(f"Set taking_dates=False for Doctor {doctor.id} (no WeekAvailability)")
            if updated:
                doctor.save()
                logger.info(f"Doctor {doctor.id} updated: no availability remaining")
        else:
            # Check remaining WeekDays for in-person, virtual, or any availability
            weekdays = WeekDay.objects.filter(week_availability__doctor=user)
            has_in_person = any(weekday.place is not None for weekday in weekdays)
            has_virtual = any(weekday.place is None for weekday in weekdays)
            has_availability = weekdays.exists()
            logger.info(f"After WeekAvailability deletion: has_in_person={has_in_person}, has_virtual={has_virtual}, has_availability={has_availability}")

            updated = False
            if not has_in_person and doctor.takes_in_person:
                doctor.takes_in_person = False
                updated = True
                logger.info(f"Set takes_in_person=False for Doctor {doctor.id}")
            if not has_virtual and doctor.takes_virtual:
                doctor.takes_virtual = False
                updated = True
                logger.info(f"Set takes_virtual=False for Doctor {doctor.id}")
            if not has_availability and doctor.taking_dates:
                doctor.taking_dates = False
                updated = True
                logger.info(f"Set taking_dates=False for Doctor {doctor.id}")
            if has_availability and not doctor.taking_dates:
                doctor.taking_dates = True
                updated = True
                logger.info(f"Set taking_dates=True for Doctor {doctor.id}")
            if updated:
                doctor.save()
                logger.info(f"Doctor {doctor.id} updated after WeekAvailability deletion")
    except AttributeError as e:
        logger.error(f"AttributeError in update_doctor_availability_on_week_delete: {str(e)} (WeekAvailability {instance.id})")
    except Exception as e:
        logger.error(f"Error in update_doctor_availability_on_week_delete signal: {str(e)}")

@receiver(post_delete, sender=WeekDay)
def update_doctor_availability_on_weekday_delete(sender, instance, **kwargs):
    """
    Signal to update Doctor's takes_in_person, takes_virtual, and taking_dates fields
    when a WeekDay is deleted.
    """
    logger.info(f"Signal post_delete triggered for WeekDay {instance.id}")
    try:
        week_availability = instance.week_availability
        user = week_availability.doctor  # Assume doctor is a User instance
        try:
            doctor = Doctor.objects.get(user=user)
        except Doctor.DoesNotExist:
            logger.error(f"No Doctor found for User {user.id} (WeekAvailability {week_availability.id})")
            return

        # Check remaining WeekDays for the doctor
        weekdays = WeekDay.objects.filter(week_availability__doctor=user)
        logger.info(f"Found {weekdays.count()} remaining WeekDay objects for Doctor {doctor.id}")

        # Check for in-person (place is not null), virtual (place is null), or any availability
        has_in_person = any(weekday.place is not None for weekday in weekdays)
        has_virtual = any(weekday.place is None for weekday in weekdays)
        has_availability = weekdays.exists()
        logger.info(f"After WeekDay deletion: has_in_person={has_in_person}, has_virtual={has_virtual}, has_availability={has_availability}")

        # Update Doctor fields if necessary
        updated = False
        if not has_in_person and doctor.takes_in_person:
            doctor.takes_in_person = False
            updated = True
            logger.info(f"Set takes_in_person=False for Doctor {doctor.id}")
        if not has_virtual and doctor.takes_virtual:
            doctor.takes_virtual = False
            updated = True
            logger.info(f"Set takes_virtual=False for Doctor {doctor.id}")
        if not has_availability and doctor.taking_dates:
            doctor.taking_dates = False
            updated = True
            logger.info(f"Set taking_dates=False for Doctor {doctor.id}")
        if has_availability and not doctor.taking_dates:
            doctor.taking_dates = True
            updated = True
            logger.info(f"Set taking_dates=True for Doctor {doctor.id}")

        # Save the Doctor instance if any changes were made
        if updated:
            doctor.save()
            logger.info(f"Doctor {doctor.id} updated after WeekDay deletion")
    except AttributeError as e:
        logger.error(f"AttributeError in update_doctor_availability_on_weekday_delete: {str(e)} (WeekDay {instance.id})")
    except Exception as e:
        logger.error(f"Error in update_doctor_availability_on_weekday_delete signal: {str(e)}")