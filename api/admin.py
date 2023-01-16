from django.contrib import admin
from . models import Profile, UrlType, URLBlacklist, ReportURL, Devices
from django.contrib.auth.models import User

admin.site.register(Profile)
admin.site.register(UrlType)
admin.site.register(URLBlacklist)
admin.site.register(ReportURL)
admin.site.register(Devices)