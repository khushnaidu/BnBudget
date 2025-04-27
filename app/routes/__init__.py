# backend/app/routes/__init__.py

from flask import Blueprint

# Create a Blueprint for route definitions
# This allows modularizing your app routes and registering them with the app in __init__.py
# You can later break this into multiple blueprints like auth, api, admin, etc.

main = Blueprint('main', __name__)  # 'main' is the name of this blueprint

@main.route('/')
def index():
    """
    Default route to verify that the API is working.
    Returns a simple welcome message.
    """
    return {"message": "Welcome to BnBudget API"}
