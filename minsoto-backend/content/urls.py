from django.urls import path
from . import views

urlpatterns = [
    path('feed/', views.PostListCreateView.as_view(), name='content-feed'),
    path('posts/<int:post_id>/like/', views.like_post, name='like-post'),
]
