from ..database import db


class MonthlySummary(db.Model):
    __tablename__ = 'monthly_summary'

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey(
        'properties.id'), nullable=False)
    month = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    bookings = db.Column(db.Integer)
    nights_booked = db.Column(db.Integer)
    occupancy_percent = db.Column(db.Float)
    rental_income = db.Column(db.Float)
    cleaning_fees = db.Column(db.Float)
    service_fees = db.Column(db.Float)
    tax_collected = db.Column(db.Float)
    total_revenue = db.Column(db.Float)
    expenses = db.Column(db.Float)
    net_income = db.Column(db.Float)
