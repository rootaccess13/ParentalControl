from django.shortcuts import render, redirect
from api.models import Profile, UrlType, URLBlacklist, ReportURL

def index(request):
    return render(request, 'api/index.html')

def login(request):
    return render(request, 'api/login.html')

def dashboard(request):
    return render(request, 'api/dashboard.html')

def reporter(request):
    if request.method == 'POST':
        url = request.POST.get('url')
        report_url = ReportURL(url=url)
        report_url.save()
        return redirect('reporter')
    context = {
        'report_list': ReportURL.objects.all()
    }
    return render(request, 'api/reporter.html', context)