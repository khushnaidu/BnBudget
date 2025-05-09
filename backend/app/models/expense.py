from ..database import db


class Expense(db.Model):
    __tablename__ = 'expenses'

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey(
        'properties.id'), nullable=False)
    expense_date = db.Column(db.Date, nullable=False)
    category = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    amount = db.Column(db.Float, nullable=False)
    receipt_available = db.Column(db.String(10))  # Yes/No string
    vendor = db.Column(db.String(255))

    def serialize(self):
        return {
            "id": self.id,
            "propertyId": self.property_id,
            "expenseDate": self.expense_date.isoformat(),  # convert Date to string
            "category": self.category,
            "description": self.description,
            "amount": self.amount,
            "receiptAvailable": self.receipt_available,
            "vendor": self.vendor,
        }
