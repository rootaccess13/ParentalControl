from django.shortcuts import render
from api.models import Profile

def index(request):
    return render(request, 'api/index.html')

def login(request):
    return render(request, 'api/login.html')

def dashboard(request):
    return render(request, 'api/dashboard.html')