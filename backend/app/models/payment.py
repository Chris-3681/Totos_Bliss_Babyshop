from app import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"))

    method = db.Column(db.String(50))  # mpesa / bank
    transaction_code = db.Column(db.String(100))

    amount = db.Column(db.Float)
    status = db.Column(db.String(50), default="pending")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)