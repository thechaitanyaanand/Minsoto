# connections/models.py
from django.db import models
from users.models import CustomUser

class Interest(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, blank=True)  # e.g., 'Technology', 'Sports', 'Arts'
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Icon name for UI
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['category', 'name']
    
    def __str__(self):
        return self.name

class ConnectionRequest(models.Model):
    REQUEST_TYPES = [
        ('connection', 'Connection'),
        ('friend', 'Friend'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    ]
    
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_requests')
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPES)
    interest = models.ForeignKey(Interest, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['sender', 'receiver', 'request_type']  # One request per type per user pair
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.sender.username} → {self.receiver.username} ({self.request_type})"

class Connection(models.Model):
    CONNECTION_TYPES = [
        ('connection', 'Connection'),
        ('friend', 'Friend'),
    ]
    
    user1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='connections_as_user1')
    user2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='connections_as_user2')
    connection_type = models.CharField(max_length=20, choices=CONNECTION_TYPES)
    interests = models.ManyToManyField(Interest, blank=True)  # Shared interests for this connection
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user1', 'user2']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user1.username} ⇄ {self.user2.username} ({self.connection_type})"
    
    def get_other_user(self, current_user):
        """Helper method to get the other user in the connection"""
        return self.user2 if self.user1 == current_user else self.user1
