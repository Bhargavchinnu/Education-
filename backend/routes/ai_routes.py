from flask import Blueprint, request, jsonify
from ..ml_models.ai_services import ai_service
from flask_jwt_extended import jwt_required, get_jwt_identity

ai_routes = Blueprint('ai_routes', __name__)

@ai_routes.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    """Generate chat responses with conversation history."""
    data = request.get_json()
    user_input = data.get('message')
    conversation_history = data.get('history', [])
    
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400
    
    try:
        response = ai_service.generate_chat_response(user_input, conversation_history)
        return jsonify({
            'response': response,
            'user_id': get_jwt_identity()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes.route('/learning-style', methods=['POST'])
@jwt_required()
def analyze_learning_style():
    """Analyze user's learning style based on their interactions."""
    data = request.get_json()
    user_text = data.get('text')
    
    if not user_text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        analysis = ai_service.detect_learning_style(user_text)
        return jsonify(analysis)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes.route('/recommendations', methods=['POST'])
@jwt_required()
def get_recommendations():
    """Get personalized content recommendations."""
    data = request.get_json()
    user_interests = data.get('interests')
    available_content = data.get('available_content', [])
    
    if not user_interests or not available_content:
        return jsonify({'error': 'Missing required data'}), 400
    
    try:
        recommendations = ai_service.get_content_recommendations(
            user_interests,
            available_content
        )
        return jsonify({
            'recommendations': recommendations,
            'user_id': get_jwt_identity()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes.route('/summarize', methods=['POST'])
@jwt_required()
def summarize_content():
    """Generate a summary of provided content."""
    data = request.get_json()
    text = data.get('text')
    max_length = data.get('max_length', 150)
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        summary = ai_service.summarize_content(text, max_length)
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_routes.route('/qa', methods=['POST'])
@jwt_required()
def answer_question():
    """Answer questions about specific content."""
    data = request.get_json()
    context = data.get('context')
    question = data.get('question')
    
    if not context or not question:
        return jsonify({'error': 'Missing context or question'}), 400
    
    try:
        answer = ai_service.answer_question(context, question)
        return jsonify(answer)
    except Exception as e:
        return jsonify({'error': str(e)}), 500