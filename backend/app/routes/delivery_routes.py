from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.delivery import Delivery
from app.models.order import Order

delivery_bp = Blueprint("delivery", __name__, url_prefix="/api/delivery")


@delivery_bp.route("/add", methods=["POST"])
@jwt_required()
def add_delivery():
    try:
        # Get logged-in user
        user_id = int(get_jwt_identity())

        data = request.get_json()

        order_id = data.get("order_id")
        address = data.get("address")
        phone = data.get("phone")

        # Validate input
        if not all([order_id, address, phone]):
            return jsonify({"error": "Missing fields"}), 400

        # Fetch order
        order = Order.query.get(order_id)

        if not order:
            return jsonify({"error": "Order not found"}), 404

        # Debug logs (remove later in production)
        print("TOKEN USER:", user_id)
        print("ORDER USER:", order.user_id)

        # Ownership check (CRITICAL)
        if order.user_id != user_id:
            return jsonify({"error": "Unauthorized"}), 403

        # Create delivery
        delivery = Delivery(
            order_id=order.id,
            address=address,
            phone=phone
        )

        db.session.add(delivery)
        db.session.commit()

        return jsonify({
            "message": "Delivery info added",
            "delivery_id": delivery.id
        }), 201

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": "Something went wrong"}), 500