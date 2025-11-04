import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { api } from '../../services/api';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Star,
    Clock,
    BookOpen,
    Download,
    Share2,
    ThumbsUp,
    MessageCircle
} from 'lucide-react';

const ContentView = ({ contentId }) => {
    const [content, setContent] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState('');

    const { user } = useAuth();
    const { speak } = useAccessibility();

    useEffect(() => {
        if (contentId) {
            fetchContent();
        }
    }, [contentId]);

    const fetchContent = async () => {
        try {
            const response = await api.get(`/content/${contentId}`);
            setContent(response.data.content);
            setQuiz(response.data.quiz);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        speak(isPlaying ? 'Paused' : 'Playing');
    };

    const handleSeek = (newTime) => {
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        speak(isMuted ? 'Unmuted' : 'Muted');
    };

    const handleComplete = async () => {
        try {
            await api.post(`/content/${contentId}/interact`, {
                completed: true,
                time_spent: Math.floor(currentTime)
            });
            setCompleted(true);
            speak('Content completed! Great job!');
        } catch (error) {
            console.error('Error marking content complete:', error);
        }
    };

    const handleRating = async (newRating) => {
        try {
            await api.post(`/content/${contentId}/interact`, {
                rating: newRating
            });
            setRating(newRating);
            speak(`Rated ${newRating} stars`);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="content-loading">
                <div className="loading-spinner"></div>
                <p>Loading content...</p>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="content-error">
                <h2>Content Not Found</h2>
                <p>The requested content could not be found.</p>
            </div>
        );
    }

    return (
        <motion.div
            className="content-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Content Header */}
            <motion.div
                className="content-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="content-meta">
                    <span className={`difficulty-badge ${content.difficulty_level}`}>
                        {content.difficulty_level}
                    </span>
                    <span className="subject-badge">{content.subject}</span>
                    <span className="type-badge">{content.content_type}</span>
                </div>
                <h1>{content.title}</h1>
                <p className="content-description">{content.description}</p>
            </motion.div>

            {/* Video Player */}
            {content.content_type === 'video' && (
                <motion.div
                    className="video-player-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="video-player">
                        <div className="video-placeholder">
                            <Play size={64} />
                            <p>Video Player</p>
                            <small>Video content would play here</small>
                        </div>

                        {/* Custom Controls */}
                        <div className="video-controls">
                            <button
                                className="control-btn play-pause"
                                onClick={handlePlayPause}
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                            </button>

                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                ></div>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={currentTime}
                                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                                    className="progress-input"
                                />
                            </div>

                            <div className="time-display">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>

                            <div className="volume-controls">
                                <button
                                    className="control-btn"
                                    onClick={toggleMute}
                                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                                >
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                    className="volume-slider"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Article Content */}
            {content.content_type === 'article' && (
                <motion.div
                    className="article-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="article-body">
                        <p>This is where the article content would be displayed. Rich text formatting, images, and interactive elements would be rendered here.</p>

                        <h3>Key Learning Points</h3>
                        <ul>
                            <li>Important concept 1</li>
                            <li>Important concept 2</li>
                            <li>Important concept 3</li>
                        </ul>

                        <h3>Practice Exercise</h3>
                        <div className="exercise-placeholder">
                            <p>Interactive exercise would be embedded here</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Quiz Section */}
            {quiz && (
                <motion.div
                    className="quiz-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3>Knowledge Check</h3>
                    <div className="quiz-placeholder">
                        <p>Interactive quiz would be displayed here</p>
                        <button className="btn-primary">Start Quiz</button>
                    </div>
                </motion.div>
            )}

            {/* Completion and Rating */}
            <motion.div
                className="content-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                {!completed ? (
                    <button
                        className="btn-success complete-btn"
                        onClick={handleComplete}
                    >
                        <CheckCircle size={20} />
                        Mark as Complete
                    </button>
                ) : (
                    <div className="completion-status">
                        <CheckCircle size={20} className="completed-icon" />
                        <span>Completed!</span>
                    </div>
                )}

                <div className="rating-section">
                    <label>Rate this content:</label>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className={`star ${rating >= star ? 'active' : ''}`}
                                onClick={() => handleRating(star)}
                                aria-label={`Rate ${star} stars`}
                            >
                                <Star size={24} />
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Notes Section */}
            <motion.div
                className="notes-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <h3>My Notes</h3>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your notes about this content..."
                    rows={4}
                />
                <button className="btn-secondary">Save Notes</button>
            </motion.div>

            {/* Related Actions */}
            <motion.div
                className="related-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <button className="action-btn">
                    <Download size={20} />
                    Download Materials
                </button>
                <button className="action-btn">
                    <Share2 size={20} />
                    Share
                </button>
                <button className="action-btn">
                    <ThumbsUp size={20} />
                    Like
                </button>
                <button className="action-btn">
                    <MessageCircle size={20} />
                    Discuss
                </button>
            </motion.div>
        </motion.div>
    );
};

export default ContentView;
