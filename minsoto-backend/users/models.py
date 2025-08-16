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