# minsoto/urls.py
from django.contrib import admin
from django.urls import path, include
from users.views import SetUsernameView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/username/', SetUsernameView.as_view(), name='set_username'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    # The Google login URL will be handled by dj-rest-auth's social login views
    # but we need a custom callback view later. For now dj-rest-auth provides one.
]

# users/urls.py (You can create this file, but for this simple view, minsoto/urls.py is fine)