# backend/app/services/upload_service.py

import pandas as pd
from app.database import db
from app.models.property import Property
from app.models.booking import Booking
from app.models.expense import Expense
from app.models.seasonal_pricing import SeasonalPricing
from app.models.monthly_summary import MonthlySummary


class UploadService:

    @staticmethod
    def _normalize_headers(df):
        df.columns = (
            df.columns
            .str.strip()
            .str.lower()
            .str.replace(' ', '_')
            .str.replace('%', 'percent')
            .str.replace('-', '_')
        )
        return df

    @staticmethod
    def upload_properties(file):
        df = pd.read_csv(file)
        df = UploadService._normalize_headers(df)

        for _, row in df.iterrows():
            property_obj = Property(
                name=row['property_name'],
                location=row['location'],
                size=str(row.get('bedrooms', '')) + 'BR/' +
                str(row.get('bathrooms', '')) + 'BA',
                # Owner treated as amenity for now, can adjust later
                amenities=row.get('owner')
            )
            db.session.add(property_obj)

        db.session.commit()
        return {"message": "Properties uploaded successfully"}

    @staticmethod
    def upload_bookings(file):
        df = pd.read_csv(file)
        df = UploadService._normalize_headers(df)

        for _, row in df.iterrows():
            booking_obj = Booking(
                property_id=row['property_id'],
                guest_name=row.get('guest_name'),
                check_in=pd.to_datetime(row['check_in']).date(),
                check_out=pd.to_datetime(row['check_out']).date(),
                total_price=row['total'],
                # Temporarily mapping 'season' as booking_source
                booking_source=row.get('season')
            )
            db.session.add(booking_obj)

        db.session.commit()
        return {"message": "Bookings uploaded successfully"}

    @staticmethod
    def upload_expenses(file):
        df = pd.read_csv(file)
        df = UploadService._normalize_headers(df)

        for _, row in df.iterrows():
            expense_obj = Expense(
                property_id=row['property_id'],
                expense_date=pd.to_datetime(row['date']).date(),
                expense_type=row['category'],
                amount=row['amount'],
                notes=row.get('description')
            )
            db.session.add(expense_obj)

        db.session.commit()
        return {"message": "Expenses uploaded successfully"}

    @staticmethod
    def upload_seasonal_pricing(file):
        df = pd.read_csv(file)
        df = UploadService._normalize_headers(df)

        for _, row in df.iterrows():
            pricing_obj = SeasonalPricing(
                property_id=row['property_id'],
                season=row['season'],
                # If needed adjust based on your model
                price=row['rate_multiplier'] * 100
            )
            db.session.add(pricing_obj)

        db.session.commit()
        return {"message": "Seasonal pricing uploaded successfully"}

    @staticmethod
    def upload_monthly_summary(file):
        df = pd.read_csv(file)
        df = UploadService._normalize_headers(df)

        for _, row in df.iterrows():
            summary_obj = MonthlySummary(
                property_id=row['property_id'],
                month=row['month'],
                year=2023,  # Hardcoding for now unless you add Year column
                income=row['rental_income'],
                expenses=row['expenses'],
                profit=row['net_income']
            )
            db.session.add(summary_obj)

        db.session.commit()
        return {"message": "Monthly summaries uploaded successfully"}
