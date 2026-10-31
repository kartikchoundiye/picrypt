# backend/encryptapp/urls.py

from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView,
)
from .views import (
    SendOTPView,
    VerifyOTPAndRegisterView,
    CustomTokenObtainPairView,
    EncryptView,
    DecryptView,
    HistoryListView,
    CarrierInfoView,
    UserProfileView,
    EmailChangeSendOTPView,
    EmailChangeVerifyView,
    ChangePasswordView,
)

urlpatterns = [
    # 1. Registration Flow
    path('auth/send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('auth/register/', VerifyOTPAndRegisterView.as_view(), name='register'),

    # 2. Login / Token Management
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),

    # 3. Profile & Account Security Management
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    path('auth/profile/email-change-otp/', EmailChangeSendOTPView.as_view(), name='email-change-otp'),
    path('auth/profile/email-change-verify/', EmailChangeVerifyView.as_view(), name='email-change-verify'),
    path('auth/profile/change-password/', ChangePasswordView.as_view(), name='change-password'),

    # 4. Steganography & Telemetry
    path('encrypt/', EncryptView.as_view(), name='encrypt'),
    path('decrypt/', DecryptView.as_view(), name='decrypt'),
    path('history/', HistoryListView.as_view(), name='history'),
    path('carrier-info/', CarrierInfoView.as_view(), name='carrier-info'),
]
