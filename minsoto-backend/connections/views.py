# connections/views.py
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import Interest, ConnectionRequest, Connection
from .serializers import InterestSerializer, ConnectionRequestSerializer, ConnectionSerializer

class InterestListCreateView(generics.ListCreateAPIView):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Interest.objects.all()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        
        if category:
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset.order_by('category', 'name')

class ConnectionRequestListView(generics.ListAPIView):
    serializer_class = ConnectionRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ConnectionRequest.objects.filter(
            receiver=self.request.user,
            status='pending'
        )

class MyConnectionsView(generics.ListAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        connection_type = self.request.query_params.get('type')
        
        queryset = Connection.objects.filter(
            Q(user1=user) | Q(user2=user)
        )
        
        if connection_type:
            queryset = queryset.filter(connection_type=connection_type)
        
        return queryset

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_connection_request(request):
    serializer = ConnectionRequestSerializer(data=request.data)
    if serializer.is_valid():
        # Check if request already exists
        existing = ConnectionRequest.objects.filter(
            sender=request.user,
            receiver_id=serializer.validated_data['receiver_id'],
            request_type=serializer.validated_data['request_type']
        ).first()
        
        if existing:
            return Response(
                {'error': 'Connection request already sent'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if connection already exists
        existing_connection = Connection.objects.filter(
            Q(user1=request.user, user2_id=serializer.validated_data['receiver_id']) |
            Q(user1_id=serializer.validated_data['receiver_id'], user2=request.user)
        ).first()
        
        if existing_connection:
            return Response(
                {'error': 'Connection already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        connection_request = serializer.save(sender=request.user)
        
        return Response(
            ConnectionRequestSerializer(connection_request).data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_to_connection_request(request, request_id):
    connection_request = get_object_or_404(
        ConnectionRequest,
        id=request_id,
        receiver=request.user,
        status='pending'
    )
    
    action = request.data.get('action')
    if action not in ['accept', 'decline']:
        return Response(
            {'error': 'Action must be "accept" or "decline"'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if action == 'accept':
        # Create connection
        connection = Connection.objects.create(
            user1=connection_request.sender,
            user2=connection_request.receiver,
            connection_type=connection_request.request_type
        )
        
        # Add interest if specified
        if connection_request.interest:
            connection.interests.add(connection_request.interest)
        
        connection_request.status = 'accepted'
    else:
        connection_request.status = 'declined'
    
    connection_request.save()
    
    return Response({'status': 'success'})
