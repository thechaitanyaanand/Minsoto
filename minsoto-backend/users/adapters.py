# users/adapters.py
'''from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.shortcuts import reverse
from django.http import HttpResponseRedirect
from allauth.socialaccount.models import SocialApp
from django.conf import settings

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        # This method is called right after a user successfully logs in via a social provider.
        user = sociallogin.user
        
        # Check if the user is new and their username is a default one (e.g., from email)
        if user.pk is None: # This means the user is being created
             # Because our model requires a unique username, allauth might auto-generate one
             # to save the user. We want to force the user to set their own.
             # We'll set a flag in the session.
             request.session['new_social_user'] = True

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def get_app(self, request, provider, client_id=None):
        """
        This method bypasses the django sites framework lookup.
        It directly fetches the SocialApp based on the provider name ('google').
        """
        try:
            # We assume one SocialApp per provider.
            app = SocialApp.objects.get(provider=provider)
            return app
        except SocialApp.DoesNotExist:
            # If you want to fall back to settings instead of the DB, you could do that here.
            # For now, this is simpler and ensures DB config is used.
            pass
        # This will raise a configuration error if no app is found.
        return super().get_app(request, provider, client_id)'''