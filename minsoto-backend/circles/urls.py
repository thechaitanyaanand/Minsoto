# circles/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.CircleListCreateView.as_view(), name='circles'),
    path('my-circles/', views.MyCirclesView.as_view(), name='my-circles'),
    path('create/', views.CircleListCreateView.as_view(), name='create-circle'),
    path('habits/', views.HabitListCreateView.as_view(), name='habits'),
    path('habits/<int:pk>/', views.HabitDetailView.as_view(), name='habit-detail'),
    path('habits/<int:habit_id>/complete/', views.mark_habit_complete, name='mark_habit_complete'),
]
