from django.urls import path
from .views import index, login, dashboard, reporter, StaySafe
from mobile.views import mobileIndex, mobileHome, mobileRegister, logout_view, DeviceDetail, MobileAccount, MobileReminder,adminLogout, MobileAccountEdit, MobileNotification, thankyou, reset, newpassword, adminView, adminLogin
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
    path('m/reminder/<str:user>/', MobileReminder, name='mobilereminder'),
    path('m/account/edit/<str:user>/', MobileAccountEdit, name='mobileaccountedit'),
    path('m/notification/', MobileNotification, name='mobilenotification'),
    path('m/stay/safe/', StaySafe, name='stay_safe'),
    path('m/thankyou/', thankyou, name='thankyou'),
    path('m/reset/', reset, name='reset_password'),
    path('m/newpassword/', newpassword, name='new_password'),
    path('m/admin/', adminView, name='adminview'),
    path('m/admin/login/', adminLogin, name='admin_login'),
    path('m/admin/logout/', adminLogout, name='admin_logout')
]