from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from . forms import RegisterForm
from api.models import Devices, ReportURL, UrlType, Reminder, Notification
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required as lr
# import messages
from django.contrib import messages
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
@lr(login_url='mobile_login')
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
    num_threats_malicious = UrlType.objects.all().filter(user=request.user, type="malware site").count()
    num_threats_malware = UrlType.objects.all().filter(user=request.user, type="malicious site").count()
    num_threats_phishing = UrlType.objects.all().filter(user=request.user, type="phishing site").count()
    context = {
        'instance': instance,
        'threats': threats,
        'num_threats_malicious': num_threats_malicious,
        'num_threats_malware': num_threats_malware,
        'num_threats_phishing': num_threats_phishing,
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
    reminder = Reminder.objects.filter(user=user_instance.id)
    context = {
    'user': user_instance,
    'devices': user_devices,
    'reminder': reminder,
    }
    return render(request, 'api/mobile_reminder.html', context)

def MobileAccountEdit(request, user):
    user_instance = User.objects.filter(username=user).first()
    if request.method == 'POST':
        user_instance.first_name = request.POST.get('first_name')
        user_instance.last_name = request.POST.get('last_name')
        user_instance.email = request.POST.get('email')
        user_instance.username = request.POST.get('username')
        user_instance.save()
        messages.success(request, "Account successfully updated.")
        return redirect('mobileaccount', user=user_instance.username)
    context = {
        'user': user_instance
    }
    return render(request, 'api/mobile_edit_account.html', context)


def MobileNotification(request):
    notif = Notification.objects.all().filter(user=request.user)
    context = {
        'notification' : notif
    }
    return render(request, 'api/notif.html', context)