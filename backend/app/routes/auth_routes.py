from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
import bcrypt
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# =========================
# REGISTER
# =========================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    if not all([name, email, phone, password]):
        return jsonify({"error": "All fields are required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    new_user = User(
        name=name,
        email=email,
        phone=phone,
        password_hash=hashed_password,
        is_admin=False
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


# =========================
# LOGIN
# =========================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user.password_hash.encode("utf-8")
    ):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "is_admin": user.is_admin   # 🔥 CRITICAL
        }
    }), 200


# =========================
# DEBUG: CREATE / RESET ADMIN
# =========================


# =========================
# FORGOT PASSWORD (basic)
# =========================
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "If account exists, reset instructions sent"}), 200

    # Placeholder (you already wired email logic separately)
    return jsonify({"message": "Reset instructions sent"}), 200