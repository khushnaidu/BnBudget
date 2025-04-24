# backend/app/database.py

from flask_sqlalchemy import SQLAlchemy

# Create a SQLAlchemy database instance
# This instance will be initialized with the Flask app in app/__init__.py using db.init_app(app)
# Using this approach allows you to avoid circular imports and use the db object across your models

db = SQLAlchemy()