from ..database import db


class SeasonalPricing(db.Model):
    __tablename__ = 'seasonal_pricing'

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey(
        'properties.id'), nullable=False)
    season = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
