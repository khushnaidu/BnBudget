# run.py

# Entry point for running the Flask app
# This file is used in development. For production, use Gunicorn or uWSGI with this app instance.

from backend.app import create_app  # Import the Flask app factory from the app package

# Create a Flask application instance using the factory pattern
app = create_app()

# Only run the development server if this script is executed directly (not imported)
if __name__ == "__main__":
    app.run(debug=True)  # Start Flask development server with debug mode enabled
