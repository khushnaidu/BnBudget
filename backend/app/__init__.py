# backend/app/__init__.py

# Import Flask, configuration, and database instance
from flask import Flask
from .config import Config  # Configuration class with environment variables and database URI
from .database import db    # SQLAlchemy database instance

def create_app():
    """
    Factory function to create and configure the Flask application.
    This modular pattern allows for flexibility in testing, scaling, and maintaining separate environments.
    """
    app = Flask(__name__)                  # Create Flask app instance
    app.config.from_object(Config)         # Load configurations from config.py (e.g., database URI)

    db.init_app(app)                       # Bind the database instance to the app context

    # Import and register the route blueprint (can contain multiple route modules)
    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)  # Register the main blueprint with the app

    return app                             # Return the configured app instance for use by Flask CLI or Gunicorn
    