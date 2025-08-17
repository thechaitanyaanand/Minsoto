# circles/views.py
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
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
        circle = serializer.save(creator=self.request.user)
        CircleMembership.objects.create(
            user=self.request.user,
            circle=circle,
            role='creator'
        )

class MyCirclesView(generics.ListAPIView):
    serializer_class = CircleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Circle.objects.filter(members=self.request.user)

class HabitListCreateView(generics.ListCreateAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
