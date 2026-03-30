from flask import Blueprint, request, jsonify
from app import db
from app.models.product import Product
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User

product_bp = Blueprint("products", __name__, url_prefix="/api/products")


# 🔓 Public - get all products
@product_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()

    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "stock": p.stock,
            "image": p.image_url
        } for p in products
    ])


# 🔒 Admin only - create product
@product_bp.route("/", methods=["POST"])
@jwt_required()
def create_product():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    product = Product(
        name=data["name"],
        description=data.get("description"),
        price=data["price"],
        stock=data.get("stock", 0),
        image_url=data.get("image_url")
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({"message": "Product created"}), 201