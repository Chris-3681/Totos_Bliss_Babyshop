from flask import Blueprint, request, jsonify, current_app
from app import db, mail
from app.models.user import User
import bcrypt
from flask_jwt_extended import create_access_token, decode_token
from flask_mail import Message
from datetime import timedelta

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
            "is_admin": user.is_admin
        }
    }), 200


# =========================
# FORGOT PASSWORD
# =========================
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"error": "Email is required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"message": "If account exists, reset link sent"}), 200

        reset_token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(hours=1)
        )

        frontend_url = current_app.config.get("FRONTEND_URL")
        reset_link = f"{frontend_url}/reset-password/{reset_token}"

        msg = Message(
            subject="Password Reset - Totos Bliss",
            sender=current_app.config["MAIL_USERNAME"],
            recipients=[email]
        )

        msg.body = f"""Hi {user.name},

Click the link below to reset your password:

{reset_link}

This link will expire in 1 hour.

If you did not request this, ignore this email.
"""

        mail.send(msg)
        print(f"RESET EMAIL SENT TO: {email}")

        return jsonify({"message": "Reset link sent"}), 200

    except Exception as e:
        print("FORGOT PASSWORD ERROR:", repr(e))
        return jsonify({"error": "Failed to send reset email"}), 500


# =========================
# RESET PASSWORD
# =========================
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()

        token = data.get("token")
        new_password = data.get("new_password")

        if not token or not new_password:
            return jsonify({"error": "Token and new password are required"}), 400

        decoded = decode_token(token)
        user_id = decoded["sub"]

        user = User.query.get(int(user_id))

        if not user:
            return jsonify({"error": "User not found"}), 404

        hashed_password = bcrypt.hashpw(
            new_password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        user.password_hash = hashed_password
        db.session.commit()

        return jsonify({"message": "Password reset successful"}), 200

    except Exception as e:
        print("RESET PASSWORD ERROR:", repr(e))
        return jsonify({"error": "Invalid or expired reset link"}), 400