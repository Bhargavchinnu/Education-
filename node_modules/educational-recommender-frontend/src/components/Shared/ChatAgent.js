import React, { useState, useRef, useEffect } from 'react';
import './ChatAgent.css';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../../services/aiService';

const ChatAgent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [learningStyle, setLearningStyle] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Get chat response
            const response = await aiService.chatWithAgent(input);
            
            // Analyze learning style
            const styleAnalysis = await aiService.analyzeLearningStyle(input);
            if (styleAnalysis.style !== learningStyle) {
                setLearningStyle(styleAnalysis.style);
            }

            // Add agent response
            const agentMessage = {
                text: response,
                sender: 'agent',
                style: styleAnalysis.style
            };
            setMessages(prev => [...prev, agentMessage]);
        } catch (error) {
            console.error('Error in chat:', error);
            const errorMessage = {
                text: "I'm having trouble connecting right now. Please try again later.",
                sender: 'agent',
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="chat-agent">
            <motion.button 
                className="chat-toggle"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? '✕' : '💬'}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="chat-window"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="chat-header">
                            <h3>AI Learning Assistant</h3>
                            {learningStyle && (
                                <div className="learning-style-badge">
                                    {learningStyle}
                                </div>
                            )}
                        </div>
                        
                        <div className="chat-messages">
                            <AnimatePresence>
                                {messages.map((msg, idx) => (
                                    <motion.div 
                                        key={idx} 
                                        className={'message ' + msg.sender + (msg.isError ? ' error' : '')}
                                        initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 50 }}
                                    >
                                        {msg.text}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isTyping && (
                                <motion.div 
                                    className="typing-indicator"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <motion.form 
                            onSubmit={handleSubmit} 
                            className="chat-input"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                            />
                            <motion.button 
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Send
                            </motion.button>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatAgent;