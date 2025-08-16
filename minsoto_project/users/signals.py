from django.core.mail import send_mail
from django.dispatch import receiver
from allauth.account.signals import email_confirmed
from django.conf import settings

@receiver(email_confirmed)
def user_signed_up(request, email_address, **kwargs):
    """
    Sends a welcome email when a user confirms their email address.
    """
    user = email_address.user
    subject = 'Welcome to Minsoto!'
    message = f"""
Hello {user.username},

Welcome to Minsoto, the social network for focus and growth.

We're excited to have you on board. Start by exploring different Circles for your interests or create a new one to begin a project.

Let's turn distraction into productive action.

Best,
The Minsoto Team
"""
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL, # Or a specific 'from' address
        [email_address.email],
        fail_silently=False,
    )