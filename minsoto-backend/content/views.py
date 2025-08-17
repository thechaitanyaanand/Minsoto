from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Post, Like, Comment
from .serializers import PostSerializer, CommentSerializer
from connections.models import Connection, Interest

class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        feed_type = self.request.query_params.get('feed_type', 'global')
        filter_param = self.request.query_params.get('filter', 'all')
        
        if feed_type == 'connections':
            # Get posts from connections
            user_connections = Connection.objects.filter(
                Q(user1=self.request.user) | Q(user2=self.request.user)
            )
            connected_users = []
            for conn in user_connections:
                other_user = conn.user2 if conn.user1 == self.request.user else conn.user1
                connected_users.append(other_user)
            
            queryset = Post.objects.filter(
                Q(author__in=connected_users) | Q(author=self.request.user),
                visibility__in=['public', 'connections']
            )
        else:
            # Global feed
            queryset = Post.objects.filter(visibility='public')
        
        if filter_param != 'all':
            try:
                interest = Interest.objects.get(name=filter_param)
                queryset = queryset.filter(interests=interest)
            except Interest.DoesNotExist:
                pass
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        
        if not created:
            like.delete()
            return Response({'liked': False})
        else:
            return Response({'liked': True})
            
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=404)
