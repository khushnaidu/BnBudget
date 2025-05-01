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
                id=row['property_id'],
                name=row['property_name'],
                location=row['location'],
                bedrooms=row['bedrooms'],
                bathrooms=row['bathrooms'],
                max_guests=row['max_guests'],
                base_nightly_rate=row['base_nightly_rate'],
                peak_season_rate=row['peak_season_rate'],
                off_season_rate=row['off_season_rate'],
                cleaning_fee=row['cleaning_fee'],
                service_fee_percent=row['service_fee_percent'],
                tax_rate_percent=row['tax_rate_percent'],
                owner=row['owner']
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
                id=row['booking_id'],
                property_id=row['property_id'],
                guest_name=row.get('guest_name'),
                check_in=pd.to_datetime(row['check_in']).date(),
                check_out=pd.to_datetime(row['check_out']).date(),
                nights=row.get('nights'),
                guests=row.get('guests'),
                season=row.get('season'),
                subtotal=row.get('subtotal'),
                cleaning_fee=row.get('cleaning_fee'),
                service_fee=row.get('service_fee'),
                tax=row.get('tax'),
                total=row.get('total'),
                booking_date=pd.to_datetime(row['booking_date']).date(
                ) if pd.notna(row.get('booking_date')) else None,
                status=row.get('status'),
                cancellation_date=pd.to_datetime(row['cancellation_date']).date(
                ) if pd.notna(row.get('cancellation_date')) else None,
                refund_amount=row.get('refund_amount')
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
                id=row['expense_id'],
                property_id=row['property_id'],
                expense_date=pd.to_datetime(row['date']).date(),
                category=row['category'],
                description=row['description'],
                amount=row['amount'],
                receipt_available=row['receipt_available'],
                vendor=row['vendor']
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
                start_date=pd.to_datetime(row['start_date']).date(),
                end_date=pd.to_datetime(row['end_date']).date(),
                rate_multiplier=row['rate_multiplier']
            )
            db.session.add(pricing_obj)

        db.session.commit()
        return {"message": "Seasonal pricing uploaded successfully"}

    @staticmethod
    def upload_monthly_summary(file):
        df = pd.read_csv(file)
        df = UploadService._normalize_headers(df)

        for _, row in df.iterrows():
            # Extract month and year from 'month' column
            month_year = row['month']
            month_str, year_str = month_year.split()
            month_num = pd.to_datetime(month_str, format='%B').month
            year_num = int(year_str)

            # Clean occupancy % field (convert '30%' -> 30.0)
            occupancy = float(
                str(row['occupancy_percent']).replace('%', '').strip())

            summary_obj = MonthlySummary(
                property_id=row['property_id'],
                month=month_num,
                year=year_num,
                bookings=row['bookings'],
                nights_booked=row['nights_booked'],
                occupancy_percent=occupancy,
                rental_income=row['rental_income'],
                cleaning_fees=row['cleaning_fees'],
                service_fees=row['service_fees'],
                tax_collected=row['tax_collected'],
                total_revenue=row['total_revenue'],
                expenses=row['expenses'],
                net_income=row['net_income']
            )
            db.session.add(summary_obj)

        db.session.commit()
        return {"message": "Monthly summaries uploaded successfully"}
