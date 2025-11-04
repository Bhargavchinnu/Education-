from flask import Blueprint, request, jsonify
from ml_models.ai_services import ai_service

ai_routes = Blueprint('ai_routes', __name__)

@ai_routes.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    response = ai_service.generate_chat_response(user_message)
    return jsonify({'response': response})

@ai_routes.route('/analyze-learning-style', methods=['POST'])
def analyze_learning_style():
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    result = ai_service.detect_learning_style(text)
    return jsonify(result)

@ai_routes.route('/get-recommendations', methods=['POST'])
def get_recommendations():
    data = request.json
    interests = data.get('interests')
    available_content = data.get('available_content')
    
    if not interests or not available_content:
        return jsonify({'error': 'Missing required data'}), 400
    
    recommendations = ai_service.get_content_recommendations(interests, available_content)
    return jsonify({'recommendations': recommendations})