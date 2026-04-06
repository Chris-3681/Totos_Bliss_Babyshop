from app import create_app, db
from app.models.user import User
import bcrypt

app = create_app()

with app.app_context():
    password = bcrypt.hashpw("admin123".encode("utf-8"), bcrypt.gensalt())

    admin = User(
        name="Admin",
        email="admin@totos.com",
        phone="0700000000",
        password_hash=password.decode("utf-8"),
        is_admin=True
    )

    db.session.add(admin)
    db.session.commit()

    print("Admin created successfully")