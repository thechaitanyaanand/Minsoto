from rest_framework import serializers
from .models import Post, Like, Comment
from users.serializers import PublicUserSerializer
from connections.serializers import InterestSerializer

class PostSerializer(serializers.ModelSerializer):
    author = PublicUserSerializer(read_only=True)
    interests = InterestSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'post_type', 'visibility', 'interests', 
                 'image_url', 'is_highlighted', 'created_at', 'likes_count', 
                 'comments_count', 'is_liked']
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

class CommentSerializer(serializers.ModelSerializer):
    author = PublicUserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']
