# circles/views.py
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from datetime import date
from .models import Circle, CircleMembership, Habit, HabitEntry
from .serializers import CircleSerializer, HabitSerializer, HabitEntrySerializer

class CircleListCreateView(generics.ListCreateAPIView):
    serializer_class = CircleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Circle.objects.filter(
            Q(is_private=False) | Q(members=self.request.user)
        ).distinct()
    
    def perform_create(self, serializer):
        interest_ids = serializer.validated_data.pop('interest_ids', [])
        circle = serializer.save(creator=self.request.user)
        
        # Add creator as admin
        CircleMembership.objects.create(
            user=self.request.user,
            circle=circle,
            role='creator'
        )
        
        # Add interests
        if interest_ids:
            from connections.models import Interest
            interests = Interest.objects.filter(id__in=interest_ids)
            circle.interests.set(interests)

class MyCirclesView(generics.ListAPIView):
    serializer_class = CircleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Circle.objects.filter(members=self.request.user)

class HabitListCreateView(generics.ListCreateAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Habit.objects.filter(
            user=self.request.user,
            is_active=True
        ).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class HabitDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_habit_complete(request, habit_id):
    habit = get_object_or_404(Habit, id=habit_id, user=request.user)
    entry_date = request.data.get('date', date.today().isoformat())
    notes = request.data.get('notes', '')
    
    try:
        entry_date = date.fromisoformat(entry_date)
    except ValueError:
        return Response(
            {'error': 'Invalid date format. Use YYYY-MM-DD'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    entry, created = HabitEntry.objects.get_or_create(
        habit=habit,
        date=entry_date,
        defaults={'notes': notes}
    )
    
    if not created:
        entry.completed = not entry.completed  # Toggle completion
        entry.notes = notes
        entry.save()
    
    return Response(HabitEntrySerializer(entry).data)
