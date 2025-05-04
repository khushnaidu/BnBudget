from app.models.owner import Owner
from app.database import db
from werkzeug.security import generate_password_hash, check_password_hash


def register_owner(email, password):
    if Owner.query.filter_by(email=email).first():
        return None, "Email already registered"

    new_owner = Owner(email=email)
    new_owner.set_password(password)
    db.session.add(new_owner)
    db.session.commit()
    return new_owner, None


def authenticate_owner(email, password):
    owner = Owner.query.filter_by(email=email).first()
    if owner and owner.check_password(password):
        return owner
    return None
