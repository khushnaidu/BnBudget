# backend/app/routes/__init__.py

from flask import Blueprint

# Create the main blueprint
main = Blueprint('main', __name__)


@main.route('/')
def index():
    """
    Default route to verify that the API is working.
    """
    return {"message": "Welcome to BnBudget API"}
