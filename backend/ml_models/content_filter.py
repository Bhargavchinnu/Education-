import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

class ContentBasedFilter:
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.content_matrix = None
        self.content_features = None
    
    def build_content_profile(self, contents):
        df = pd.DataFrame(contents)
        if df.empty:
            return None
        df['combined_features'] = (df['title'].fillna('') + ' ' + df['description'].fillna('') + ' ' + df['subject'].fillna(''))
        self.content_matrix = self.tfidf_vectorizer.fit_transform(df['combined_features'])
        self.content_features = df[['id', 'difficulty_level', 'subject', 'language']].copy()
        return self.content_matrix
    
    def calculate_similarity(self):
        if self.content_matrix is None:
            return None
        return cosine_similarity(self.content_matrix)
    
    def recommend_based_on_content(self, content_id, student_profile, top_n=10):
        if self.content_features is None or content_id not in self.content_features['id'].values:
            return []
        similarity_matrix = self.calculate_similarity()
        idx = self.content_features[self.content_features['id'] == content_id].index[0]
        sim_scores = list(enumerate(similarity_matrix[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        recommendations = []
        for i, score in sim_scores[1:]:
            content_row = self.content_features.iloc[i]
            if content_row['difficulty_level'] == student_profile.get('difficulty_level', 'beginner') and content_row['language'] == student_profile.get('preferred_language', 'en'):
                recommendations.append({'content_id': int(content_row['id']), 'similarity_score': float(score)})
                if len(recommendations) >= top_n:
                    break
        return recommendations
