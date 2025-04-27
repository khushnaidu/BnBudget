from ..database import db


class Property(db.Model):
    __tablename__ = 'properties'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    size = db.Column(db.String(50))
    amenities = db.Column(db.Text)

    bookings = db.relationship('Booking', backref='property', lazy=True)
    expenses = db.relationship('Expense', backref='property', lazy=True)
    seasonal_pricings = db.relationship(
        'SeasonalPricing', backref='property', lazy=True)
    monthly_summaries = db.relationship(
        'MonthlySummary', backref='property', lazy=True)
