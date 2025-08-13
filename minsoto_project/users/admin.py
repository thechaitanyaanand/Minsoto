from django.contrib import admin

# Register your models here.

from .models import CustomUser, Circle, Post

admin.site.register(CustomUser)
admin.site.register(Circle)
admin.site.register(Post)