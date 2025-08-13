from pathlib import Path
import os
import secrets
from dotenv import load_dotenv

# Paths
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
MEDIA_URL = '/Photos/'
MEDIA_ROOT = BASE_DIR / "Photos"

# Security
SECRET_KEY_FILE = BASE_DIR / 'secret_key.txt'

def get_or_create_secret_key():
    """Generate or retrieve a secure secret key."""
    try:
        if SECRET_KEY_FILE.exists():
            with open(SECRET_KEY_FILE, 'r') as f:
                key = f.read().strip()
                if len(key) >= 50:  # Ensure key is long enough
                    return key
        
        # Generate new secure key
        new_key = secrets.token_urlsafe(50)
        
        # Write key to file with proper permissions
        with open(SECRET_KEY_FILE, 'w') as f:
            f.write(new_key)
        
        # Set file permissions to be readable only by owner (Unix/Linux)
        try:
            os.chmod(SECRET_KEY_FILE, 0o600)
        except (AttributeError, OSError):
            pass  # Windows or permission error, continue anyway
            
        return new_key
        
    except (IOError, OSError) as e:
        # Fallback to environment variable or generated key
        env_key = os.environ.get('DJANGO_SECRET_KEY')
        if env_key:
            return env_key
        # Last resort - generate temporary key (not persisted)
        return secrets.token_urlsafe(50)

SECRET_KEY = get_or_create_secret_key()

DEBUG = True
ALLOWED_HOSTS = []

# Applications
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'EmployeeApp.apps.EmployeeappConfig'
]

CORS_ORIGIN_ALLOW_ALL = True

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URL Configuration
ROOT_URLCONF = 'DjangoAPI.urls'

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI
WSGI_APPLICATION = 'DjangoAPI.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password Validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static Files
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATIC_ROOT = BASE_DIR / "staticfiles"

# Default Primary Key Field Type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
