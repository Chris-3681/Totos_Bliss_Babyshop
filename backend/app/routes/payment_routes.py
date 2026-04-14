from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.order import Order
from app.models.payment import Payment

payment_bp = Blueprint("payment", __name__, url_prefix="/api/payment")


@payment_bp.route("/pay", methods=["POST"])
@jwt_required()
def pay():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    order_id = data.get("order_id")
    method = data.get("method")
    transaction_code = data.get("transaction_code")

    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404

    if order.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    payment = Payment(
        order_id=order.id,
        method=method,
        transaction_code=transaction_code,
        amount=order.total_amount,
        status="paid",
    )

    order.status = "paid"

    db.session.add(payment)
    db.session.commit()

    return jsonify({"message": "Payment successful"}), 201