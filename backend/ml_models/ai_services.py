from transformers import AutoTokenizer, AutoModelForCausalLM, AutoModelForSequenceClassification, pipeline
from sentence_transformers import SentenceTransformer
import torch
from typing import List, Dict, Any
import numpy as np

class AIServices:
    def __init__(self):
        # Initialize chat model (using a more advanced dialogue model)
        self.chat_model_name = "microsoft/DialoGPT-medium"
        self.chat_tokenizer = AutoTokenizer.from_pretrained(self.chat_model_name)
        self.chat_model = AutoModelForCausalLM.from_pretrained(self.chat_model_name)
        
        # Initialize learning style detector (using a fine-tuned BERT model)
        self.style_model_name = "bert-base-uncased"  # We'll fine-tune this for learning styles
        self.style_classifier = pipeline(
            "text-classification",
            model=self.style_model_name,
            tokenizer=self.style_model_name
        )
        
        # Initialize content recommender (using a more powerful sentence transformer)
        self.recommender_model_name = "sentence-transformers/all-mpnet-base-v2"
        self.recommender = SentenceTransformer(self.recommender_model_name)
        
        # Initialize text summarizer
        self.summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn"
        )
        
        # Initialize question answering
        self.qa_model = pipeline(
            "question-answering",
            model="deepset/roberta-base-squad2"
        )

    def generate_chat_response(self, user_input: str, conversation_history: List[str] = None) -> str:
        """Generate a response using DialoGPT with conversation history."""
        # Process conversation history
        if conversation_history is None:
            conversation_history = []
        
        # Combine history with current input
        full_context = " ".join(conversation_history[-3:] + [user_input])  # Keep last 3 exchanges
        
        # Tokenize and generate response
        inputs = self.chat_tokenizer.encode(full_context + self.chat_tokenizer.eos_token, return_tensors="pt")
        outputs = self.chat_model.generate(
            inputs,
            max_length=150,
            num_return_sequences=1,
            temperature=0.9,
            top_p=0.9,
            do_sample=True,
            pad_token_id=self.chat_tokenizer.eos_token_id
        )
        
        response = self.chat_tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response.split(full_context)[-1].strip()

    def detect_learning_style(self, user_text: str) -> Dict[str, Any]:
        """Analyze text to detect learning style preferences using fine-tuned BERT."""
        # Map raw classifications to learning styles
        style_mapping = {
            'LABEL_0': 'visual',
            'LABEL_1': 'auditory',
            'LABEL_2': 'kinesthetic',
            'LABEL_3': 'reading/writing'
        }
        
        result = self.style_classifier(user_text)
        primary_style = style_mapping.get(result[0]['label'], 'balanced')
        
        return {
            'style': primary_style,
            'confidence': result[0]['score'],
            'analysis': {
                'text_length': len(user_text.split()),
                'complexity': self._analyze_text_complexity(user_text),
                'preferences': self._extract_learning_preferences(user_text)
            }
        }

    def get_content_recommendations(self, user_interests: str, available_content: List[Dict]) -> List[Dict]:
        """Get personalized content recommendations using sentence transformers."""
        # Generate embedding for user interests
        user_embedding = self.recommender.encode([user_interests])
        
        # Generate embeddings for available content
        content_texts = [f"{item['title']} {item['description']}" for item in available_content]
        content_embeddings = self.recommender.encode(content_texts)
        
        # Calculate similarities using dot product
        similarities = np.dot(user_embedding, content_embeddings.T)[0]
        
        # Get top recommendations with scores
        top_indices = np.argsort(similarities)[::-1][:5]
        recommendations = []
        
        for idx in top_indices:
            content = available_content[idx].copy()
            content['relevance_score'] = float(similarities[idx])
            recommendations.append(content)
        
        return recommendations

    def summarize_content(self, text: str, max_length: int = 150) -> str:
        """Generate a concise summary of the content."""
        summary = self.summarizer(text, max_length=max_length, min_length=30)[0]['summary_text']
        return summary

    def answer_question(self, context: str, question: str) -> Dict[str, Any]:
        """Answer questions about specific content."""
        result = self.qa_model(question=question, context=context)
        return {
            'answer': result['answer'],
            'confidence': result['score'],
            'start': result['start'],
            'end': result['end']
        }

    def _analyze_text_complexity(self, text: str) -> Dict[str, float]:
        """Analyze the complexity of user's text."""
        words = text.split()
        sentences = text.split('.')
        
        return {
            'avg_word_length': sum(len(word) for word in words) / len(words),
            'avg_sentence_length': len(words) / len(sentences),
            'vocabulary_richness': len(set(words)) / len(words)
        }

    def _extract_learning_preferences(self, text: str) -> Dict[str, float]:
        """Extract learning preferences from text using keyword analysis."""
        visual_keywords = ['see', 'look', 'view', 'watch', 'picture', 'image']
        auditory_keywords = ['hear', 'listen', 'sound', 'speak', 'talk', 'audio']
        kinesthetic_keywords = ['do', 'feel', 'touch', 'practice', 'experience', 'hands-on']
        reading_keywords = ['read', 'write', 'note', 'text', 'book', 'document']
        
        text = text.lower()
        scores = {
            'visual': sum(text.count(word) for word in visual_keywords),
            'auditory': sum(text.count(word) for word in auditory_keywords),
            'kinesthetic': sum(text.count(word) for word in kinesthetic_keywords),
            'reading_writing': sum(text.count(word) for word in reading_keywords)
        }
        
        # Normalize scores
        total = sum(scores.values()) or 1
        return {k: v/total for k, v in scores.items()}

ai_service = AIServices()