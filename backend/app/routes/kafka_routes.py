from flask import Blueprint, request, jsonify
from kafka import KafkaProducer
import json

kafka_bp = Blueprint('kafka_bp', __name__)

# Initialize Kafka producer
producer = KafkaProducer(
    bootstrap_servers='kafka:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def send_to_kafka(topic, data):
    producer.send(topic, value=data)
    producer.flush()
    return {"status": "sent", "topic": topic, "data": data}

@kafka_bp.route('/api/kafka/expenses', methods=['POST'])
def produce_expense():
    data = request.get_json()
    return jsonify(send_to_kafka("bnbudget-expenses", data)), 200

@kafka_bp.route('/api/kafka/properties', methods=['POST'])
def produce_property():
    data = request.get_json()
    return jsonify(send_to_kafka("bnbudget-properties", data)), 200

@kafka_bp.route('/api/kafka/bookings', methods=['POST'])
def produce_booking():
    data = request.get_json()
    return jsonify(send_to_kafka("bnbudget-bookings", data)), 200

# Optional: for users topic
@kafka_bp.route('/api/kafka/users', methods=['POST'])
def produce_user():
    data = request.get_json()
    return jsonify(send_to_kafka("bnbudget-users", data)), 200
