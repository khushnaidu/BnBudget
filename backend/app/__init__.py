# backend/app/__init__.py

from flask import Flask
from .config import Config
from .database import db


def create_app():
    """
    Factory function to create and configure the Flask application.
    This modular pattern allows for flexibility in testing, scaling, and maintaining separate environments.
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize the database
    db.init_app(app)

    # Import all models to register them with SQLAlchemy
    from app.models.property import Property
    from app.models.booking import Booking
    from app.models.expense import Expense
    from app.models.seasonal_pricing import SeasonalPricing
    from app.models.monthly_summary import MonthlySummary

    # Import and register blueprints
    from app.routes import main as main_blueprint
    from app.routes.api import api as api_blueprint

    app.register_blueprint(main_blueprint)           # '/' root route
    # '/api/upload/...' routes
    app.register_blueprint(api_blueprint, url_prefix='/api')

    return app
