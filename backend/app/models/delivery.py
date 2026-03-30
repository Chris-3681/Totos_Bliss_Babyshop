from app import db

class Delivery(db.Model):
    __tablename__ = "deliveries"

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)

    address = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=False)

    status = db.Column(db.String(50), default="pending")  # pending, shipped, delivered