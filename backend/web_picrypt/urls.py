"""
URL configuration for web_picrypt project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.views.generic.base import RedirectView
# from encryptapp.views import EncryptAPIView, DecryptAPIView, DownloadFileAPIView 
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # Added a redirect for the root path ('') to /admin/
    path('', RedirectView.as_view(url='admin/', permanent=False)),
    path('admin/', admin.site.urls),

    # Map all /api/auth/ calls to your encryptapp URLs
    path('api/', include('encryptapp.urls')), 

    # path('api/encrypt/', EncryptAPIView.as_view(), name='encrypt'),
    # path('api/decrypt/', DecryptAPIView.as_view(), name='decrypt'),
    # path('api/download/', DownloadFileAPIView.as_view(), name='download_file'),
    path("api/steghide/", include("encryptapp.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
