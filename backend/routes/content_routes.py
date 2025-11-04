from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Content, UserInteraction, Quiz, User, StudentProfile
from datetime import datetime

content_bp = Blueprint('content', __name__, url_prefix='/api/content')

@content_bp.route('', methods=['GET'])
@jwt_required()
def get_all_content():
    try:
        subject = request.args.get('subject')
        difficulty = request.args.get('difficulty')
        content_type = request.args.get('type')
        language = request.args.get('language', 'en')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = Content.query
        if subject:
            query = query.filter(Content.subject == subject)
        if difficulty:
            query = query.filter(Content.difficulty_level == difficulty)
        if content_type:
            query = query.filter(Content.content_type == content_type)
        if language:
            query = query.filter(Content.language == language)
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        contents = [content.to_dict() for content in pagination.items]
        return jsonify({'contents': contents, 'total': pagination.total, 'pages': pagination.pages, 'current_page': page}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_bp.route('/<int:content_id>', methods=['GET'])
@jwt_required()
def get_content(content_id):
    try:
        content = Content.query.get(content_id)
        if not content:
            return jsonify({'error': 'Content not found'}), 404
        quiz = Quiz.query.filter_by(content_id=content_id).first()
        return jsonify({'content': content.to_dict(), 'quiz': quiz.to_dict() if quiz else None}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_bp.route('', methods=['POST'])
@jwt_required()
def create_content():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user.role not in ['teacher', 'admin']:
            return jsonify({'error': 'Unauthorized'}), 403
        data = request.get_json()
        required_fields = ['title', 'content_type', 'description', 'subject', 'difficulty_level']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        content = Content(title=data['title'], content_type=data['content_type'], description=data['description'], url=data.get('url', ''), thumbnail_url=data.get('thumbnail_url', ''), subject=data['subject'], difficulty_level=data['difficulty_level'], duration=data.get('duration', 0), language=data.get('language', 'en'), has_captions=data.get('has_captions', False), has_transcript=data.get('has_transcript', False), has_audio_description=data.get('has_audio_description', False))
        if 'topics' in data:
            content.set_topics(data['topics'])
        db.session.add(content)
        db.session.commit()
        return jsonify({'message': 'Content created successfully', 'content': content.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@content_bp.route('/<int:content_id>/interact', methods=['POST'])
@jwt_required()
def record_interaction(content_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user.role != 'student':
            return jsonify({'error': 'Only students can interact with content'}), 403
        content = Content.query.get(content_id)
        if not content:
            return jsonify({'error': 'Content not found'}), 404
        data = request.get_json()
        student_profile = StudentProfile.query.filter_by(user_id=user.id).first()
        interaction = UserInteraction.query.filter_by(student_id=student_profile.id, content_id=content_id).first()
        if not interaction:
            interaction = UserInteraction(student_id=student_profile.id, content_id=content_id)
            db.session.add(interaction)
        if 'viewed' in data:
            interaction.viewed = data['viewed']
        if 'completed' in data:
            interaction.completed = data['completed']
            if data['completed']:
                student_profile.total_points += 10
                if student_profile.total_points >= student_profile.level * 100:
                    student_profile.level += 1
        if 'rating' in data:
            interaction.rating = data['rating']
        if 'time_spent' in data:
            interaction.time_spent = data['time_spent']
            student_profile.total_time_spent += data['time_spent'] // 60
        if 'progress' in data:
            interaction.progress = data['progress']
        if 'bookmarked' in data:
            interaction.bookmarked = data['bookmarked']
        interaction.clicks += 1
        student_profile.last_active = datetime.utcnow()
        db.session.commit()
        return jsonify({'message': 'Interaction recorded', 'interaction': interaction.to_dict(), 'points': student_profile.total_points, 'level': student_profile.level}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
