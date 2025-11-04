import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { api } from '../../services/api';
import {
    TrendingUp,
    Award,
    Target,
    Calendar,
    Clock,
    BookOpen,
    CheckCircle,
    Star,
    Trophy,
    Flame
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Progress = () => {
    const [progressData, setProgressData] = useState(null);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { speak } = useAccessibility();

    useEffect(() => {
        fetchProgressData();
    }, []);

    const fetchProgressData = async () => {
        try {
            const [progressRes, badgesRes] = await Promise.all([
                api.get('/analytics/progress'),
                api.get('/users/badges')
            ]);

            setProgressData(progressRes.data);
            setBadges(badgesRes.data.badges || []);
        } catch (error) {
            console.error('Error fetching progress data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mock data for charts
    const dailyProgress = [
        { date: '2024-01-01', minutes: 45 },
        { date: '2024-01-02', minutes: 60 },
        { date: '2024-01-03', minutes: 30 },
        { date: '2024-01-04', minutes: 75 },
        { date: '2024-01-05', minutes: 90 },
        { date: '2024-01-06', minutes: 45 },
        { date: '2024-01-07', minutes: 60 }
    ];

    const subjectProgress = [
        { subject: 'Math', completed: 8, total: 10 },
        { subject: 'Science', completed: 6, total: 8 },
        { subject: 'English', completed: 12, total: 15 },
        { subject: 'History', completed: 4, total: 6 }
    ];

    const skillDistribution = [
        { name: 'Problem Solving', value: 85, color: '#8884d8' },
        { name: 'Critical Thinking', value: 72, color: '#82ca9d' },
        { name: 'Communication', value: 90, color: '#ffc658' },
        { name: 'Research', value: 68, color: '#ff7c7c' }
    ];

    const achievements = [
        { id: 1, title: 'First Steps', description: 'Completed your first lesson', icon: '🎯', earned: true },
        { id: 2, title: 'Quick Learner', description: 'Completed 5 lessons in one day', icon: '⚡', earned: true },
        { id: 3, title: 'Knowledge Seeker', description: 'Spent 10 hours learning', icon: '📚', earned: true },
        { id: 4, title: 'Perfect Score', description: 'Got 100% on a quiz', icon: '⭐', earned: false },
        { id: 5, title: 'Streak Master', description: '7-day learning streak', icon: '🔥', earned: false }
    ];

    if (loading) {
        return (
            <div className="progress-loading">
                <div className="loading-spinner"></div>
                <p>Loading your progress...</p>
            </div>
        );
    }

    return (
        <motion.div
            className="progress-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="progress-header">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Your Learning Progress
                </motion.h1>
                <motion.p
                    className="progress-subtitle"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Track your achievements and growth
                </motion.p>
            </div>

            {/* Overview Stats */}
            <motion.div
                className="progress-overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="overview-cards">
                    <div className="overview-card">
                        <div className="card-icon blue">
                            <BookOpen size={32} />
                        </div>
                        <div className="card-content">
                            <h3>24</h3>
                            <p>Lessons Completed</p>
                        </div>
                    </div>
                    <div className="overview-card">
                        <div className="card-icon green">
                            <Clock size={32} />
                        </div>
                        <div className="card-content">
                            <h3>42h</h3>
                            <p>Time Spent</p>
                        </div>
                    </div>
                    <div className="overview-card">
                        <div className="card-icon gold">
                            <Trophy size={32} />
                        </div>
                        <div className="card-content">
                            <h3>Level 5</h3>
                            <p>Current Level</p>
                        </div>
                    </div>
                    <div className="overview-card">
                        <div className="card-icon purple">
                            <Flame size={32} />
                        </div>
                        <div className="card-content">
                            <h3>7</h3>
                            <p>Day Streak</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Charts Section */}
            <div className="progress-charts">
                <motion.div
                    className="chart-container"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3>Daily Learning Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyProgress}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="minutes"
                                stroke="#667eea"
                                strokeWidth={3}
                                dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    className="chart-container"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3>Subject Progress</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={subjectProgress}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subject" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="completed" fill="#82ca9d" />
                            <Bar dataKey="total" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Skills Distribution */}
            <motion.div
                className="skills-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <h3>Skills Development</h3>
                <div className="skills-content">
                    <div className="skills-chart">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={skillDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {skillDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="skills-list">
                        {skillDistribution.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                className="skill-item"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <div className="skill-name">{skill.name}</div>
                                <div className="skill-bar">
                                    <div
                                        className="skill-fill"
                                        style={{ width: `${skill.value}%`, backgroundColor: skill.color }}
                                    ></div>
                                </div>
                                <div className="skill-value">{skill.value}%</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
                className="achievements-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
            >
                <h3>Achievements & Badges</h3>
                <div className="achievements-grid">
                    {achievements.map((achievement, index) => (
                        <motion.div
                            key={achievement.id}
                            className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 + index * 0.1 }}
                            onClick={() => speak(achievement.earned ? `Earned: ${achievement.title}` : `Locked: ${achievement.title}`)}
                        >
                            <div className="achievement-icon">
                                {achievement.earned ? achievement.icon : '🔒'}
                            </div>
                            <div className="achievement-content">
                                <h4>{achievement.title}</h4>
                                <p>{achievement.description}</p>
                            </div>
                            {achievement.earned && (
                                <div className="earned-badge">
                                    <Award size={16} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Goals Section */}
            <motion.div
                className="goals-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
            >
                <h3>Learning Goals</h3>
                <div className="goals-list">
                    <div className="goal-item">
                        <div className="goal-icon">
                            <Target size={24} />
                        </div>
                        <div className="goal-content">
                            <h4>Complete 30 lessons this month</h4>
                            <div className="goal-progress">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '80%' }}></div>
                                </div>
                                <span>24/30 completed</span>
                            </div>
                        </div>
                    </div>
                    <div className="goal-item">
                        <div className="goal-icon">
                            <Clock size={24} />
                        </div>
                        <div className="goal-content">
                            <h4>Spend 50 hours learning</h4>
                            <div className="goal-progress">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '84%' }}></div>
                                </div>
                                <span>42/50 hours</span>
                            </div>
                        </div>
                    </div>
                    <div className="goal-item">
                        <div className="goal-icon">
                            <Star size={24} />
                        </div>
                        <div className="goal-content">
                            <h4>Maintain 95% quiz average</h4>
                            <div className="goal-progress">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '96%' }}></div>
                                </div>
                                <span>96% average</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Progress;
