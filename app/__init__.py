# backend/app/__init__.py

# Import Flask, configuration, and database instance
from flask import Flask
# Configuration class with environment variables and database URI
from .config import Config
from .database import db    # SQLAlchemy database instance


def create_app():
    """
    Factory function to create and configure the Flask application.
    This modular pattern allows for flexibility in testing, scaling, and maintaining separate environments.
    """
    app = Flask(__name__)                  # Create Flask app instance
    # Load configurations from config.py (e.g., database URI)
    app.config.from_object(Config)

    db.init_app(app)

    from app.models.property import Property
    from app.models.booking import Booking
    from app.models.expense import Expense
    from app.models.seasonal_pricing import SeasonalPricing
    from app.models.monthly_summary import MonthlySummary

    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app

    # Import and register the route blueprint (can contain multiple route modules)
    from .routes import main as main_blueprint
    # Register the main blueprint with the app
    app.register_blueprint(main_blueprint)

    # Return the configured app instance for use by Flask CLI or Gunicorn
    return app
