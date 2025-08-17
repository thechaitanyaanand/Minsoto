# users/serializers.py
from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from .models import CustomUser, Profile

class CustomUserDetailsSerializer(UserDetailsSerializer):
    username_is_default = serializers.SerializerMethodField()

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('username_is_default',)

    def get_username_is_default(self, instance):
        # A simple check. You might have a better way to flag this.
        # For instance, if the username is the user's email or a random string.
        # The session flag is harder to access here, so we check the username itself.
        # A good strategy: allauth might default the username to user's first name,
        # so check if a username exists that isn't the user's email.
        return instance.username == instance.email.split('@')[0] or not instance.username


# In settings.py, tell dj-rest-auth to use it
REST_AUTH_SERIALIZERS = {
    'USER_DETAILS_SERIALIZER': 'users.serializers.CustomUserDetailsSerializer',
}
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'profile_picture_url', 'theme_color', 'widget_layout']

class PublicUserSerializer(serializers.ModelSerializer):
    # Nest the profile serializer to include profile data with the user
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'profile']