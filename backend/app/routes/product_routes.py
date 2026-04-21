import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import cloudinary.uploader

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
        raise ValueError("Invalid image format. Use png, jpg, jpeg, or webp.")

    upload_result = cloudinary.uploader.upload(
        file,
        folder="totos_bliss_products",
        public_id=f"{uuid.uuid4().hex}",
        resource_type="image"
    )

    return upload_result.get("secure_url")


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
        user = db.session.get(User, user_id)

        if not user or not user.is_admin:
            return jsonify({"error": "Unauthorized"}), 403

        name = (request.form.get("name") or "").strip()
        description = (request.form.get("description") or "").strip()
        price_raw = (request.form.get("price") or "").strip()
        stock_raw = (request.form.get("stock") or "0").strip()
        image = request.files.get("image")

        if not name:
            return jsonify({"error": "Name is required"}), 400

        if not price_raw:
            return jsonify({"error": "Price is required"}), 400

        try:
            price = float(price_raw)
        except ValueError:
            return jsonify({"error": "Invalid price value"}), 400

        try:
            stock = int(stock_raw) if stock_raw else 0
        except ValueError:
            return jsonify({"error": "Invalid stock value"}), 400

        image_url = None
        if image and image.filename:
            image_url = save_image(image)

        product = Product(
            name=name,
            description=description,
            price=price,
            stock=stock,
            image_url=image_url
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({"message": "Product created"}), 201

    except Exception as e:
        print("CREATE PRODUCT ERROR:", repr(e))
        return jsonify({"error": str(e)}), 500


@product_bp.route("/<int:product_id>", methods=["PUT"])
@jwt_required()
def update_product(product_id):
    try:
        user_id = int(get_jwt_identity())
        user = db.session.get(User, user_id)

        if not user or not user.is_admin:
            return jsonify({"error": "Unauthorized"}), 403

        product = db.session.get(Product, product_id)

        if not product:
            return jsonify({"error": "Product not found"}), 404

        name = request.form.get("name")
        description = request.form.get("description")
        price = request.form.get("price")
        stock = request.form.get("stock")
        image = request.files.get("image")

        if name is not None:
            product.name = name.strip()

        if description is not None:
            product.description = description.strip()

        if price is not None and price != "":
            try:
                product.price = float(price)
            except ValueError:
                return jsonify({"error": "Invalid price value"}), 400

        if stock is not None and stock != "":
            try:
                product.stock = int(stock)
            except ValueError:
                return jsonify({"error": "Invalid stock value"}), 400

        if image and image.filename:
            image_url = save_image(image)
            if image_url:
                product.image_url = image_url

        db.session.commit()

        return jsonify({"message": "Product updated"}), 200

    except Exception as e:
        print("UPDATE PRODUCT ERROR:", repr(e))
        return jsonify({"error": str(e)}), 500


@product_bp.route("/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    try:
        user_id = int(get_jwt_identity())
        user = db.session.get(User, user_id)

        if not user or not user.is_admin:
            return jsonify({"error": "Unauthorized"}), 403

        product = db.session.get(Product, product_id)

        if not product:
            return jsonify({"error": "Product not found"}), 404

        db.session.delete(product)
        db.session.commit()

        return jsonify({"message": "Product deleted"}), 200

    except Exception as e:
        print("DELETE PRODUCT ERROR:", repr(e))
        return jsonify({"error": str(e)}), 500