# users/views.py
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from .serializers import PublicUserSerializer, ProfileSerializer
from rest_framework import generics
from .models import Profile
from django.db import IntegrityError
import logging
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q


logger = logging.getLogger(__name__)

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/auth/google/callback"
    client_class = OAuth2Client
    
    def post(self, request, *args, **kwargs):
        logger.info(f"Google login attempt with data: {request.data}")
        
        try:
            response = super().post(request, *args, **kwargs)
            logger.info(f"Google login successful: {response.status_code}")
            return response
        except IntegrityError as e:
            logger.error(f"Integrity error during Google login: {str(e)}")
            
            if "email" in str(e) and "already exists" in str(e):
                return Response(
                    {
                        "error": "An account with this email already exists. Please log in with your existing credentials or contact support.",
                        "detail": "email_already_exists"
                    }, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response(
                {"error": "Account creation failed due to duplicate data"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Google login failed: {str(e)}")
            return Response(
                {"error": "Authentication failed"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
class SetUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        if not username:
            return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if username already exists
        if CustomUser.objects.filter(username__iexact=username).exists():
            return Response({'error': 'This username is already taken.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user.username = username
        user.save()

        # Clear the session flag after setting the username
        if 'new_social_user' in request.session:
            del request.session['new_social_user']

        return Response({'success': 'Username has been set.'}, status=status.HTTP_200_OK)

# --- THIS VIEW FETCHES A PROFILE BY USERNAME ---
class ProfileDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = PublicUserSerializer
    lookup_field = 'username' # Fetch user by username instead of ID
    permission_classes = [] # Allow any user (even unauthenticated) to view profiles

# --- THIS VIEW LETS A LOGGED-IN USER UPDATE THEIR OWN PROFILE ---
class MyProfileUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated] # Only logged-in users can access

    def get_object(self):
        # This ensures users can only update their own profile
        return self.request.user.profile
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.GET.get('q', '')
    if not query or len(query) < 2:
        return Response([])
    
    users = CustomUser.objects.filter(
        Q(username__icontains=query) | 
        Q(first_name__icontains=query) | 
        Q(last_name__icontains=query) |
        Q(email__icontains=query)
    ).exclude(id=request.user.id)[:10]  # Limit to 10 results
    
    serializer = PublicUserSerializer(users, many=True, context={'request': request})
    return Response(serializer.data)
