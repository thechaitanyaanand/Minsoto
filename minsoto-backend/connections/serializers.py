# connections/serializers.py
from rest_framework import serializers
from .models import Interest, ConnectionRequest, Connection
from users.serializers import PublicUserSerializer

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['id', 'name', 'description']

class ConnectionRequestSerializer(serializers.ModelSerializer):
    sender = PublicUserSerializer(read_only=True)
    receiver = PublicUserSerializer(read_only=True)
    interest = InterestSerializer(read_only=True)
    
    class Meta:
        model = ConnectionRequest
        fields = ['id', 'sender', 'receiver', 'request_type', 'interest', 'status', 'message', 'created_at']

class ConnectionSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    interests = InterestSerializer(many=True, read_only=True)
    
    class Meta:
        model = Connection
        fields = ['id', 'user', 'connection_type', 'interests', 'created_at']
    
    def get_user(self, obj):
        # Return the other user in the connection
        request_user = self.context['request'].user
        other_user = obj.user2 if obj.user1 == request_user else obj.user1
        return PublicUserSerializer(other_user).data
