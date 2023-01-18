from django.urls import path
from . views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', index, name='index'),
    path('login/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('profile/', ProfileViewSet.as_view({'get':'get'}), name='profile'),
    path('analyze/', AnalyzeURLView.as_view(), name='analyze_url'),
    path('devices/', SaveDevicesView.as_view({'post':'post'}), name='devices'),
    path('urls/', URLListView.as_view(), name='url_list'),
    path('blacklist/', URLBlacklistList.as_view({'get':'get'}), name='blacklist'),
    path('report/', ReportURLView.as_view({'get':'get','post':'post'}), name='report_url'),
    path('stats/<str:user>/getdata/', GetStatsView.as_view(), name='get_stat')
]
