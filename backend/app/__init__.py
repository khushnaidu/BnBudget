from flask import Flask
from .config import Config          # Loads configuration settings from a separate config file
from .database import db            # Imports SQLAlchemy (or similar) database instance
def create_app():
    app = Flask(__name__)                       # Creates the Flask app
    app.config.from_object(Config)              # Loads config settings into the app
    db.init_app(app)                            # Initializes the database context with the app
    from .routes import main as main_blueprint  # Imports the blueprint from routes
    app.register_blueprint(main_blueprint)      # Registers it with the app
    return app
