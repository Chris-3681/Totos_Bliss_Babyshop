from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.cart import Cart, CartItem
from app.models.product import Product

cart_bp = Blueprint("cart", __name__, url_prefix="/api/cart")


@cart_bp.route("/add", methods=["POST"])
@jwt_required()
def add_to_cart():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    if not product_id:
        return jsonify({"error": "Product ID required"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()

    existing_item = CartItem.query.filter_by(
        cart_id=cart.id,
        product_id=product_id
    ).first()

    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = CartItem(
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity,
            price_at_time=product.price
        )
        db.session.add(new_item)

    db.session.commit()

    return jsonify({"message": "Item added to cart"}), 201


@cart_bp.route("/", methods=["GET"])
@jwt_required()
def get_cart():
    user_id = int(get_jwt_identity())

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({
            "items": [],
            "subtotal": 0,
            "vat": 0,
            "total": 0
        }), 200

    items = CartItem.query.filter_by(cart_id=cart.id).all()

    cart_items = []
    subtotal = 0

    for item in items:
        product = Product.query.get(item.product_id)
        item_total = item.quantity * item.price_at_time
        subtotal += item_total

        cart_items.append({
            "product_id": item.product_id,
            "name": product.name if product else "Product",
            "image_url": product.image_url if product else "",
            "quantity": item.quantity,
            "price": item.price_at_time,
            "subtotal": item_total
        })

    vat = subtotal * 0.16
    total = subtotal + vat

    return jsonify({
        "items": cart_items,
        "subtotal": subtotal,
        "vat": vat,
        "total": total
    }), 200


@cart_bp.route("/remove/<int:product_id>", methods=["DELETE"])
@jwt_required()
def remove_from_cart(product_id):
    user_id = int(get_jwt_identity())

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        return jsonify({"error": "Cart not found"}), 404

    item = CartItem.query.filter_by(
        cart_id=cart.id,
        product_id=product_id
    ).first()

    if not item:
        return jsonify({"error": "Item not found in cart"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Item removed from cart"}), 200