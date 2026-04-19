import os
from datetime import timedelta
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail

db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()


def create_app():
    app = Flask(__name__)

    # =========================
    # DATABASE CONFIG
    # =========================
    db_url = os.environ.get("DATABASE_URL")

    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = db_url or "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # =========================
    # SECURITY CONFIG
    # =========================
    app.config["JWT_SECRET_KEY"] = os.environ.get(
        "JWT_SECRET_KEY", "totos_bliss_jwt_secret_2026"
    )

    app.config["SECRET_KEY"] = os.environ.get(
        "SECRET_KEY", "totos_bliss_secret_2026"
    )

    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
    app.config["DEBUG"] = False

    # =========================
    # MAIL CONFIG
    # =========================
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = os.environ.get("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD")

    # =========================
    # IMAGE UPLOAD CONFIG
    # =========================
    app.config["UPLOAD_FOLDER"] = os.path.join(app.root_path, "static", "uploads")
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # =========================
    # INIT EXTENSIONS
    # =========================
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
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
    # INIT DB
    # =========================
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            print("DB INIT ERROR:", e)

    # =========================
    # ROOT ROUTE
    # =========================
    @app.route("/")
    def home():
        return {"message": "Totos Bliss API is live"}, 200

    return app