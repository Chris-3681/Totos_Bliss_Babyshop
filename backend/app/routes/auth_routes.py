from flask import Blueprint

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    return {"message": "Account created"}