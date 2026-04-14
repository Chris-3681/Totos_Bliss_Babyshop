from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.delivery import Delivery
from app.models.order import Order
from app.models.user import User

delivery_bp = Blueprint("delivery", __name__, url_prefix="/api/delivery")


@delivery_bp.route("/add", methods=["POST"])
@jwt_required()
def add_delivery():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()

        order_id = data.get("order_id")
        address = data.get("address")
        phone = data.get("phone")

        if not all([order_id, address, phone]):
            return jsonify({"error": "Missing fields"}), 400

        order = Order.query.get(order_id)

        if not order:
            return jsonify({"error": "Order not found"}), 404

        if order.user_id != user_id:
            return jsonify({"error": "Unauthorized"}), 403

        delivery = Delivery(
            order_id=order.id,
            address=address,
            phone=phone,
        )

        db.session.add(delivery)
        db.session.commit()

        return jsonify({
            "message": "Delivery info added",
            "delivery_id": delivery.id,
        }), 201

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": "Something went wrong"}), 500


@delivery_bp.route("/admin", methods=["GET"])
@jwt_required()
def get_all_deliveries():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    deliveries = Delivery.query.order_by(Delivery.id.desc()).all()

    return jsonify([
        {
            "id": delivery.id,
            "order_id": delivery.order_id,
            "address": delivery.address,
            "phone": delivery.phone,
            "status": delivery.status,
        }
        for delivery in deliveries
    ]), 200


@delivery_bp.route("/admin/<int:delivery_id>/status", methods=["PUT"])
@jwt_required()
def update_delivery_status(delivery_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    delivery = Delivery.query.get(delivery_id)

    if not delivery:
        return jsonify({"error": "Delivery not found"}), 404

    data = request.get_json()
    status = data.get("status")

    allowed_statuses = ["pending", "processing", "dispatched", "delivered"]

    if status not in allowed_statuses:
        return jsonify({"error": "Invalid status"}), 400

    delivery.status = status
    db.session.commit()

    return jsonify({"message": "Delivery status updated"}), 200