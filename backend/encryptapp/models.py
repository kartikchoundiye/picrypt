from django.db import models
from django.contrib.auth.models import User
import uuid
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth import get_user_model

class OTP(models.Model):
    # Link to Django's built-in User model
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    # Use email for verification before the User object is fully created/activated
    email = models.EmailField(unique=True) 
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    # Set an expiry time (e.g., 5 minutes)
    expires_at = models.DateTimeField() 
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def __str__(self):
        return f"OTP for {self.email}"

# class FileRecord(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     file_name = models.CharField(max_length=255)
#     action = models.CharField(max_length=20)  # 'encrypt' or 'decrypt'
#     timestamp = models.DateTimeField(auto_now_add=True)
#     # Add more fields as needed


User = get_user_model()

class History(models.Model):
    ACTION_CHOICES = (
        ("encrypt", "Encrypt"),
        ("decrypt", "Decrypt"),
    )
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    carrier_filename = models.CharField(max_length=255, blank=True)
    stego_filename = models.CharField(max_length=255, blank=True)  # stored filename in MEDIA_ROOT/stego
    files_info = models.JSONField(default=list)  # list of {name, size, mime}
    payload_size = models.BigIntegerField(default=0)
    success = models.BooleanField(default=False)
    error_message = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} - {self.carrier_filename} - {self.timestamp}"
    
