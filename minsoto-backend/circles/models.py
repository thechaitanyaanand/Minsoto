# circles/models.py
from django.db import models
from users.models import CustomUser
from connections.models import Interest

class Circle(models.Model):
    CIRCLE_TYPES = [
        ('project', 'Project Collaboration'),
        ('habit', 'Habit Building'),
        ('accountability', 'Accountability Group'),
        ('learning', 'Learning Group'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    circle_type = models.CharField(max_length=20, choices=CIRCLE_TYPES)
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_circles')
    members = models.ManyToManyField(CustomUser, through='CircleMembership', related_name='circles')
    interests = models.ManyToManyField(Interest)
    is_private = models.BooleanField(default=False)
    max_members = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

class CircleMembership(models.Model):
    ROLE_CHOICES = [
        ('member', 'Member'),
        ('moderator', 'Moderator'),
        ('creator', 'Creator'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    circle = models.ForeignKey(Circle, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)

class Habit(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='habits')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    target_frequency = models.PositiveIntegerField(default=1)  # times per day
    current_streak = models.PositiveIntegerField(default=0)
    best_streak = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class HabitEntry(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='entries')
    date = models.DateField()
    completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['habit', 'date']
