import json
from app import create_app
from app.database import db


def setup_test_client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
    return app.test_client(), app


def test_create_expense():
    client, _ = setup_test_client()

    payload = {
        "propertyId": 1001,
        "expenseDate": "2025-05-06",
        "category": "Test",
        "amount": 100,
        "vendor": "Test Vendor",
        "receiptAvailable": "No"
    }

    response = client.post(
        '/api/expenses', data=json.dumps(payload), content_type='application/json')
    assert response.status_code == 201
    data = response.get_json()
    assert data['category'] == "Test"
    assert data['amount'] == 100


def test_delete_expense():
    client, _ = setup_test_client()

    # Create first
    payload = {
        "propertyId": 1001,
        "expenseDate": "2025-05-06",
        "category": "DeleteMe",
        "amount": 99,
        "receiptAvailable": "No"
    }
    post = client.post('/api/expenses', data=json.dumps(payload),
                       content_type='application/json')
    expense_id = post.get_json()['id']

    # Delete
    delete = client.delete(f'/api/expenses/{expense_id}')
    assert delete.status_code == 200


def test_get_bookings():
    client, _ = setup_test_client()
    response = client.get('/api/bookings?owner_id=1')
    assert response.status_code in [200, 404]
