from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, GoogleLoginView # Add GoogleLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # New URL for Google Login
    path('google/', GoogleLoginView.as_view(), name='google_login'),
]