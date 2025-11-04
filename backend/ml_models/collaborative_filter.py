import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

class CollaborativeFilter:
    def __init__(self):
        self.user_item_matrix = None
        self.user_similarity = None
    
    def create_user_item_matrix(self, interactions):
        df = pd.DataFrame(interactions)
        if df.empty:
            return None
        self.user_item_matrix = df.pivot_table(index='student_id', columns='content_id', values='rating', fill_value=0)
        return self.user_item_matrix
    
    def calculate_user_similarity(self):
        if self.user_item_matrix is None or self.user_item_matrix.empty:
            return None
        self.user_similarity = cosine_similarity(self.user_item_matrix)
        return self.user_similarity
    
    def predict_user_ratings(self, user_id, top_n=10):
        if self.user_item_matrix is None or user_id not in self.user_item_matrix.index:
            return []
        user_ratings = self.user_item_matrix.loc[user_id]
        if self.user_similarity is None:
            self.calculate_user_similarity()
        user_idx = self.user_item_matrix.index.get_loc(user_id)
        similar_users = self.user_similarity[user_idx]
        predicted_ratings = np.dot(similar_users, self.user_item_matrix.values) / np.sum(np.abs(similar_users))
        unrated_items = user_ratings[user_ratings == 0].index
        predictions = []
        for item_id in unrated_items:
            if item_id in self.user_item_matrix.columns:
                item_idx = self.user_item_matrix.columns.get_loc(item_id)
                predictions.append({'content_id': int(item_id), 'predicted_rating': float(predicted_ratings[item_idx])})
        predictions.sort(key=lambda x: x['predicted_rating'], reverse=True)
        return predictions[:top_n]
