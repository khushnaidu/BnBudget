from ..database import db


class Property(db.Model):
    __tablename__ = 'properties'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    bedrooms = db.Column(db.Integer)
    bathrooms = db.Column(db.Integer)
    max_guests = db.Column(db.Integer)
    base_nightly_rate = db.Column(db.Float)
    peak_season_rate = db.Column(db.Float)
    off_season_rate = db.Column(db.Float)
    cleaning_fee = db.Column(db.Float)
    service_fee_percent = db.Column(db.Float)
    tax_rate_percent = db.Column(db.Float)
    owner = db.Column(db.String(255))

    bookings = db.relationship('Booking', backref='property', lazy=True)
    expenses = db.relationship('Expense', backref='property', lazy=True)
    seasonal_pricings = db.relationship(
        'SeasonalPricing', backref='property', lazy=True)
    monthly_summaries = db.relationship(
        'MonthlySummary', backref='property', lazy=True)
