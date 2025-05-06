from ..database import db


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey(
        'properties.id'), nullable=False)
    guest_name = db.Column(db.String(255))
    check_in = db.Column(db.Date, nullable=False)
    check_out = db.Column(db.Date, nullable=False)
    nights = db.Column(db.Integer)
    guests = db.Column(db.Integer)
    season = db.Column(db.String(50))
    subtotal = db.Column(db.Float)
    cleaning_fee = db.Column(db.Float)
    service_fee = db.Column(db.Float)
    tax = db.Column(db.Float)
    total = db.Column(db.Float)
    booking_date = db.Column(db.Date)
    status = db.Column(db.String(50))
    cancellation_date = db.Column(db.Date, nullable=True)
    refund_amount = db.Column(db.Float, nullable=True)
