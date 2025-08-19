# users/models.py (additions to existing Profile model)
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
    
    def get_connections(self, connection_type=None):
        """Get all connections for this user"""
        from connections.models import Connection
        connections = Connection.objects.filter(
            models.Q(user1=self) | models.Q(user2=self)
        )
        if connection_type:
            connections = connections.filter(connection_type=connection_type)
        return connections
    
    def get_connection_with(self, other_user):
        """Get connection with specific user if exists"""
        from connections.models import Connection
        try:
            return Connection.objects.get(
                models.Q(user1=self, user2=other_user) | 
                models.Q(user1=other_user, user2=self)
            )
        except Connection.DoesNotExist:
            return None

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, max_length=500)
    profile_picture_url = models.URLField(blank=True)
    theme_color = models.CharField(max_length=7, default='#FFFFFF')
    
    # Enhanced widget system
    widget_layout = models.JSONField(default=dict)
    active_widgets = models.JSONField(default=list)
    widget_preferences = models.JSONField(default=dict)
    
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
    
    # User preferences
    interests = models.ManyToManyField('connections.Interest', blank=True)
    show_habits_publicly = models.BooleanField(default=False)
    show_circles_publicly = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    def can_view_profile(self, viewer):
        """Check if viewer can see this profile"""
        if self.user == viewer:
            return True
        
        if self.profile_visibility == 'public':
            return True
        
        if self.profile_visibility == 'private':
            return False
        
        # Check connection level
        connection = self.user.get_connection_with(viewer)
        if not connection:
            return False
        
        if self.profile_visibility == 'connections':
            return True
        
        if self.profile_visibility == 'friends':
            return connection.connection_type == 'friend'
        
        return False
