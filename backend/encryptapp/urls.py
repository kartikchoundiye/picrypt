# backend/encryptapp/urls.py

from django.urls import path, include
from .views import SendOTPView, VerifyOTPAndRegisterView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView, # For explicit logout
)
from .views import EncryptView, DecryptView , HistoryListView , CarrierInfoView

urlpatterns = [
    # 1. Registration Flow
    path('auth/send-otp/', SendOTPView.as_view(), name='send-otp'),
    path("auth/register/", VerifyOTPAndRegisterView.as_view()),

    # 2. Login/Token Management
    path("auth/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # This endpoint is crucial for logout/blacklisting the refresh token
    path('auth/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path("encrypt/", EncryptView.as_view(), name="encrypt"),
    path("decrypt/", DecryptView.as_view(), name="decrypt"),
    path("history/", HistoryListView.as_view(), name="history"),
    path("carrier-info/", CarrierInfoView.as_view()),
]

