from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import CustomUser, Profile

@receiver(post_save, sender=CustomUser)
def handle_new_user_creation(sender, instance, created, **kwargs):
    """
    Handles tasks that need to run when a new user is created.
    This single function will:
    1. Create a user Profile.
    2. Send a welcome email.
    3. Attempt to set the profile picture from Google.
    """
    if created:  # Only run for new users
        # 1. Create the user's profile
        Profile.objects.create(user=instance)

        # 2. Send the welcome email
        send_mail(
            subject='Welcome to Minsoto!',
            message=f'Hi {instance.first_name or instance.username},\n\nWelcome to Minsoto!',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.email],
            fail_silently=False,
        )

        # 3. Try to get the profile picture from Google
        try:
            social_account = instance.socialaccount_set.get(provider='google')
            if social_account:
                picture_url = social_account.extra_data.get('picture')
                if picture_url:
                    # Update the profile we just created
                    instance.profile.profile_picture_url = picture_url
                    instance.profile.save()
        except Exception:
            # If anything goes wrong, just ignore it.
            pass