# backend/app/routes/report_api.py

from flask import Blueprint, request, jsonify
from app.services.report_service import ReportService

report_api = Blueprint('report_api', __name__)


@report_api.route('/api/properties', methods=['GET'])
def get_properties():
    owner_id = request.args.get('owner_id', type=int)
    return jsonify(ReportService.get_properties(owner_id))


@report_api.route('/api/bookings', methods=['GET'])
def get_bookings():
    owner_id = request.args.get('owner_id', type=int)
    return jsonify(ReportService.get_bookings(owner_id))


@report_api.route('/api/expenses', methods=['GET'])
def get_expenses():
    owner_id = request.args.get('owner_id', type=int)
    return jsonify(ReportService.get_expenses(owner_id))


@report_api.route('/api/monthly_summary', methods=['GET'])
def get_monthly_summary():
    owner_id = request.args.get('owner_id', type=int)
    return jsonify(ReportService.get_monthly_summary(owner_id))


@report_api.route('/api/profit_loss_report', methods=['GET'])
def get_profit_loss():
    owner_id = request.args.get('owner_id', type=int)
    return jsonify(ReportService.get_profit_loss(owner_id))


@report_api.route('/api/occupancy_rate', methods=['GET'])
def get_occupancy_rate():
    owner_id = request.args.get('owner_id', type=int)
    return jsonify(ReportService.get_occupancy_rate(owner_id))
