from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, StudentProfile, TeacherProfile
from datetime import datetime

user_bp = Blueprint('users', __name__, url_prefix='/api/users')

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        if user.role == 'student':
            profile = StudentProfile.query.filter_by(user_id=user.id).first()
        elif user.role == 'teacher':
            profile = TeacherProfile.query.filter_by(user_id=user.id).first()
        else:
            profile = None
        return jsonify({'user': user.to_dict(), 'profile': profile.to_dict() if profile else None}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        data = request.get_json()
        if 'email' in data:
            user.email = data['email']
        if user.role == 'student':
            profile = StudentProfile.query.filter_by(user_id=user.id).first()
            if profile:
                if 'learning_style' in data:
                    profile.learning_style = data['learning_style']
                if 'difficulty_level' in data:
                    profile.difficulty_level = data['difficulty_level']
                if 'preferred_language' in data:
                    profile.preferred_language = data['preferred_language']
                if 'disabilities' in data:
                    profile.set_disabilities(data['disabilities'])
                if 'accessibility_settings' in data:
                    profile.set_accessibility_settings(data['accessibility_settings'])
                profile.last_active = datetime.utcnow()
        elif user.role == 'teacher':
            profile = TeacherProfile.query.filter_by(user_id=user.id).first()
            if profile:
                if 'department' in data:
                    profile.department = data['department']
                if 'bio' in data:
                    profile.bio = data['bio']
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully', 'user': user.to_dict(), 'profile': profile.to_dict() if profile else None}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/accessibility', methods=['PUT'])
@jwt_required()
def update_accessibility_settings():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'student':
            return jsonify({'error': 'Unauthorized'}), 403
        profile = StudentProfile.query.filter_by(user_id=user.id).first()
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        data = request.get_json()
        current_settings = profile.get_accessibility_settings()
        current_settings.update(data)
        profile.set_accessibility_settings(current_settings)
        db.session.commit()
        return jsonify({'message': 'Accessibility settings updated', 'settings': current_settings}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/badges', methods=['GET'])
@jwt_required()
def get_badges():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'student':
            return jsonify({'error': 'Unauthorized'}), 403
        profile = StudentProfile.query.filter_by(user_id=user.id).first()
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        return jsonify({'badges': profile.get_badges(), 'total_points': profile.total_points, 'level': profile.level}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
