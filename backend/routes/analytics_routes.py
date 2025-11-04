from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, StudentProfile, TeacherProfile, Content, UserInteraction, QuizAttempt
from sqlalchemy import func
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_analytics():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user.role == 'student':
            student_profile = StudentProfile.query.filter_by(user_id=user.id).first()
            if not student_profile:
                return jsonify({'error': 'Student profile not found'}), 404
            
            interactions = UserInteraction.query.filter_by(student_id=student_profile.id).all()
            total_content = len(interactions)
            completed_content = len([i for i in interactions if i.completed])
            total_time = student_profile.total_time_spent
            avg_rating = db.session.query(func.avg(UserInteraction.rating)).filter(UserInteraction.student_id == student_profile.id, UserInteraction.rating.isnot(None)).scalar() or 0
            
            quiz_attempts = QuizAttempt.query.filter_by(student_id=student_profile.id).all()
            quiz_stats = {'total_attempts': len(quiz_attempts), 'average_score': sum(q.score for q in quiz_attempts) / len(quiz_attempts) if quiz_attempts else 0, 'passed': len([q for q in quiz_attempts if q.passed])}
            
            return jsonify({'profile': student_profile.to_dict(), 'statistics': {'total_content': total_content, 'completed_content': completed_content, 'completion_rate': (completed_content / total_content * 100) if total_content > 0 else 0, 'total_time_minutes': total_time, 'average_rating': float(avg_rating)}, 'quiz_stats': quiz_stats}), 200
        
        elif user.role == 'teacher':
            teacher_profile = TeacherProfile.query.filter_by(user_id=user.id).first()
            if not teacher_profile:
                return jsonify({'error': 'Teacher profile not found'}), 404
            
            total_students = len(StudentProfile.query.all())
            return jsonify({'statistics': {'total_students': total_students}}), 200
        
        elif user.role == 'admin':
            total_users = User.query.count()
            total_students = User.query.filter_by(role='student').count()
            total_teachers = User.query.filter_by(role='teacher').count()
            total_content = Content.query.count()
            total_interactions = UserInteraction.query.count()
            return jsonify({'statistics': {'total_users': total_users, 'total_students': total_students, 'total_teachers': total_teachers, 'total_content': total_content, 'total_interactions': total_interactions}}), 200
        
        return jsonify({'error': 'Invalid user role'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_progress():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user.role != 'student':
            return jsonify({'error': 'Only students have progress'}), 403
        
        student_profile = StudentProfile.query.filter_by(user_id=user.id).first()
        if not student_profile:
            return jsonify({'error': 'Student profile not found'}), 404
        
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        daily_time = []
        for i in range(30):
            day = thirty_days_ago + timedelta(days=i)
            next_day = day + timedelta(days=1)
            time_spent = db.session.query(func.sum(UserInteraction.time_spent)).filter(UserInteraction.student_id == student_profile.id, UserInteraction.created_at >= day, UserInteraction.created_at < next_day).scalar() or 0
            daily_time.append({'date': day.strftime('%Y-%m-%d'), 'minutes': time_spent // 60})
        
        return jsonify({'daily_time': daily_time}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
