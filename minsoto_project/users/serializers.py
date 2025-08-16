from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer as DefaultRegisterSerializer
from .models import (
    CustomUser,
    Circle,
    Post,
    Interest,
    Connection,
    Friendship,
    Habit,
    Streak
)

# --- Authentication Serializers ---

class RegisterSerializer(DefaultRegisterSerializer):
    # We are extending the default serializer to ensure it uses our custom fields
    # if we add them later, like a username.
    username = serializers.CharField(required=True, max_length=150)

    def custom_signup(self, request, user):
        user.username = self.validated_data.get('username', '')
        user.save(update_fields=['username'])

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model, used for retrieving user details.
    """
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'bio', 'profile_picture_url', 'banner_image_url')

# --- Core Feature Serializers ---

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = '__all__'

class CircleSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Circle
        fields = ('id', 'name', 'description', 'circle_type', 'owner', 'member_count', 'created_at')

    def get_member_count(self, obj):
        return obj.members.count()

class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    circle = serializers.StringRelatedField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'circle', 'content', 'created_at', 'is_pinned')

# --- Connection and Friendship Serializers ---

class FriendshipSerializer(serializers.ModelSerializer):
    requester = serializers.StringRelatedField(read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)

    class Meta:
        model = Friendship
        fields = ('id', 'requester', 'receiver', 'receiver_username', 'status', 'created_at')
        extra_kwargs = {
            'receiver': {'write_only': True},
        }

class ConnectionSerializer(serializers.ModelSerializer):
    requester = serializers.StringRelatedField(read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)
    interest_name = serializers.CharField(source='interest.name', read_only=True)

    class Meta:
        model = Connection
        fields = ('id', 'requester', 'receiver', 'receiver_username', 'interest', 'interest_name', 'status', 'created_at')
        extra_kwargs = {
            'receiver': {'write_only': True},
            'interest': {'write_only': True},
        }

# --- Habit and Streak Serializers ---

class StreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Streak
        fields = ('current_streak', 'last_checkin_date')

class HabitSerializer(serializers.ModelSerializer):
    streak = StreakSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Habit
        fields = ('id', 'user', 'circle', 'name', 'created_at', 'streak')