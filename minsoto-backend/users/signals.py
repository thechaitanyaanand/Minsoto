# users/signals.py
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import CustomUser

@receiver(post_save, sender=CustomUser)
def send_welcome_email(sender, instance, created, **kwargs):
    """
    Send a welcome email when a new user is created.
    """
    if created: # Only run when a user is first created
        send_mail(
            subject='Welcome to Minsoto!',
            message=f'Hi {instance.first_name or instance.username},\n\n'
                    f'Welcome to Minsoto, the social network for focus and growth. '
                    f'We are thrilled to have you join our community.\n\n'
                    f'Get started by customizing your profile and exploring interest circles.\n\n'
                    f'Best,\nThe Minsoto Team',
            from_email=settings.DEFAULT_FROM_EMAIL, # Configure this in settings.py
            recipient_list=[instance.email],
            fail_silently=False, # Set to True in production if email failure shouldn't crash the app
        )