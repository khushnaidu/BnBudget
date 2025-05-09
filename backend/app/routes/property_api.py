from flask import Blueprint, request, jsonify
from app.models.owner import Owner
from app.models.property import Property
from app.models.booking import Booking
from app.models.expense import Expense
from app.models.monthly_summary import MonthlySummary
from app.database import db
from sqlalchemy import func, extract
from datetime import datetime

property_api = Blueprint('property_api', __name__)

# GET all properties for the logged-in owner


@property_api.route('/properties', methods=['GET'])
def get_properties():
    email = request.args.get("email")
    owner = Owner.query.filter_by(email=email).first()
    if not owner:
        return jsonify({"error": "Owner not found"}), 404
    properties = Property.query.filter_by(owner_id=owner.id).all()
    return jsonify([p.serialize() for p in properties])

# POST new property


@property_api.route('/properties', methods=['POST'])
def create_property():
    data = request.get_json()
    email = data.get("email")
    owner = Owner.query.filter_by(email=email).first()
    if not owner:
        return jsonify({"error": "Owner not found"}), 404

    new_property = Property(
        name=data.get("propertyName"),
        location=data.get("location"),
        bedrooms=data.get("bedrooms"),
        bathrooms=data.get("bathrooms"),
        max_guests=data.get("maxGuests"),
        base_nightly_rate=data.get("baseNightlyRate"),
        peak_season_rate=data.get("peakSeasonRate"),
        off_season_rate=data.get("offSeasonRate"),
        cleaning_fee=data.get("cleaningFee"),
        service_fee_percent=data.get("serviceFeePercent"),
        tax_rate_percent=data.get("taxRatePercent"),
        owner_id=owner.id
    )

    db.session.add(new_property)
    db.session.commit()
    return jsonify(new_property.serialize()), 201

# PUT update select fields on a property


@property_api.route('/properties/<int:id>', methods=['PUT'])
def update_property(id):
    data = request.get_json()
    property = Property.query.get_or_404(id)

    allowed_fields = [
        "base_nightly_rate", "peak_season_rate", "off_season_rate",
        "cleaning_fee", "service_fee_percent", "tax_rate_percent"
    ]

    for field in allowed_fields:
        if field in data:
            setattr(property, field, data[field])

    db.session.commit()
    return jsonify(property.serialize())

# DELETE property


@property_api.route('/properties/<int:id>', methods=['DELETE'])
def delete_property(id):
    property = Property.query.get_or_404(id)
    db.session.delete(property)
    db.session.commit()
    return jsonify({"message": "Property deleted successfully"})

@property_api.route('/property/<int:property_id>/monthly_summary', methods=['GET'])
def get_monthly_summary(property_id):
    """Get monthly summary data for a property."""
    try:
        # Get all monthly summaries for the property
        summaries = MonthlySummary.query.filter_by(property_id=property_id).order_by(
            MonthlySummary.year.desc(),
            MonthlySummary.month.desc()
        ).all()
        
        if not summaries:
            return jsonify([])
            
        return jsonify([{
            'month': s.month,
            'year': s.year,
            'bookings': s.bookings,
            'nights_booked': s.nights_booked,
            'occupancy_percent': s.occupancy_percent,
            'rental_income': s.rental_income,
            'cleaning_fees': s.cleaning_fees,
            'service_fees': s.service_fees,
            'tax_collected': s.tax_collected,
            'total_revenue': s.total_revenue,
            'expenses': s.expenses,
            'net_income': s.net_income
        } for s in summaries])
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
