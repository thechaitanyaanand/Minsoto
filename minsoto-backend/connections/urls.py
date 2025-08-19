# connections/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('interests/', views.InterestListCreateView.as_view(), name='interests'),
    path('requests/', views.ConnectionRequestListView.as_view(), name='connection_requests'),
    path('requests/send/', views.send_connection_request, name='send_connection_request'),
    path('requests/<int:request_id>/respond/', views.respond_to_connection_request, name='respond_connection_request'),
    path('my-connections/', views.MyConnectionsView.as_view(), name='my_connections'),
]
