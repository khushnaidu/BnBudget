import json
import random
from datetime import datetime, timedelta
from faker import Faker
from kafka import KafkaProducer
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Faker
fake = Faker()

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
EXPENSE_TOPIC = 'expenses'
BOOKING_TOPIC = 'bookings'

# Initialize Kafka producer
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Property and Owner configuration
OWNERS = list(range(1, 6))  # Owners 1-5
PROPERTIES_PER_OWNER = 4
PROPERTY_IDS = list(range(1001, 1021))  # Properties 1001-1020

# Expense categories and their typical amounts
EXPENSE_CATEGORIES = {
    'Cleaning': (50, 200),
    'Maintenance': (100, 500),
    'Utilities': (50, 300),
    'Supplies': (20, 150),
    'Repairs': (100, 1000),
    'Insurance': (100, 300),
    'Property Management': (100, 400),
    'Marketing': (50, 200),
    'Taxes': (200, 1000),
    'Miscellaneous': (20, 100)
}

# Booking statuses and their probabilities
BOOKING_STATUSES = {
    'confirmed': 0.7,
    'cancelled': 0.2,
    'pending': 0.1
}

def get_property_owner(property_id):
    """Get the owner ID for a given property ID."""
    return ((property_id - 1001) // PROPERTIES_PER_OWNER) + 1

def generate_expense(property_id):
    """Generate a synthetic expense record."""
    category = random.choice(list(EXPENSE_CATEGORIES.keys()))
    min_amount, max_amount = EXPENSE_CATEGORIES[category]
    
    return {
        'property_id': property_id,
        'owner_id': get_property_owner(property_id),
        'expense_date': fake.date_between(start_date='-30d', end_date='today').isoformat(),
        'category': category,
        'description': fake.sentence(),
        'amount': round(random.uniform(min_amount, max_amount), 2),
        'receipt_available': random.choice(['Yes', 'No']),
        'vendor': fake.company()
    }

def generate_booking(property_id):
    """Generate a synthetic booking record."""
    check_in = fake.date_between(start_date='-30d', end_date='+60d')
    nights = random.randint(1, 14)
    check_out = check_in + timedelta(days=nights)
    guests = random.randint(1, 8)
    
    # Calculate fees
    subtotal = round(random.uniform(100, 500) * nights, 2)
    cleaning_fee = round(random.uniform(50, 200), 2)
    service_fee = round(subtotal * 0.12, 2)  # 12% service fee
    tax = round((subtotal + cleaning_fee + service_fee) * 0.08, 2)  # 8% tax
    total = round(subtotal + cleaning_fee + service_fee + tax, 2)
    
    status = random.choices(
        list(BOOKING_STATUSES.keys()),
        weights=list(BOOKING_STATUSES.values())
    )[0]
    
    booking = {
        'property_id': property_id,
        'owner_id': get_property_owner(property_id),
        'guest_name': fake.name(),
        'check_in': check_in.isoformat(),
        'check_out': check_out.isoformat(),
        'nights': nights,
        'guests': guests,
        'season': random.choice(['Low', 'High', 'Peak']),
        'subtotal': subtotal,
        'cleaning_fee': cleaning_fee,
        'service_fee': service_fee,
        'tax': tax,
        'total': total,
        'booking_date': fake.date_between(start_date='-60d', end_date='today').isoformat(),
        'status': status
    }
    
    # Add cancellation details if status is cancelled
    if status == 'cancelled':
        booking['cancellation_date'] = fake.date_between(
            start_date=check_in,
            end_date=check_out
        ).isoformat()
        booking['refund_amount'] = round(total * random.uniform(0, 1), 2)
    
    return booking

def stream_data(interval=5):
    """Stream synthetic data to Kafka topics."""
    try:
        while True:
            # Generate data for each property
            for property_id in PROPERTY_IDS:
                # Generate and send expense
                expense = generate_expense(property_id)
                producer.send(EXPENSE_TOPIC, value=expense)
                logger.info(f"Sent expense for property {property_id} (owner {expense['owner_id']}): {expense['description']}")
                
                # Generate and send booking
                booking = generate_booking(property_id)
                producer.send(BOOKING_TOPIC, value=booking)
                logger.info(f"Sent booking for property {property_id} (owner {booking['owner_id']}): {booking['guest_name']}")
                
                # Flush to ensure messages are sent
                producer.flush()
                
            logger.info(f"Waiting {interval} seconds before next batch...")
            time.sleep(interval)
            
    except KeyboardInterrupt:
        logger.info("Stopping data generation...")
    finally:
        producer.close()

if __name__ == "__main__":
    logger.info("Starting synthetic data generation...")
    stream_data() 