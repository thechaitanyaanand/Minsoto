# FILE: users/views.py

from django.db.models import Q
from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from .models import (
    CustomUser,
    Circle,
    Post,
    Friendship,
    Connection,
    Habit,
    Streak,
    Interest
)
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    CircleSerializer,
    PostSerializer,
    FriendshipSerializer,
    ConnectionSerializer,
    HabitSerializer,
    StreakSerializer,
    InterestSerializer
)

# --- AUTHENTICATION VIEWS ---

class RegisterView(generics.CreateAPIView):
    """
    Handles new user registration.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view to include user data alongside JWT tokens.
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = CustomUser.objects.get(username=request.data['username'])
            serializer = UserSerializer(user)
            response.data['user'] = serializer.data
        return response

class GoogleLoginView(SocialLoginView):
    """
    Handles social login via Google.
    """
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000"  # Your frontend URL
    client_class = OAuth2Client

# --- CORE FEATURE VIEWS ---

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to user profiles with custom visibility logic.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        """
        Custom retrieve method to implement profile visibility logic.
        """
        profile_user = self.get_object()
        requesting_user = request.user
        
        # Users can always see their own profile
        if profile_user == requesting_user:
            return super().retrieve(request, *args, **kwargs)

        # Check for friendship
        is_friend = Friendship.objects.filter(
            (Q(requester=requesting_user, receiver=profile_user) |
             Q(requester=profile_user, receiver=requesting_user)),
            status='accepted'
        ).exists()
        
        # Serialize and return data based on relationship
        serializer = self.get_serializer(profile_user, context={
            'requesting_user': requesting_user,
            'is_friend': is_friend
        })
        return Response(serializer.data)

class CircleViewSet(viewsets.ModelViewSet):
    """
    Handles creating, listing, retrieving, joining, and leaving circles.
    """
    queryset = Circle.objects.all()
    serializer_class = CircleSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        circle = self.get_object()
        circle.members.add(request.user)
        return Response({'status': f'Successfully joined {circle.name}'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def leave(self, request, pk=None):
        circle = self.get_object()
        circle.members.remove(request.user)
        return Response({'status': f'Successfully left {circle.name}'}, status=status.HTTP_200_OK)

class PostViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD for posts within circles.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Optionally filters posts by a specific circle.
        """
        queryset = super().get_queryset()
        circle_id = self.request.query_params.get('circle_id')
        if circle_id:
            queryset = queryset.filter(circle_id=circle_id)
        return queryset

    def perform_create(self, serializer):
        # Ensure the user creating the post is the authenticated user
        serializer.save(author=self.request.user)

class GlobalFeedView(generics.ListAPIView):
    """
    Aggregates the main feed for the authenticated user.
    """
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        friends = CustomUser.objects.filter(
            Q(friend_requests_sent__receiver=user, friend_requests_sent__status='accepted') |
            Q(friend_requests_received__requester=user, friend_requests_received__status='accepted')
        )
        return Post.objects.filter(
            Q(circle__in=user.joined_circles.all()) | Q(author__in=friends)
        ).distinct().order_by('-created_at')

class FriendshipViewSet(viewsets.ModelViewSet):
    """
    Manages friend requests: sending, accepting, rejecting, and deleting.
    """
    serializer_class = FriendshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own friendships/requests
        return Friendship.objects.filter(Q(requester=self.request.user) | Q(receiver=self.request.user))

    def perform_create(self, serializer):
        # Set the requester to the current user
        serializer.save(requester=self.request.user)

class ConnectionViewSet(viewsets.ModelViewSet):
    """
    Manages interest-based connections.
    """
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own connections
        return Connection.objects.filter(Q(requester=self.request.user) | Q(receiver=self.request.user))

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)
        
class HabitViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD for habits and the check-in action for streaks.
    """
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own habits
        return Habit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        habit = serializer.save(user=self.request.user)
        # Automatically create a Streak record for the new habit
        Streak.objects.create(habit=habit)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def checkin(self, request, pk=None):
        # This is where you would put the logic to update the streak
        # For brevity, this is a placeholder for the full implementation
        habit = self.get_object()
        streak, created = Streak.objects.get_or_create(habit=habit)
        # ... Add logic to check last_checkin_date and update streak ...
        streak.current_streak += 1
        streak.save()
        return Response({'status': 'Checked in!', 'current_streak': streak.current_streak})