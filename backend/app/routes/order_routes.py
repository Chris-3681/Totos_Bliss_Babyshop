from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.order import Order, OrderItem

order_bp = Blueprint("orders", __name__, url_prefix="/api/orders")


@order_bp.route("/create", methods=["POST"])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({"error": "Cart is empty"}), 400

    items = CartItem.query.filter_by(cart_id=cart.id).all()

    if not items:
        return jsonify({"error": "Cart is empty"}), 400

    total = 0

    # create order
    order = Order(user_id=user_id, status="pending")
    db.session.add(order)
    db.session.flush()  # get order.id before commit

    for item in items:
        product = Product.query.get(item.product_id)

        if item.quantity > product.stock:
            return jsonify({"error": f"Not enough stock for {product.name}"}), 400

        # reduce stock
        product.stock -= item.quantity

        subtotal = item.quantity * item.price_at_time
        total += subtotal

        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price_at_time
        )

        db.session.add(order_item)

    order.total_amount = total

    # clear cart
    CartItem.query.filter_by(cart_id=cart.id).delete()

    db.session.commit()

    return jsonify({
        "message": "Order created",
        "order_id": order.id,
        "total": total
    }), 201