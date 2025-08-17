# minsoto/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import SetUsernameView, GoogleLogin, MyProfileUpdateView, ProfileDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/username/', SetUsernameView.as_view(), name='set_username'),
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Add this
    path('api/profiles/me/', MyProfileUpdateView.as_view(), name='my-profile-update'),
    path('api/profiles/<str:username>/', ProfileDetailView.as_view(), name='profile-detail'),
]
