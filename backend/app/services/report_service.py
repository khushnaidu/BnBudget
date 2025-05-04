from app.database import db
from app.models.owner import Owner
from app.models.property import Property
from app.models.booking import Booking
from app.models.expense import Expense
from app.models.seasonal_pricing import SeasonalPricing
from app.models.monthly_summary import MonthlySummary
from collections import defaultdict


def serialize_seasonal(s):
    return {
        "season": s.season,
        "start_date": s.start_date.isoformat(),
        "end_date": s.end_date.isoformat(),
        "rate_multiplier": s.rate_multiplier
    }


def serialize_summary(summary):
    return {
        "month": summary.month,
        "year": summary.year,
        "bookings": summary.bookings,
        "nights_booked": summary.nights_booked,
        "occupancy_percent": summary.occupancy_percent,
        "rental_income": summary.rental_income,
        "cleaning_fees": summary.cleaning_fees,
        "service_fees": summary.service_fees,
        "tax_collected": summary.tax_collected,
        "total_revenue": summary.total_revenue,
        "expenses": summary.expenses,
        "net_income": summary.net_income
    }


class ReportService:

    @staticmethod
    def get_properties(owner_id=None):
        query = Property.query
        if owner_id:
            query = query.filter_by(owner_id=owner_id)
        properties = query.all()
        return [
            {
                "property_id": p.id,
                "name": p.name,
                "location": p.location,
                "bedrooms": p.bedrooms,
                "bathrooms": p.bathrooms,
                "max_guests": p.max_guests,
                "base_nightly_rate": p.base_nightly_rate,
                "owner_id": p.owner_id
            }
            for p in properties
        ]

    @staticmethod
    def get_bookings(owner_id=None):
        query = Booking.query.join(Property)
        if owner_id:
            query = query.filter(Property.owner_id == owner_id)
        bookings = query.all()

        grouped = defaultdict(list)
        for b in bookings:
            grouped[b.property_id].append({
                "guest_name": b.guest_name,
                "check_in": b.check_in.isoformat(),
                "check_out": b.check_out.isoformat(),
                "total": b.total,
                "status": b.status
            })

        return dict(grouped)

    @staticmethod
    def get_expenses(owner_id=None):
        query = Expense.query.join(Property)
        if owner_id:
            query = query.filter(Property.owner_id == owner_id)
        expenses = query.all()

        grouped = defaultdict(list)
        for e in expenses:
            grouped[e.property_id].append({
                "date": e.expense_date.isoformat(),
                "category": e.category,
                "amount": e.amount,
                "vendor": e.vendor
            })

        return dict(grouped)

    @staticmethod
    def get_monthly_summary(owner_id=None):
        query = MonthlySummary.query.join(Property)
        if owner_id:
            query = query.filter(Property.owner_id == owner_id)
        summaries = query.all()

        grouped = defaultdict(list)
        for s in summaries:
            grouped[s.property_id].append({
                "month": s.month,
                "year": s.year,
                "income": s.rental_income,
                "expenses": s.expenses,
                "net_income": s.net_income
            })

        return dict(grouped)

    @staticmethod
    def get_profit_loss(owner_id=None):
        query = MonthlySummary.query.join(Property)
        if owner_id:
            query = query.filter(Property.owner_id == owner_id)
        summaries = query.all()

        grouped = defaultdict(
            lambda: {"income": 0, "expenses": 0, "profit": 0})
        for s in summaries:
            grouped[s.property_id]["income"] += s.rental_income
            grouped[s.property_id]["expenses"] += s.expenses
            grouped[s.property_id]["profit"] += s.rental_income - s.expenses

        return [
            {
                "property_id": pid,
                "income": round(data["income"], 2),
                "expenses": round(data["expenses"], 2),
                "profit": round(data["profit"], 2)
            }
            for pid, data in grouped.items()
        ]

    @staticmethod
    def get_occupancy_rate(owner_id=None):
        query = MonthlySummary.query.join(Property)
        if owner_id:
            query = query.filter(Property.owner_id == owner_id)
        summaries = query.all()

        grouped = defaultdict(list)
        for s in summaries:
            grouped[s.property_id].append(s.occupancy_percent)

        return {
            pid: round(sum(values) / len(values), 2) if values else 0.0
            for pid, values in grouped.items()
        }

    @staticmethod
    def get_property_details(property_id):
        property = Property.query.get_or_404(property_id)

        seasonal = SeasonalPricing.query.filter_by(
            property_id=property_id).all()
        bookings = Booking.query.filter_by(
            property_id=property_id).order_by(Booking.check_out.desc()).all()
        summary = MonthlySummary.query.filter_by(property_id=property_id).order_by(
            MonthlySummary.year.desc(), MonthlySummary.month.desc()).first()

        recent_status = bookings[0].status if bookings else "No recent bookings"

        return {
            "property": property.serialize(),
            "seasonal_pricing": [serialize_seasonal(s) for s in seasonal],
            "recent_status": recent_status,
            "latest_summary": serialize_summary(summary) if summary else None
        }

    @staticmethod
    def get_monthly_summary_by_property(property_id):
        summaries = MonthlySummary.query.filter_by(property_id=property_id).order_by(
            MonthlySummary.year.desc(), MonthlySummary.month.desc()
        ).all()

        return [
            {
                "month": s.month,
                "year": s.year,
                "bookings": s.bookings,
                "nights_booked": s.nights_booked,
                "occupancy_percent": s.occupancy_percent,
                "rental_income": s.rental_income,
                "cleaning_fees": s.cleaning_fees,
                "service_fees": s.service_fees,
                "tax_collected": s.tax_collected,
                "total_revenue": s.total_revenue,
                "expenses": s.expenses,
                "net_income": s.net_income
            }
            for s in summaries
        ]
