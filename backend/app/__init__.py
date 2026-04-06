from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:12345678@localhost:5432/totosbliss'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret'

    # Init extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Register blueprints
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)
    from app.routes.product_routes import product_bp
    app.register_blueprint(product_bp)
    from app.models.user import User
    from app.models.product import Product
    from app.routes.cart_routes import cart_bp
    app.register_blueprint(cart_bp)
    from app.routes.order_routes import order_bp
    app.register_blueprint(order_bp)
    from app.routes.delivery_routes import delivery_bp
    app.register_blueprint(delivery_bp)

    # Create tables
    with app.app_context():
        db.create_all()

    print(app.url_map)
    print(app.config['SQLALCHEMY_DATABASE_URI'])

    return app