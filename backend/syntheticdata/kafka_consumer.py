import json
import logging
import sys
import os
from datetime import datetime
from kafka import KafkaConsumer
from sqlalchemy.orm import sessionmaker
from sqlalchemy import exists
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.expense import Expense
from app.models.booking import Booking
from app.models.property import Property
from app.database import db
from app import create_app

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
EXPENSE_TOPIC = 'expenses'
BOOKING_TOPIC = 'bookings'

# Get the Flask app instance
app = create_app()

class KafkaDataConsumer:
    def __init__(self):
        # Initialize Kafka consumer
        self.consumer = KafkaConsumer(
            EXPENSE_TOPIC,
            BOOKING_TOPIC,
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_deserializer=lambda x: json.loads(x.decode('utf-8')),
            auto_offset_reset='earliest',
            group_id='bnb_budget_group'
        )
        
        # Initialize database session within app context
        with app.app_context():
            self.Session = sessionmaker(bind=db.engine)
            self.session = self.Session()

    def property_exists(self, property_id):
        """Check if a property exists in the database."""
        with app.app_context():
            return self.session.query(exists().where(Property.id == property_id)).scalar()

    def process_expense(self, expense_data):
        """Process and store expense data."""
        try:
            with app.app_context():
                # Check if property exists
                if not self.property_exists(expense_data['property_id']):
                    logger.warning(f"⚠️ Skipping expense: Property ID {expense_data['property_id']} does not exist")
                    return

                # Convert string date to datetime
                expense_date = datetime.fromisoformat(expense_data['expense_date'])
                
                # Create new expense record
                expense = Expense(
                    property_id=expense_data['property_id'],
                    expense_date=expense_date,
                    category=expense_data['category'],
                    description=expense_data['description'],
                    amount=expense_data['amount'],
                    receipt_available=expense_data['receipt_available'],
                    vendor=expense_data['vendor']
                )
                
                # Add to database
                self.session.add(expense)
                self.session.commit()
                
                logger.info(f"✅ Processed expense: {expense_data['description']} for property {expense_data['property_id']}")
                
        except Exception as e:
            self.session.rollback()
            logger.error(f"❌ Error processing expense: {str(e)}")

    def process_booking(self, booking_data):
        """Process and store booking data."""
        try:
            with app.app_context():
                # Check if property exists
                if not self.property_exists(booking_data['property_id']):
                    logger.warning(f"⚠️ Skipping booking: Property ID {booking_data['property_id']} does not exist")
                    return

                # Convert string dates to datetime
                check_in = datetime.fromisoformat(booking_data['check_in'])
                check_out = datetime.fromisoformat(booking_data['check_out'])
                booking_date = datetime.fromisoformat(booking_data['booking_date'])
                
                # Create new booking record
                booking = Booking(
                    property_id=booking_data['property_id'],
                    guest_name=booking_data['guest_name'],
                    check_in=check_in,
                    check_out=check_out,
                    nights=booking_data['nights'],
                    guests=booking_data['guests'],
                    season=booking_data['season'],
                    subtotal=booking_data['subtotal'],
                    cleaning_fee=booking_data['cleaning_fee'],
                    service_fee=booking_data['service_fee'],
                    tax=booking_data['tax'],
                    total=booking_data['total'],
                    booking_date=booking_date,
                    status=booking_data['status']
                )
                
                # Add cancellation details if present
                if booking_data.get('cancellation_date'):
                    booking.cancellation_date = datetime.fromisoformat(booking_data['cancellation_date'])
                    booking.refund_amount = booking_data['refund_amount']
                
                # Add to database
                self.session.add(booking)
                self.session.commit()
                
                logger.info(f"✅ Processed booking: {booking_data['guest_name']} for property {booking_data['property_id']}")
                
        except Exception as e:
            self.session.rollback()
            logger.error(f"❌ Error processing booking: {str(e)}")

    def start_consuming(self):
        """Start consuming messages from Kafka topics."""
        logger.info("🚀 Starting to consume messages...")
        
        try:
            for message in self.consumer:
                topic = message.topic
                data = message.value
                
                if topic == EXPENSE_TOPIC:
                    self.process_expense(data)
                elif topic == BOOKING_TOPIC:
                    self.process_booking(data)
                
        except KeyboardInterrupt:
            logger.info("🛑 Stopping consumer...")
        finally:
            self.consumer.close()
            self.session.close()

if __name__ == "__main__":
    consumer = KafkaDataConsumer()
    consumer.start_consuming() 