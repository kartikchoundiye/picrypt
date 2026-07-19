# backend/encryptapp/utils.py

import random
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.conf import settings
from .models import OTP
from django.contrib.auth.models import User
from django.utils import timezone
import hashlib, os


def generate_and_send_otp(email):
    # 1. Generate 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    
    # 2. Set Expiry Time (e.g., 5 minutes)
    expires_at = timezone.now() + timedelta(minutes=10)
    
    try:
        # 3. Create or Update OTP record (using the email field)
        otp_obj, created = OTP.objects.update_or_create(
            email=email,
            defaults={'otp_code': otp_code, 'expires_at': expires_at}
        )
        
        # 4. Send Email
        subject = 'PICRYPT: Your Email Verification Code'
        message = f'Your One-Time Password (OTP) for PICRYPT registration is: {otp_code}. This code is valid for 10 minutes.'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email]
        
        send_mail(subject, message, email_from, recipient_list)
        
        return True
    
    except Exception as e:
        print(f"Error sending email/saving OTP: {e}")
        return False
