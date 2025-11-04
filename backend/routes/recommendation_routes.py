from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, StudentProfile, Content, UserInteraction, QuizAttempt
import numpy as np

recommendation_bp = Blueprint('recommendations', __name__, url_prefix='/api/recommendations')

@recommendation_bp.route('', methods=['GET'])
@jwt_required()
def get_recommendations():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user.role != 'student':
            return jsonify({'error': 'Only students can get recommendations'}), 403
        student_profile = StudentProfile.query.filter_by(user_id=user.id).first()
        if not student_profile:
            return jsonify({'error': 'Student profile not found'}), 404
        
        all_contents = Content.query.all()
        recommended_ids = [c.id for c in all_contents if c.difficulty_level == student_profile.difficulty_level][:10]
        recommended_contents = [Content.query.get(id).to_dict() for id in recommended_ids]
        
        return jsonify({'recommendations': recommended_contents}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendation_bp.route('/similar/<int:content_id>', methods=['GET'])
@jwt_required()
def get_similar_content(content_id):
    try:
        content = Content.query.get(content_id)
        if not content:
            return jsonify({'error': 'Content not found'}), 404
        
        all_contents = Content.query.filter(Content.id != content_id).filter(Content.subject == content.subject).limit(5).all()
        similar_contents = [c.to_dict() for c in all_contents]
        
        return jsonify({'similar_content': similar_contents}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendation_bp.route('/adaptive-difficulty', methods=['GET'])
@jwt_required()
def get_adaptive_difficulty():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user.role != 'student':
            return jsonify({'error': 'Only students have difficulty levels'}), 403
        student_profile = StudentProfile.query.filter_by(user_id=user.id).first()
        if not student_profile:
            return jsonify({'error': 'Student profile not found'}), 404
        
        quiz_attempts = QuizAttempt.query.filter_by(student_id=student_profile.id).all()
        if not quiz_attempts:
            return jsonify({'message': 'No quiz attempts yet', 'difficulty_level': student_profile.difficulty_level}), 200
        
        avg_score = np.mean([q.score for q in quiz_attempts if q.score])
        new_difficulty = 'advanced' if avg_score >= 85 else ('intermediate' if avg_score >= 65 else 'beginner')
        
        if new_difficulty != student_profile.difficulty_level:
            student_profile.difficulty_level = new_difficulty
            db.session.commit()
            return jsonify({'message': f'Difficulty adjusted to {new_difficulty}', 'new_level': new_difficulty}), 200
        
        return jsonify({'message': 'Current difficulty is appropriate', 'difficulty_level': student_profile.difficulty_level}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
