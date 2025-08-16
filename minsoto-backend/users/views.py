# users/views.py
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser

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