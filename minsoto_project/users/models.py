# FILE: users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

# A custom user model allows us to add fields like bio, profile pictures, etc.
class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    profile_picture_url = models.URLField(max_length=255, blank=True, null=True)
    banner_image_url = models.URLField(max_length=255, blank=True, null=True)
    profile_theme = models.CharField(max_length=50, default='light')
    # For Phase 2: Store the tiling layout for the user's profile
    profile_layout = models.JSONField(null=True, blank=True)

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
    # To allow users to feature posts on their profile
    is_pinned = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Post by {self.author.username} in {self.circle.name}'

# --- NEW MODELS BASED ON YOUR SCHEMA ---

class Connection(models.Model):
    requester = models.ForeignKey(CustomUser, related_name='connection_requests_sent', on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser, related_name='connection_requests_received', on_delete=models.CASCADE)
    interest = models.ForeignKey(Interest, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('accepted', 'Accepted')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('requester', 'receiver', 'interest')

class Friendship(models.Model):
    requester = models.ForeignKey(CustomUser, related_name='friend_requests_sent', on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser, related_name='friend_requests_received', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('accepted', 'Accepted')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('requester', 'receiver')

class Habit(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='habits')
    # A habit can be linked to a Project Circle for accountability
    circle = models.ForeignKey(Circle, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"

class Streak(models.Model):
    habit = models.OneToOneField(Habit, on_delete=models.CASCADE, primary_key=True)
    current_streak = models.PositiveIntegerField(default=0)
    last_checkin_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Streak for {self.habit.name}"