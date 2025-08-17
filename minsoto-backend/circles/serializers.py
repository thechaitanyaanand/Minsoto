from rest_framework import serializers
from .models import Circle, CircleMembership, Habit, HabitEntry
from users.serializers import PublicUserSerializer
from connections.serializers import InterestSerializer

class CircleSerializer(serializers.ModelSerializer):
    creator = PublicUserSerializer(read_only=True)
    interests = InterestSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    
    class Meta:
        model = Circle
        fields = ['id', 'name', 'description', 'circle_type', 'creator', 
                 'interests', 'is_private', 'max_members', 'member_count', 
                 'is_member', 'created_at']
    
    def get_member_count(self, obj):
        return obj.members.count()
    
    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists()
        return False

class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ['id', 'name', 'description', 'target_frequency', 
                 'current_streak', 'best_streak', 'is_active', 'created_at']

class HabitEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitEntry
        fields = ['id', 'date', 'completed', 'notes', 'created_at']
