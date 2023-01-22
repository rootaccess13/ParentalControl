from django.urls import path
from .views import index, login, dashboard, reporter
from mobile.views import mobileIndex, mobileHome, mobileRegister, logout_view, DeviceDetail, MobileAccount, MobileReminder
urlpatterns = [
    path('', mobileIndex, name='mobile_login'),
    path('mobile/register/',mobileRegister, name='mobile_register'),
    path('mobile/home/', mobileHome, name='mobilehome'),
    path('mobile/logout/', logout_view, name='logout_view'),
    # Extension
    path('home/', index, name='index'),
    path('login/', login, name='login'),
    path('dashboard/',dashboard, name='dashboard'),
    path('reporter/', reporter, name='reporter'),
    path('d/detail/<str:slug>/', DeviceDetail, name='device_detail'),
    path('u/<str:user>/account/', MobileAccount, name='mobileaccount'),
    path('m/reminder/<str:user>/', MobileReminder, name='mobilereminder')
]