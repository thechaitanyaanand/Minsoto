# users/adapters.py
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.shortcuts import reverse
from django.http import HttpResponseRedirect

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