import json
import psycopg2
from kafka import KafkaConsumer

TOPICS = [
    "bnbudget-expenses",
    "bnbudget-properties",
    "bnbudget-bookings",
    # "bnbudget-users"  # Uncomment to enable user topic
]

KAFKA_BROKER = "kafka:9092"

DB_CONFIG = {
    "host": "postgres",
    "port": 5432,
    "database": "bnbudget_db",
    "user": "bnbudget_user",
    "password": "bnbudget_pass"
}

def insert_expense(data, cursor):
    query = """
        INSERT INTO expenses (property_id, date, amount, category)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (
        data['property_id'],
        data['date'],
        data['amount'],
        data['category']
    ))

def insert_property(data, cursor):
    query = """
        INSERT INTO properties (property_id, address, city, state, zip_code)
        VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query, (
        data['property_id'],
        data['address'],
        data['city'],
        data['state'],
        data['zip_code']
    ))

def insert_booking(data, cursor):
    query = """
        INSERT INTO bookings (property_id, guest_name, check_in, check_out, total_price)
        VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query, (
        data['property_id'],
        data['guest_name'],
        data['check_in'],
        data['check_out'],
        data['total_price']
    ))

# def insert_user(data, cursor):
#     query = """
#         INSERT INTO users (user_id, email, password_hash, role)
#         VALUES (%s, %s, %s, %s)
#     """
#     cursor.execute(query, (
#         data['user_id'],
#         data['email'],
#         data['password_hash'],
#         data['role']
#     ))

def start_kafka_consumer():
    consumer = KafkaConsumer(
        *TOPICS,
        bootstrap_servers=KAFKA_BROKER,
        auto_offset_reset='latest',
        enable_auto_commit=True,
        group_id='bnbudget-group',
        value_deserializer=lambda x: json.loads(x.decode('utf-8'))
    )

    print(f"[🟢] Listening on topics: {TOPICS}")
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()

    for msg in consumer:
        topic = msg.topic
        data = msg.value
        print(f"[➡] Topic: {topic}, Data: {data}")

        try:
            if topic == "bnbudget-expenses":
                insert_expense(data, cursor)
            elif topic == "bnbudget-properties":
                insert_property(data, cursor)
            elif topic == "bnbudget-bookings":
                insert_booking(data, cursor)
            # elif topic == "bnbudget-users":
            #     insert_user(data, cursor)

            conn.commit()
        except Exception as e:
            print(f"[❌] DB Error: {e}")
            conn.rollback()

    cursor.close()
    conn.close()

if __name__ == "__main__":
    start_kafka_consumer()
