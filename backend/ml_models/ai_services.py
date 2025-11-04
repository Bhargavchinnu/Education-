from transformers import AutoTokenizer, AutoModelForCausalLM, AutoModelForSequenceClassification, pipeline
import torch

class AIServices:
    def __init__(self):
        # Initialize chat model
        self.chat_model_name = "facebook/blenderbot-400M-distill"
        self.chat_tokenizer = AutoTokenizer.from_pretrained(self.chat_model_name)
        self.chat_model = AutoModelForCausalLM.from_pretrained(self.chat_model_name)
        
        # Initialize learning style detector
        self.style_model_name = "bert-base-uncased"
        self.style_classifier = pipeline(
            "text-classification",
            model=self.style_model_name,
            tokenizer=self.style_model_name
        )
        
        # Initialize content recommender
        self.recommender_model_name = "sentence-transformers/all-MiniLM-L6-v2"
        self.recommender = pipeline(
            "feature-extraction",
            model=self.recommender_model_name
        )

    def generate_chat_response(self, user_input):
        # Tokenize and generate response
        inputs = self.chat_tokenizer(user_input, return_tensors="pt")
        outputs = self.chat_model.generate(
            inputs.input_ids,
            max_length=100,
            num_return_sequences=1,
            temperature=0.7,
            pad_token_id=self.chat_tokenizer.eos_token_id
        )
        response = self.chat_tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response

    def detect_learning_style(self, user_text):
        # Analyze text to detect learning style preferences
        result = self.style_classifier(user_text)
        return {
            'style': result[0]['label'],
            'confidence': result[0]['score']
        }

    def get_content_recommendations(self, user_interests, available_content):
        # Generate embeddings for user interests
        user_embedding = self.recommender(user_interests)
        
        # Generate embeddings for available content
        content_embeddings = [self.recommender(content['description']) for content in available_content]
        
        # Calculate similarities
        similarities = torch.cosine_similarity(
            torch.tensor(user_embedding[0]),
            torch.tensor([emb[0] for emb in content_embeddings])
        )
        
        # Get top recommendations
        top_indices = similarities.argsort(descending=True)[:5]
        recommendations = [available_content[idx] for idx in top_indices]
        
        return recommendations

ai_service = AIServices()