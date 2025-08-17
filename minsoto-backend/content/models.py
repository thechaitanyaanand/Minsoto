# content/models.py
from django.db import models
from users.models import CustomUser
from connections.models import Interest

class Post(models.Model):
    POST_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('progress', 'Progress Update'),
        ('achievement', 'Achievement'),
    ]
    
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('connections', 'Connections Only'),
        ('friends', 'Friends Only'),
        ('circle', 'Circle Only'),
    ]
    
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    post_type = models.CharField(max_length=20, choices=POST_TYPES, default='text')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='public')
    interests = models.ManyToManyField(Interest, blank=True)
    image_url = models.URLField(blank=True)
    is_highlighted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Like(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'post']

class Comment(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
