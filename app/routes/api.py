# backend/app/routes/api.py

from flask import Blueprint, request, jsonify
from app.services.upload_service import UploadService

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
