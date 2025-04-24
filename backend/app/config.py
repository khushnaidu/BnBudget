# backend/app/config.py

import os

class Config:
    """
    Configuration class for Flask application.
    Environment variables are loaded dynamically using os.getenv,
    allowing easy separation between development and production settings.
    """

    # Database URI: Replace with production values or use .env loader like python-dotenv in larger setups
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://username:password@localhost:5432/bnbudget")
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable modification tracking to save resources

    # Flask secret key for session and CSRF protection (required if using forms, login, etc.)
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")  # WARNING: Change this in production!
