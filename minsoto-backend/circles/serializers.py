# circles/serializers.py
from rest_framework import serializers
from .models import Circle, CircleMembership, Habit, HabitEntry
from connections.serializers import InterestSerializer
from users.serializers import PublicUserSerializer

class CircleMembershipSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)
    
    class Meta:
        model = CircleMembership
        fields = ['user', 'role', 'joined_at']

class CircleSerializer(serializers.ModelSerializer):
    creator = PublicUserSerializer(read_only=True)
    interests = InterestSerializer(many=True, read_only=True)
    interest_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    member_count = serializers.ReadOnlyField()
    is_member = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    
    class Meta:
        model = Circle
        fields = ['id', 'name', 'description', 'circle_type', 'creator', 
                 'interests', 'interest_ids', 'is_private', 'max_members', 
                 'member_count', 'is_member', 'user_role', 'created_at']
    
    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists()
        return False
    
    def get_user_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            membership = CircleMembership.objects.filter(
                user=request.user, circle=obj
            ).first()
            return membership.role if membership else None
        return None

class HabitSerializer(serializers.ModelSerializer):
    streak_data = serializers.SerializerMethodField()
    
    class Meta:
        model = Habit
        fields = ['id', 'name', 'description', 'target_frequency', 
                 'current_streak', 'best_streak', 'is_active', 'is_public',
                 'streak_data', 'created_at']
    
    def get_streak_data(self, obj):
        # Return last 30 days of data
        from datetime import date, timedelta
        end_date = date.today()
        start_date = end_date - timedelta(days=29)
        
        entries = obj.entries.filter(
            date__gte=start_date,
            date__lte=end_date
        ).values('date', 'completed')
        
        # Create a complete 30-day dataset
        data = {}
        for entry in entries:
            data[entry['date'].isoformat()] = entry['completed']
        
        # Fill missing dates
        current = start_date
        while current <= end_date:
            if current.isoformat() not in data:
                data[current.isoformat()] = False
            current += timedelta(days=1)
        
        return data

class HabitEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitEntry
        fields = ['id', 'date', 'completed', 'notes', 'created_at']
