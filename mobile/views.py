from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from . forms import RegisterForm

# Create your views here.
def mobileIndex(request):
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
    return render(request, 'api/mobile_home.html')

def logout_view(request):
    logout(request)
    return redirect('mobile_login')