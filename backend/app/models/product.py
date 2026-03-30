from app import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)

    price = db.Column(db.Float, nullable=False)
    vat_percentage = db.Column(db.Float, default=16)

    stock_quantity = db.Column(db.Integer, default=0)

    image_url = db.Column(db.String(500))

    stock = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)