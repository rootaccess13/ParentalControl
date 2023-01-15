from django.shortcuts import render
from api.models import Profile, UrlType, URLBlacklist, ReportURL

def index(request):
    return render(request, 'api/index.html')

def login(request):
    return render(request, 'api/login.html')

def dashboard(request):
    return render(request, 'api/dashboard.html')

def reporter(request):
    context = {
        'report_list': ReportURL.objects.all()
    }
    return render(request, 'api/reporter.html', context)