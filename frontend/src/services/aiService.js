import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with auth header
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const aiService = {
    async chatWithAgent(message, history = []) {
        try {
            const response = await api.post('/chat', { message, history });
            return {
                response: response.data.response,
                userId: response.data.user_id
            };
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    },

    async analyzeLearningStyle(text) {
        try {
            const response = await api.post('/learning-style', { text });
            return response.data;
        } catch (error) {
            console.error('Learning style analysis error:', error);
            throw error;
        }
    },

    async getRecommendations(interests, availableContent) {
        try {
            const response = await api.post('/recommendations', {
                interests,
                available_content: availableContent
            });
            return {
                recommendations: response.data.recommendations,
                userId: response.data.user_id
            };
        } catch (error) {
            console.error('Recommendations error:', error);
            throw error;
        }
    },

    async summarizeContent(text, maxLength = 150) {
        try {
            const response = await api.post('/summarize', { text, max_length: maxLength });
            return response.data.summary;
        } catch (error) {
            console.error('Summarization error:', error);
            throw error;
        }
    },

    async askQuestion(context, question) {
        try {
            const response = await api.post('/qa', { context, question });
            return response.data;
        } catch (error) {
            console.error('Question answering error:', error);
            throw error;
        }
    }
};