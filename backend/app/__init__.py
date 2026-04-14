from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:12345678@localhost:5432/totosbliss"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "this-is-a-very-long-random-secret-key-123456"
    app.config["SECRET_KEY"] = "super-secret-reset-key-123456"
    app.config["RESET_TOKEN_EXPIRES"] = 1800
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = "your-email@example.com"
    app.config["MAIL_PASSWORD"] = "your-email-password"
    app.config["MAIL_DEFAULT_SENDER"] = "your-email@example.com"

    # image upload config
    app.config["UPLOAD_FOLDER"] = os.path.join(app.root_path, "static", "uploads")
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5MB max

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from app.models.user import User
    from app.models.product import Product
    from app.models.cart import Cart, CartItem
    from app.models.order import Order, OrderItem
    from app.models.delivery import Delivery
    from app.models.payment import Payment

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

    with app.app_context():
        db.create_all()

    return app