from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from . forms import RegisterForm
from api.models import Devices, ReportURL, UrlType
from django.contrib.auth.models import User
# Create your views here.
def mobileIndex(request):
    if request.user.is_authenticated:
        return redirect('mobilehome')
    else:
        if request.method == 'POST':
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('mobilehome')
            else:
                return render(request, 'api/mobile_auth.html', {'error': 'Invalid login credentials.'})
        else:
            return render(request, 'api/mobile_auth.html')

def mobileRegister(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('mobilehome')
    else:
        form = RegisterForm()
    return render(request, 'api/mobile_register.html', {'form': form})

def mobileHome(request):
    context = {
        'devices': Devices.objects.all().filter(user=request.user),
        
    }
    return render(request, 'api/mobile_home.html', context)

def logout_view(request):
    logout(request)
    return redirect('mobile_login')


def DeviceDetail(request, slug):
    instance = Devices.objects.all().filter(slug=slug)
    threats = UrlType.objects.all().filter(user=request.user)

    context = {
        'instance': instance,
        'threats': threats
    }
    return render(request, 'api/device_detail.html', context)

def MobileAccount(request, user):
    user_data = User.objects.all().filter(username=user)
    context = {
        'user':  user_data
    }
    return render(request, 'api/mobile_account.html', context)

def MobileReminder(request, user):
    user_instance = User.objects.filter(username=user).first()
    user_devices = Devices.objects.filter(user=user_instance.id)
    context = {
    'user': user_instance,
    'devices': user_devices
    }
    return render(request, 'api/mobile_reminder.html', context)