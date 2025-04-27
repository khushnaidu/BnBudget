from ..database import db


class Expense(db.Model):
    __tablename__ = 'expenses'

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey(
        'properties.id'), nullable=False)
    expense_date = db.Column(db.Date, nullable=False)
    expense_type = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    notes = db.Column(db.Text)
