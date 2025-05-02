from ..database import db


class SeasonalPricing(db.Model):
    __tablename__ = 'seasonal_pricing'

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    season = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    rate_multiplier = db.Column(db.Float, nullable=False)