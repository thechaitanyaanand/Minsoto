# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # We will use email as the main identifier, but username must be unique for profiles
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email' # Log in with email
    REQUIRED_FIELDS = ['username'] # Required fields during createsuperuser

    def __str__(self):
        return self.email

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, max_length=500)
    profile_picture_url = models.URLField(blank=True)
    theme_color = models.CharField(max_length=7, default='#FFFFFF')
    
    # Enhanced widget system
    widget_layout = models.JSONField(default=dict)  # Stores grid layout
    active_widgets = models.JSONField(default=list)  # List of active widget IDs
    widget_preferences = models.JSONField(default=dict)  # Widget-specific settings
    
    # Privacy settings
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('connections', 'Connections Only'),
            ('friends', 'Friends Only'),
            ('private', 'Private'),
        ],
        default='public'
    )
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
