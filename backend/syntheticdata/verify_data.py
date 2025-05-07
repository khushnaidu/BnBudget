import sys
import os
from datetime import datetime

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.models.property import Property
from app.models.booking import Booking
from app.models.expense import Expense
from app.models.owner import Owner

app = create_app()

def verify_data():
    with app.app_context():
        # Check properties
        properties = Property.query.all()
        print(f"\n📊 Properties in database: {len(properties)}")
        for prop in properties:
            print(f"Property {prop.id}: Owner {prop.owner_id}")

        # Check bookings
        bookings = Booking.query.all()
        print(f"\n📊 Bookings in database: {len(bookings)}")
        if bookings:
            latest_booking = max(bookings, key=lambda x: x.booking_date)
            print(f"Latest booking: {latest_booking.guest_name} for property {latest_booking.property_id}")

        # Check expenses
        expenses = Expense.query.all()
        print(f"\n📊 Expenses in database: {len(expenses)}")
        if expenses:
            latest_expense = max(expenses, key=lambda x: x.expense_date)
            print(f"Latest expense: {latest_expense.description} for property {latest_expense.property_id}")

        # Check owners
        owners = Owner.query.all()
        print(f"\n📊 Owners in database: {len(owners)}")
        for owner in owners:
            owner_properties = Property.query.filter_by(owner_id=owner.id).all()
            print(f"Owner {owner.id}: {len(owner_properties)} properties")

if __name__ == "__main__":
    verify_data() 