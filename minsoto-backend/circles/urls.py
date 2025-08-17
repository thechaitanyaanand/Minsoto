from django.urls import path
from . import views

urlpatterns = [
    path('', views.CircleListCreateView.as_view(), name='circles'),
    path('my-circles/', views.MyCirclesView.as_view(), name='my-circles'),
    path('create/', views.CircleListCreateView.as_view(), name='create-circle'),
    path('habits/', views.HabitListCreateView.as_view(), name='habits'),
]
