import numpy as np
from collections import Counter

class LearningStyleDetector:
    def __init__(self):
        self.style_weights = {'visual': 0, 'auditory': 0, 'kinesthetic': 0, 'reading': 0}
    
    def analyze_content_preferences(self, interactions):
        content_types = []
        for interaction in interactions:
            if interaction.get('completed') or interaction.get('rating', 0) >= 4:
                content_type = interaction.get('content_type', '')
                content_types.append(content_type)
        if not content_types:
            return 'visual'
        type_counts = Counter(content_types)
        if type_counts.get('video', 0) > type_counts.get('article', 0):
            return 'visual'
        elif type_counts.get('audio', 0) > 0:
            return 'auditory'
        elif type_counts.get('quiz', 0) > type_counts.get('article', 0):
            return 'kinesthetic'
        else:
            return 'reading'
