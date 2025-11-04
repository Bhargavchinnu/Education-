from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        if User.query.filter_by(username=data["username"]).first():
            return jsonify({"error": "Username already exists"}), 400
        user = User(
            username=data["username"],
            email=data["email"],
            role=data["role"]
        )
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()
        access_token = create_access_token(identity=user.id)
        return jsonify({
            "access_token": access_token,
            "user": user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(username=data["username"]).first()
        if not user or not user.check_password(data["password"]):
            return jsonify({"error": "Invalid credentials"}), 401
        access_token = create_access_token(identity=user.id)
        return jsonify({
            "access_token": access_token,
            "user": user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
