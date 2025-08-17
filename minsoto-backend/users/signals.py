# users/signals.py
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.conf import settings

# CORRECT IMPORT: pre_social_login is from allauth, not django
from allauth.socialaccount.signals import pre_social_login
from allauth.socialaccount.models import SocialAccount
from .models import CustomUser, Profile

User = get_user_model()

@receiver(pre_social_login)
def link_to_existing_user(sender, request, sociallogin, **kwargs):
    """
    Automatically link social accounts to existing users with the same email
    """
    # Get the email from the social login
    email_address = sociallogin.account.extra_data.get('email')
    
    if email_address:
        try:
            # Check if a user with this email already exists
            existing_user = User.objects.get(email=email_address)
            
            # Connect the social account to the existing user
            sociallogin.connect(request, existing_user)
            
            print(f"Connected social account to existing user: {email_address}")
            
        except User.DoesNotExist:
            # User doesn't exist, proceed with normal signup
            pass
        except Exception as e:
            print(f"Error linking social account: {str(e)}")

@receiver(post_save, sender=CustomUser)
def handle_new_user_creation(sender, instance, created, **kwargs):
    """
    Handles tasks that need to run when a new user is created.
    """
    if created:
        # Create the user's profile
        Profile.objects.get_or_create(user=instance)
        
        # Send welcome email
        try:
            send_mail(
                subject='Welcome to Minsoto!',
                message=f'Hi {instance.first_name or instance.username},\n\nWelcome to Minsoto!',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Failed to send welcome email: {str(e)}")
        
        # Try to get profile picture from Google
        try:
            social_account = instance.socialaccount_set.get(provider='google')
            if social_account:
                picture_url = social_account.extra_data.get('picture')
                if picture_url:
                    instance.profile.profile_picture_url = picture_url
                    instance.profile.save()
        except SocialAccount.DoesNotExist:
            pass
        except Exception as e:
            print(f"Failed to set profile picture: {str(e)}")
