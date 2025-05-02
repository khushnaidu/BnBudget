# create_db.py

from app import create_app
from app.database import db


def initialize_database():
    app = create_app()
    with app.app_context():
        print(f"📋 Tables detected by SQLAlchemy: {db.metadata.tables.keys()}")
        db.create_all()
        print("✅ All tables created successfully in the RDS database.")


if __name__ == "__main__":
    initialize_database()
