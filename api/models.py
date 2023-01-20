from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.urls import reverse

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    firstname = models.CharField(max_length=50, blank=True, null=True)
    lastname = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(max_length=254, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} Profile'
        
class Devices(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    device_name = models.CharField(max_length=255)
    device_type = models.CharField(max_length=255)
    user_agent = models.CharField(max_length=255)
    logged_in = models.BooleanField(default=False)
    removed = models.BooleanField(default=False)
    slug = models.SlugField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        self.slug = slugify(self.device_name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('device_detail', kwargs={'slug' : self.slug})

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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.URLField(max_length=200, blank=True, null=True)
    type = models.CharField(
        max_length = 20,
        choices = TYPE,
        default = 'adult'
        )
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.url} - {self.type}'
    

class Reminder(models.Model):
    user =  models.ForeignKey(User, on_delete=models.CASCADE)
    device = models.ForeignKey(Devices, on_delete=models.CASCADE)
    message = models.CharField(max_length=1024, blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username + " - " + self.device.device_name
