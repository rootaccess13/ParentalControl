
from api.models import Profile, UrlType, URLBlacklist, ReportURL
import re
from django.contrib import messages


def index(request):
    return render(request, 'api/index.html')

def login(request):
    return render(request, 'api/login.html')

def dashboard(request):
    return render(request, 'api/dashboard.html')

def reporter(request):
    if request.method == 'POST':
        url = request.POST.get('url')
        if not url:
            messages.error(request, "No url provided.")
            return redirect('reporter')
        if not re.match(r'^https?://', url):
            messages.error(request, "Invalid url format")
            return redirect('reporter')
        if ReportURL.objects.filter(url=url).exists():
            messages.error(request, "Url already exists.")
            return redirect('reporter')
        report_url = ReportURL(url=url)
        report_url.save()
        messages.success(request, "URL successfully submitted.")
        return redirect('reporter')
    context = {
        'report_list': ReportURL.objects.all()
    }
    return render(request, 'api/reporter.html', context)
