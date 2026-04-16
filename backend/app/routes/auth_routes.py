from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.user import User
import bcrypt
from flask_jwt_extended import create_access_token
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def generate_reset_token(email):
    serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    return serializer.dumps(email, salt="password-reset-salt")


def verify_reset_token(token):
    serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    try:
        email = serializer.loads(
            token,
            salt="password-reset-salt",
            max_age=current_app.config["RESET_TOKEN_EXPIRES"]
        )
        return email
    except SignatureExpired:
        return None
    except BadSignature:
        return None


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

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    new_user = User(
        name=name,
        email=email,
        phone=phone,
        password_hash=hashed_password.decode("utf-8")
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
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


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "No account found with that email"}), 404

    token = generate_reset_token(email)

    # For now return token so you can test.
    # Later replace this with real email sending.
    reset_link = f"http://localhost:5173/reset-password/{token}"

    return jsonify({
        "message": "Password reset link generated",
        "reset_link": reset_link
    }), 200


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()

    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400

    email = verify_reset_token(token)

    if not email:
        return jsonify({"error": "Invalid or expired token"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
    user.password_hash = hashed_password.decode("utf-8")


@auth_bp.route("/debug/reset-admin", methods=["GET"])
def reset_admin():
    from app.models.user import User
    import bcrypt

    admin = User.query.filter_by(email="admin@totos.com").first()

    if not admin:
        return {"message": "Admin not found"}, 404

    new_password = "admin123"

    admin.password_hash = bcrypt.hashpw(
        new_password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    admin.is_admin = True

    db.session.commit()

    return {"message": "Admin password reset"}, 200

    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200