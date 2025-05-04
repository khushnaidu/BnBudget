# backend/app/__init__.py

from flask import Flask
from .config import Config
from .database import db
from flask_cors import CORS


def create_app():
    """
    Factory function to create and configure the Flask application.
    This modular pattern allows for flexibility in testing, scaling, and maintaining separate environments.
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize the database
    db.init_app(app)

    CORS(app, resources={r"/api/*": {"origins": "*"}},
         supports_credentials=True)

    # Import all models to register them with SQLAlchemy
    from app.models.property import Property
    from app.models.booking import Booking
    from app.models.expense import Expense
    from app.models.seasonal_pricing import SeasonalPricing
    from app.models.monthly_summary import MonthlySummary
    from app.models.owner import Owner

    # Import and register blueprints
    from app.routes import main as main_blueprint
    from app.routes.api import api as api_blueprint

    from app.routes.report_api import report_api as report_blueprint
    app.register_blueprint(report_blueprint)

    app.register_blueprint(main_blueprint)           # '/' root route
    # '/api/upload/...' routes
    app.register_blueprint(api_blueprint, url_prefix='/api')

    from app.routes.property_api import property_api
    app.register_blueprint(property_api, url_prefix="/api")

    return app
