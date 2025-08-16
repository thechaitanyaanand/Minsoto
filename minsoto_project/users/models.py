# FILE: users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

# A custom user model allows us to add fields like bio, profile pictures, etc.
class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    profile_picture_url = models.URLField(max_length=255, blank=True, null=True)
    banner_image_url = models.URLField(max_length=255, blank=True, null=True)
    profile_theme = models.CharField(max_length=50, default='light')

    def __str__(self):
        return self.username

# A simple model to categorize interests.
class Interest(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

# The model for our communities, with a type to distinguish them.
class Circle(models.Model):
    class CircleType(models.TextChoices):
        INTEREST = 'INTEREST', 'Interest'
        PROJECT = 'PROJECT', 'Project'

    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True, default='')
    circle_type = models.CharField(
        max_length=10,
        choices=CircleType.choices,
        default=CircleType.INTEREST
    )
    owner = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='owned_circles')
    members = models.ManyToManyField(CustomUser, related_name='joined_circles', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# The model for user-generated posts.
class Post(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts')
    circle = models.ForeignKey(Circle, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Post by {self.author.username} in {self.circle.name}'