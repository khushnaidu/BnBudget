# backend/app/models/__init__.py

from ..database import db

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_name = db.Column(db.String(100))
    check_in = db.Column(db.Date)
    check_out = db.Column(db.Date)
    price = db.Column(db.Float)
