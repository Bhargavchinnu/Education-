import numpy as np
from collaborative_filter import CollaborativeFilter
from content_filter import ContentBasedFilter

class HybridRecommender:
    def __init__(self, collaborative_weight=0.6, content_weight=0.4):
        self.collaborative_filter = CollaborativeFilter()
        self.content_filter = ContentBasedFilter()
        self.collaborative_weight = collaborative_weight
        self.content_weight = content_weight
    
    def train(self, all_interactions, all_contents):
        if all_interactions:
            self.collaborative_filter.create_user_item_matrix(all_interactions)
            self.collaborative_filter.calculate_user_similarity()
        if all_contents:
            self.content_filter.build_content_profile(all_contents)
    
    def get_recommendations(self, student_id, student_profile, student_interactions, all_contents, top_n=10):
        collab_recs = self.collaborative_filter.predict_user_ratings(student_id, top_n * 2)
        combined_scores = {}
        for rec in collab_recs:
            content_id = rec['content_id']
            combined_scores[content_id] = rec['predicted_rating'] * self.collaborative_weight
        recommendations = [{'content_id': content_id, 'score': score} for content_id, score in combined_scores.items()]
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:top_n]
    
    def get_adaptive_difficulty(self, student_performance):
        if not student_performance:
            return 'beginner'
        avg_score = np.mean([p['score'] for p in student_performance])
        return 'advanced' if avg_score >= 85 else ('intermediate' if avg_score >= 65 else 'beginner')
