import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const aiService = {
    async chatWithAgent(message) {
        try {
            const response = await axios.post(`${BASE_URL}/chat`, { message });
            return response.data.response;
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    },

    async analyzeLearningStyle(text) {
        try {
            const response = await axios.post(`${BASE_URL}/analyze-learning-style`, { text });
            return response.data;
        } catch (error) {
            console.error('Learning style analysis error:', error);
            throw error;
        }
    },

    async getRecommendations(interests, availableContent) {
        try {
            const response = await axios.post(`${BASE_URL}/get-recommendations`, {
                interests,
                available_content: availableContent
            });
            return response.data.recommendations;
        } catch (error) {
            console.error('Recommendations error:', error);
            throw error;
        }
    }
};