from django.contrib import admin
from . models import Profile, UrlType, URLBlacklist
# Register your models here.

admin.site.register(Profile)
admin.site.register(UrlType)
admin.site.register(URLBlacklist)