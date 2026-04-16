import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()


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

    app.config["DEBUG"] = False

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
    # CREATE TABLES + SEED ADMIN
    # =========================
    from app.models.user import User
    import bcrypt

    with app.app_context():
        try:
            db.create_all()

            # Seed admin user if not exists
            if not User.query.filter_by(email="admin@totos.com").first():
                hashed_password = bcrypt.hashpw(
                    "admin123".encode("utf-8"), bcrypt.gensalt()
                ).decode("utf-8")

                admin = User(
                    name="Admin",
                    email="admin@totos.com",
                    phone="0700000000",
                    password_hash=hashed_password,
                    is_admin=True,
                )

                db.session.add(admin)
                db.session.commit()

                print("Admin user created successfully")

        except Exception as e:
            print("DB INIT ERROR:", e)

    # =========================
    # ROOT ROUTE (OPTIONAL)
    # =========================
    @app.route("/")
    def home():
        return {"message": "Totos Bliss API is live"}, 200

    return app