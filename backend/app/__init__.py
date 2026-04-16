import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    app.config["DEBUG"] = False

    # =========================
    # DATABASE CONFIG (FIXED)
    # =========================
    db_url = os.environ.get("DATABASE_URL")

    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = db_url or "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # =========================
    # SECURITY CONFIG
    # =========================
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-jwt-secret")
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret")

    # =========================
    # INIT EXTENSIONS
    # =========================
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # =========================
    # REGISTER BLUEPRINTS
    # =========================
    from app.routes.auth_routes import auth_bp
    from app.routes.product_routes import product_bp
    from app.routes.cart_routes import cart_bp
    from app.routes.order_routes import order_bp
    from app.routes.delivery_routes import delivery_bp
    from app.routes.payment_routes import payment_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(delivery_bp)
    app.register_blueprint(payment_bp)

    # =========================
    # CREATE TABLES (SAFE)
    # =========================
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            print("DB INIT ERROR:", e)

    return app