from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from app import db
from app.models.order import Order
from app.models.cart import Cart, CartItem
from app.models.user import User

order_bp = Blueprint("orders", __name__, url_prefix="/api/orders")


@order_bp.route("/create", methods=["POST"])
@jwt_required()
def create_order():
    user_id = int(get_jwt_identity())

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({"error": "Cart not found"}), 404

    items = CartItem.query.filter_by(cart_id=cart.id).all()

    if not items:
        return jsonify({"error": "Cart is empty"}), 400

    total = 0

    for item in items:
        total += item.quantity * item.price_at_time

    order = Order(
        user_id=user_id,
        total_amount=total,
        status="pending",
        created_at=datetime.utcnow()
    )

    db.session.add(order)
    db.session.commit()

    CartItem.query.filter_by(cart_id=cart.id).delete()
    db.session.commit()

    return jsonify({
        "message": "Order created",
        "order_id": order.id,
        "total": total
    }), 201


@order_bp.route("/admin", methods=["GET"])
@jwt_required()
def get_all_orders():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    orders = Order.query.order_by(Order.id.desc()).all()

    return jsonify([
        {
            "id": order.id,
            "user_id": order.user_id,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at.isoformat() if order.created_at else None
        }
        for order in orders
    ]), 200


@order_bp.route("/admin/<int:order_id>/status", methods=["PUT"])
@jwt_required()
def update_order_status(order_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404

    data = request.get_json()
    status = data.get("status")

    allowed_statuses = ["pending", "processing", "dispatched", "delivered", "paid"]

    if status not in allowed_statuses:
        return jsonify({"error": "Invalid status"}), 400

    order.status = status
    db.session.commit()

    return jsonify({"message": "Order status updated"}), 200