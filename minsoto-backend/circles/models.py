# circles/models.py
from django.db import models
from django.utils import timezone
from datetime import date, timedelta
from users.models import CustomUser
from connections.models import Interest

class Circle(models.Model):
    CIRCLE_TYPES = [
        ('project', 'Project'),
        ('habit', 'Habit Building'),
        ('learning', 'Learning'),
        ('accountability', 'Accountability'),
        ('social', 'Social'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    circle_type = models.CharField(max_length=20, choices=CIRCLE_TYPES)
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_circles')
    members = models.ManyToManyField(CustomUser, through='CircleMembership', related_name='circles')
    interests = models.ManyToManyField(Interest, blank=True)
    is_private = models.BooleanField(default=False)
    max_members = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Circle settings
    allow_public_posts = models.BooleanField(default=True)
    require_approval = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.circle_type})"
    
    @property
    def member_count(self):
        return self.members.count()

class CircleMembership(models.Model):
    ROLES = [
        ('creator', 'Creator'),
        ('admin', 'Admin'),
        ('member', 'Member'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    circle = models.ForeignKey(Circle, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['user', 'circle']

class Habit(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='habits')
    circle = models.ForeignKey(Circle, on_delete=models.CASCADE, null=True, blank=True, related_name='habits')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    target_frequency = models.IntegerField(default=1)  # times per day
    is_public = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Streak tracking
    current_streak = models.IntegerField(default=0)
    best_streak = models.IntegerField(default=0)
    last_completed = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s {self.name}"
    
    def update_streak(self, completion_date=None):
        """Update streak based on habit entries"""
        if completion_date is None:
            completion_date = date.today()
        
        # Get recent entries
        recent_entries = self.entries.filter(
            date__lte=completion_date,
            completed=True
        ).order_by('-date')
        
        if not recent_entries:
            self.current_streak = 0
            self.save()
            return
        
        # Calculate current streak
        streak = 0
        check_date = completion_date
        
        for entry in recent_entries:
            if entry.date == check_date:
                streak += 1
                check_date -= timedelta(days=1)
            else:
                break
        
        self.current_streak = streak
        if streak > self.best_streak:
            self.best_streak = streak
        
        self.last_completed = completion_date
        self.save()

class HabitEntry(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='entries')
    date = models.DateField()
    completed = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['habit', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.habit.name} - {self.date} ({'✓' if self.completed else '✗'})"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update streak when entry is saved
        self.habit.update_streak(self.date)
