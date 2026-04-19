import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from app import db
from app.models.product import Product
from app.models.user import User

product_bp = Blueprint("products", __name__, url_prefix="/api/products")

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_image(file):
    if not file or file.filename == "":
        return None

    if not allowed_file(file.filename):
        return None

    ext = file.filename.rsplit(".", 1)[1].lower()
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    filename = secure_filename(unique_name)

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    return f"{request.host_url.rstrip('/')}/static/uploads/{filename}"


@product_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.order_by(Product.id.desc()).all()

    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "stock": p.stock,
            "image_url": p.image_url,
        }
        for p in products
    ]), 200


@product_bp.route("/", methods=["POST"])
@jwt_required()
def create_product():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user or not user.is_admin:
            return jsonify({"error": "Unauthorized"}), 403

        name = request.form.get("name")
        description = request.form.get("description")
        price = request.form.get("price")
        stock = request.form.get("stock", 0)
        image = request.files.get("image")

        print("NAME:", name)
        print("DESCRIPTION:", description)
        print("PRICE:", price)
        print("STOCK:", stock)
        print("IMAGE:", image)

        if not name or not price:
            return jsonify({"error": "Name and price are required"}), 400

        image_url = save_image(image)

        product = Product(
            name=name,
            description=description,
            price=float(price),
            stock=int(stock),
            image_url=image_url
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({"message": "Product created"}), 201

    except Exception as e:
        print("CREATE PRODUCT ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

@product_bp.route("/<int:product_id>", methods=["PUT"])
@jwt_required()
def update_product(product_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    product = Product.query.get(product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    name = request.form.get("name")
    description = request.form.get("description")
    price = request.form.get("price")
    stock = request.form.get("stock")
    image = request.files.get("image")

    if name is not None:
        product.name = name
    if description is not None:
        product.description = description
    if price is not None and price != "":
        product.price = float(price)
    if stock is not None and stock != "":
        product.stock = int(stock)

    if image and image.filename != "":
        image_url = save_image(image)
        if image_url:
            product.image_url = image_url

    db.session.commit()

    return jsonify({"message": "Product updated"}), 200


@product_bp.route("/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    product = Product.query.get(product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted"}), 200