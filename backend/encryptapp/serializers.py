# backend/encryptapp/serializers.py

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Allow login with 'username' field carrying the email (since you set username=email).
    This serializer simply delegates to TokenObtainPairSerializer but we override
    validate to allow email/login unify if you'd like.
    """

    username_field = User.USERNAME_FIELD  # usually 'username'

    def validate(self, attrs):
        # attrs usually contains 'username' and 'password'
        # We call authenticate() with username=attrs['username']
        username = attrs.get("username")
        password = attrs.get("password")

        if username is None or password is None:
            raise serializers.ValidationError("Must include username (email) and password.")

        # Use Django's authenticate (username==email because you stored email as username)
        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError("No active account found with the given credentials")

        data = super().validate(attrs)
        # Optionally add extra user info into response:
        data.update({"user": {"username": user.username, "email": user.email}})
        return data


# ALLOWED_EXTENSIONS = [
#     ".jpg", ".jpeg", ".png", ".gif", ".tiff", ".tif", ".bmp", ".svg", ".ai", ".psd", ".raw",
#     ".mp4", ".mov", ".avi", ".wmv", ".flv", ".mkv", ".webm",
#     ".mp3", ".wav", ".aac", ".flac", ".wma", ".ogg", ".alac",
#     ".docx", ".doc", ".pdf", ".txt", ".rtf", ".xlsx", ".xls", ".pptx", ".ppt", ".csv", ".odt",
#     ".c", ".cpp", ".java", ".py", ".html", ".htm", ".css", ".js", ".bat", ".sh",
#     ".exe", ".dll", ".msi", ".app",
#     ".zip", ".rar", ".7z", ".tar", ".gz", ".tgz",
#     ".xml", ".json", ".sql", ".db", ".sqlite",
#     ".dwg", ".dxf", ".obj"
# ]

# class EncryptSerializer(serializers.Serializer):
#     cover_image = serializers.ImageField()
#     files_to_encrypt = serializers.ListField(
#         child=serializers.FileField(),
#         max_length=2,
#         min_length=1,
#         allow_empty=False
#     )
#     encryption_key = serializers.CharField(max_length=50) # Assuming a max length

# class DecryptSerializer(serializers.Serializer):
#     stego_image = serializers.ImageField()
#     decryption_key = serializers.CharField(max_length=50) # Assuming a max length

