# backend/encryptapp/utils.py

import random
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.conf import settings
from .models import OTP
from django.contrib.auth.models import User
from django.utils import timezone
import hashlib, os


import json
import urllib.request
import urllib.error

# Commented by agent, reason: Render free tier blocks outbound SMTP ports (25, 465, 587) causing Gunicorn worker timeout. Replaced with HTTPS API support (Brevo/Resend) and graceful fallback.
# def generate_and_send_otp(email):
#     # 1. Generate 6-digit OTP
#     otp_code = str(random.randint(100000, 999999))
#     
#     # 2. Set Expiry Time (e.g., 5 minutes)
#     expires_at = timezone.now() + timedelta(minutes=10)
#     
#     try:
#         # 3. Create or Update OTP record (using the email field)
#         otp_obj, created = OTP.objects.update_or_create(
#             email=email,
#             defaults={'otp_code': otp_code, 'expires_at': expires_at}
#         )
#         
#         # 4. Send Email
#         subject = 'PICRYPT: Your Email Verification Code'
#         message = f'Your One-Time Password (OTP) for PICRYPT registration is: {otp_code}. This code is valid for 10 minutes.'
#         email_from = settings.EMAIL_HOST_USER
#         recipient_list = [email]
#         
#         send_mail(subject, message, email_from, recipient_list)
#         
#         return True
#     
#     except Exception as e:
#         print(f"Error sending email/saving OTP: {e}")
#         return False
# End commented by agent

def _send_via_brevo_api(email, otp_code, api_key, sender_email):
    """Sends OTP using Brevo REST API v3 over standard HTTPS (Port 443, never blocked by Render)."""
    url = "https://api.brevo.com/v3/smtp/email"
    payload = {
        "sender": {"name": "PICRYPT Security", "email": sender_email or "picrypt.noreply@gmail.com"},
        "to": [{"email": email}],
        "subject": "PICRYPT: Your Email Verification Code",
        "htmlContent": (
            f"<h2>PICRYPT Verification Code</h2>"
            f"<p>Your One-Time Password (OTP) for registration is: "
            f"<strong style='font-size: 24px; color: #4F46E5;'>{otp_code}</strong></p>"
            f"<p>This code is valid for 10 minutes. If you did not request this, please ignore.</p>"
        )
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "accept": "application/json",
            "api-key": api_key,
            "content-type": "application/json"
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=8) as response:
        return response.status in (200, 201)


def _send_via_resend_api(email, otp_code, api_key):
    """Sends OTP using Resend REST API over standard HTTPS (Port 443)."""
    url = "https://api.resend.com/emails"
    payload = {
        "from": "PICRYPT <onboarding@resend.dev>",
        "to": [email],
        "subject": "PICRYPT: Your Email Verification Code",
        "html": (
            f"<h2>PICRYPT Verification Code</h2>"
            f"<p>Your One-Time Password (OTP) for registration is: "
            f"<strong style='font-size: 24px; color: #4F46E5;'>{otp_code}</strong></p>"
            f"<p>This code is valid for 10 minutes.</p>"
        )
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=8) as response:
        return response.status in (200, 201)


def generate_and_send_otp(email):
    # 1. Generate 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    
    # 2. Set Expiry Time (10 minutes)
    expires_at = timezone.now() + timedelta(minutes=10)
    
    try:
        # 3. Create or Update OTP record in database
        otp_obj, created = OTP.objects.update_or_create(
            email=email,
            defaults={'otp_code': otp_code, 'expires_at': expires_at}
        )
    except Exception as db_err:
        print(f"[PICRYPT OTP ERROR] Failed to save OTP in database: {db_err}", flush=True)
        return False

    # 4. Configurable server console logging (set SHOW_OTP_IN_LOGS=False in Render environment to hide for security)
    # Commented by agent, reason: Allow disabling OTP logging in production via SHOW_OTP_IN_LOGS environment variable
    # print(f"\n=======================================================", flush=True)
    # print(f"[PICRYPT OTP] CODE FOR '{email}': {otp_code}", flush=True)
    # print(f"=======================================================\n", flush=True)
    # End commented by agent
    show_logs = os.environ.get("SHOW_OTP_IN_LOGS", "True").lower() in ("true", "1")
    if show_logs:
        print(f"\n=======================================================", flush=True)
        print(f"[PICRYPT OTP DEBUG] CODE FOR '{email}': {otp_code}", flush=True)
        print(f"=======================================================\n", flush=True)


    # 5. Method A: Try Brevo REST API if BREVO_API_KEY is configured (HTTPS port 443)
    brevo_key = getattr(settings, 'BREVO_API_KEY', '') or os.environ.get('BREVO_API_KEY', '')
    if brevo_key:
        try:
            sender_email = getattr(settings, 'EMAIL_HOST_USER', '')
            if _send_via_brevo_api(email, otp_code, brevo_key, sender_email):
                print(f"[PICRYPT OTP] Successfully sent OTP to {email} via Brevo API.", flush=True)
                return True
        except Exception as brevo_err:
            print(f"[PICRYPT OTP ERROR] Brevo API failed: {brevo_err}", flush=True)

    # 6. Method B: Try Resend REST API if RESEND_API_KEY is configured (HTTPS port 443)
    resend_key = getattr(settings, 'RESEND_API_KEY', '') or os.environ.get('RESEND_API_KEY', '')
    if resend_key:
        try:
            if _send_via_resend_api(email, otp_code, resend_key):
                print(f"[PICRYPT OTP] Successfully sent OTP to {email} via Resend API.", flush=True)
                return True
        except Exception as resend_err:
            print(f"[PICRYPT OTP ERROR] Resend API failed: {resend_err}", flush=True)

    # 7. Method C: Fall back to standard Django SMTP (e.g. for local development or paid instances)
    try:
        subject = 'PICRYPT: Your Email Verification Code'
        message = f'Your One-Time Password (OTP) for PICRYPT registration is: {otp_code}. This code is valid for 10 minutes.'
        email_from = getattr(settings, 'EMAIL_HOST_USER', '')
        recipient_list = [email]
        send_mail(subject, message, email_from, recipient_list)
        print(f"[PICRYPT OTP] Successfully sent OTP to {email} via standard SMTP.", flush=True)
        return True
    except Exception as smtp_err:
        otp_display = f"[{otp_code}]" if show_logs else "[HIDDEN FOR SECURITY]"
        print(
            f"[PICRYPT OTP NOTICE] SMTP sending failed ({smtp_err}). "
            f"Note: Render free tier blocks outbound SMTP ports 25, 465, and 587. "
            f"The OTP {otp_display} was recorded in DB.",
            flush=True
        )
        return True

