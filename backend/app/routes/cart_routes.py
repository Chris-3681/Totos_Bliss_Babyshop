from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.cart import Cart, CartItem
from app.models.product import Product

cart_bp = Blueprint("cart", __name__, url_prefix="/api/cart")


# ADD TO CART
@cart_bp.route("/add", methods=["POST"])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()

    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    if not product_id:
        return jsonify({"error": "Product ID required"}), 400

    product = Product.query.get(product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    if quantity > product.stock:
        return jsonify({"error": "Not enough stock"}), 400

    # get or create cart
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()

    # check if item already exists
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


# GET CART
@cart_bp.route("/", methods=["GET"])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({
            "items": [],
            "total": 0
        })

    items = CartItem.query.filter_by(cart_id=cart.id).all()

    cart_items = []
    total = 0

    for item in items:
        item_total = item.quantity * item.price_at_time
        total += item_total

        cart_items.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": item.price_at_time,
            "subtotal": item_total
        })

    return jsonify({
        "items": cart_items,
        "total": total
    })


# REMOVE ITEM
@cart_bp.route("/remove/<int:product_id>", methods=["DELETE"])
@jwt_required()
def remove_item(product_id):
    user_id = get_jwt_identity()

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({"error": "Cart not found"}), 404

    item = CartItem.query.filter_by(
        cart_id=cart.id,
        product_id=product_id
    ).first()

    if not item:
        return jsonify({"error": "Item not in cart"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Item removed"})


# UPDATE QUANTITY (important, don't skip this)
@cart_bp.route("/update", methods=["PUT"])
@jwt_required()
def update_quantity():
    user_id = get_jwt_identity()
    data = request.get_json()

    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if quantity is None or quantity < 1:
        return jsonify({"error": "Invalid quantity"}), 400

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({"error": "Cart not found"}), 404

    item = CartItem.query.filter_by(
        cart_id=cart.id,
        product_id=product_id
    ).first()

    if not item:
        return jsonify({"error": "Item not in cart"}), 404

    product = Product.query.get(product_id)

    if quantity > product.stock:
        return jsonify({"error": "Not enough stock"}), 400

    item.quantity = quantity
    db.session.commit()

    return jsonify({"message": "Quantity updated"})