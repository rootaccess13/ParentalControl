from django.urls import path
from .views import index, login, dashboard

urlpatterns = [
    path('home/', index, name='index'),
    path('login/', login, name='login'),
    path('dashboard/',dashboard, name='dashboard')
]