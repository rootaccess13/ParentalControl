from django.contrib import admin
from . models import Profile, UrlType, URLBlacklist, ReportURL
# Register your models here.

admin.site.register(Profile)
admin.site.register(UrlType)
admin.site.register(URLBlacklist)
admin.site.register(ReportURL)