# connections/views.py
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Interest, ConnectionRequest, Connection
from .serializers import InterestSerializer, ConnectionRequestSerializer, ConnectionSerializer
from users.models import CustomUser

class InterestListCreateView(generics.ListCreateAPIView):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_connection_request(request):
    receiver_id = request.data.get('receiver_id')
    request_type = request.data.get('request_type', 'connection')
    interest_id = request.data.get('interest_id')
    message = request.data.get('message', '')
    
    try:
        receiver = CustomUser.objects.get(id=receiver_id)
        interest = Interest.objects.get(id=interest_id) if interest_id else None
        
        # Check if request already exists
        existing_request = ConnectionRequest.objects.filter(
            sender=request.user,
            receiver=receiver,
            interest=interest
        ).first()
        
        if existing_request:
            return Response({'error': 'Connection request already sent'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        connection_request = ConnectionRequest.objects.create(
            sender=request.user,
            receiver=receiver,
            request_type=request_type,
            interest=interest,
            message=message
        )
        
        serializer = ConnectionRequestSerializer(connection_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Interest.DoesNotExist:
        return Response({'error': 'Interest not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_to_connection_request(request, request_id):
    action = request.data.get('action')  # 'accept' or 'decline'
    
    try:
        connection_request = ConnectionRequest.objects.get(
            id=request_id,
            receiver=request.user,
            status='pending'
        )
        
        if action == 'accept':
            connection_request.status = 'accepted'
            connection_request.save()
            
            # Create connection
            connection, created = Connection.objects.get_or_create(
                user1=min(connection_request.sender, connection_request.receiver, key=lambda x: x.id),
                user2=max(connection_request.sender, connection_request.receiver, key=lambda x: x.id),
                defaults={'connection_type': connection_request.request_type}
            )
            
            if connection_request.interest:
                connection.interests.add(connection_request.interest)
            
            return Response({'message': 'Connection request accepted'})
            
        elif action == 'decline':
            connection_request.status = 'declined'
            connection_request.save()
            return Response({'message': 'Connection request declined'})
            
    except ConnectionRequest.DoesNotExist:
        return Response({'error': 'Connection request not found'}, 
                      status=status.HTTP_404_NOT_FOUND)

class MyConnectionsView(generics.ListAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Connection.objects.filter(
            Q(user1=self.request.user) | Q(user2=self.request.user)
        )
