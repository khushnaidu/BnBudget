from app.models.expense import Expense
from app.database import db
from app.services.auth_service import authenticate_owner, register_owner
from app.models.owner import Owner
from flask import Blueprint, request, jsonify
from app.services.upload_service import UploadService
import jwt
import datetime

api = Blueprint('api', __name__)


@api.route('/upload/properties', methods=['POST'])
def upload_properties():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "CSV file is required"}), 400
    result = UploadService.upload_properties(file)
    return jsonify(result), 200


@api.route('/upload/bookings', methods=['POST'])
def upload_bookings():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "CSV file is required"}), 400
    result = UploadService.upload_bookings(file)
    return jsonify(result), 200


@api.route('/upload/expenses', methods=['POST'])
def upload_expenses():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "CSV file is required"}), 400
    result = UploadService.upload_expenses(file)
    return jsonify(result), 200


@api.route('/upload/seasonal_pricing', methods=['POST'])
def upload_seasonal_pricing():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "CSV file is required"}), 400
    result = UploadService.upload_seasonal_pricing(file)
    return jsonify(result), 200


@api.route('/upload/monthly_summary', methods=['POST'])
def upload_monthly_summary():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "CSV file is required"}), 400
    result = UploadService.upload_monthly_summary(file)
    return jsonify(result), 200


@api.route('/upload/owners', methods=['POST'])
def upload_owners():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "CSV file is required"}), 400
    result = UploadService.upload_owners(file)
    return jsonify(result), 200


@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    owner, error = register_owner(email, password)
    if error:
        return jsonify({'error': error}), 400

    return jsonify({'message': 'Registration successful'}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    owner = authenticate_owner(email, password)
    if not owner:
        return jsonify({'error': 'Invalid credentials'}), 401

    token = f"token-{owner.id}"
    return jsonify({
        'token': token,
        'user': {
            'id': owner.id,
            'email': owner.email,
            'name': owner.name,
            'role': 'host'
        }
    })


@api.route('/metabase-dashboard', methods=['POST'])
def generate_metabase_url():
    data = request.get_json()
    email = data.get("email")

    owner = Owner.query.filter_by(email=email).first()
    if not owner:
        return jsonify({"error": "Owner not found"}), 404

    METABASE_SITE_URL = "https://drafty-basin.metabaseapp.com"
    METABASE_SECRET_KEY = "9f5d479b1d243e0d40616e47eea5d100b5625abea49760db6a3b41abc534bd61"

    payload = {
        "resource": {"dashboard": 11},
        "params": {"owner_id": owner.id},
        "exp": round(datetime.datetime.utcnow().timestamp()) + (10 * 60)
    }

    token = jwt.encode(payload, METABASE_SECRET_KEY, algorithm="HS256")
    iframe_url = f"{METABASE_SITE_URL}/embed/dashboard/{token}?bordered=true&titled=true"

    return jsonify({"iframe_url": iframe_url})


@api.route('/owner-id', methods=['GET'])
def get_owner_id():
    email = request.args.get("email")
    owner = Owner.query.filter_by(email=email).first()
    if not owner:
        return jsonify({"error": "Owner not found"}), 404
    return jsonify({"owner_id": owner.id})

@api.route('/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    expense = Expense.query.get_or_404(id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": f"Expense {id} deleted"}), 200

