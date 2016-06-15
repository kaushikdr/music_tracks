from django.contrib import admin
from .models import Genre, Track


# Register your models here.
admin.site.register([Genre, Track])