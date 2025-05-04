# create_db.py

from app import create_app
from app.database import db
from app.models.owner import Owner


def initialize_database():
    app = create_app()
    with app.app_context():
        print(f"📋 Tables detected by SQLAlchemy: {db.metadata.tables.keys()}")
        db.create_all()
        print("✅ All tables created successfully in the RDS database.")


def patch_owners_with_password():
    with create_app().app_context():
        owners = Owner.query.all()
        for owner in owners:
            if not owner.password_hash:
                # default password for dev/test
                owner.set_password("default123")
        db.session.commit()


if __name__ == "__main__":
    initialize_database()
    patch_owners_with_password()
