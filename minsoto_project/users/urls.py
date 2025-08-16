# This file did not exist in your provided code, so create it.
# If it exists, replace its contents with this.

from django.urls import path, include
from .views import GoogleLoginView

urlpatterns = [
    # URLs for dj-rest-auth
    # This includes endpoints for login, logout, password reset, etc.
    path('auth/', include('dj_rest_auth.urls')),
    
    # URLs for dj-rest-auth registration
    # This includes endpoints for registration and email verification.
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    
    # Custom URL for our Google login view
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
]