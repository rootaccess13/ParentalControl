from django.urls import path
from .views import index, login, dashboard, reporter

urlpatterns = [
    path('home/', index, name='index'),
    path('login/', login, name='login'),
    path('dashboard/',dashboard, name='dashboard'),
    path('reporter/', reporter, name='reporter')
]