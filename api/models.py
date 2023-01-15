from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    firstname = models.CharField(max_length=50, blank=True, null=True)
    lastname = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(max_length=254, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} Profile'

class UrlType(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.URLField(max_length=200, blank=True, null=True)
    is_secure = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.url}'
    
TYPE = (
    ('malware', 'malware'),
    ('phishing', 'phishing'),
    ('adult', 'adult'),
)

class URLBlacklist(models.Model):
    url = models.URLField(max_length=200, blank=True, null=True)
    type = models.CharField(
        max_length = 20,
        choices = TYPE,
        default = 'adult'
        )
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.url} - {self.type}'


class ReportURL(models.Model):
    user = models.CharField(max_length=50, blank=True, null=True)
    url = models.URLField(max_length=200, blank=True, null=True)
    type = models.CharField(
        max_length = 20,
        choices = TYPE,
        default = 'adult'
        )
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} - {self.url} - {self.type}'