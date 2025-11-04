import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { api } from '../../services/api';
import {
    BookOpen,
    Trophy,
    Clock,
    TrendingUp,
    PlayCircle,
    CheckCircle,
    Star,
    Target,
    Calendar,
    Award
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { speak } = useAccessibility();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, recsRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/recommendations')
            ]);

            setStats(statsRes.data);
            setRecommendations(recsRes.data.recommendations || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Content',
            value: stats?.statistics?.total_content || 0,
            icon: BookOpen,
            color: 'blue',
            description: 'Content items available'
        },
        {
            title: 'Completed',
            value: stats?.statistics?.completed_content || 0,
            icon: CheckCircle,
            color: 'green',
            description: 'Content completed'
        },
        {
            title: 'Time Spent',
            value: `${stats?.statistics?.total_time_minutes || 0} min`,
            icon: Clock,
            color: 'purple',
            description: 'Learning time this week'
        },
        {
            title: 'Current Level',
            value: stats?.profile?.level || 1,
            icon: Trophy,
            color: 'gold',
            description: 'Your progress level'
        }
    ];

    const quickActions = [
        {
            title: 'Continue Learning',
            description: 'Pick up where you left off',
            icon: PlayCircle,
            action: () => speak('Continue learning feature coming soon'),
            color: 'blue'
        },
        {
            title: 'Take Quiz',
            description: 'Test your knowledge',
            icon: Target,
            action: () => speak('Quiz feature coming soon'),
            color: 'green'
        },
        {
            title: 'View Progress',
            description: 'Check your achievements',
            icon: TrendingUp,
            action: () => speak('Progress view coming soon'),
            color: 'purple'
        },
        {
            title: 'Daily Goals',
            description: 'Set learning objectives',
            icon: Calendar,
            action: () => speak('Goals feature coming soon'),
            color: 'orange'
        }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <motion.div
            className="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="dashboard-header">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Welcome back, {user?.username}!
                </motion.h1>
                <motion.p
                    className="dashboard-subtitle"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Ready to continue your learning journey?
                </motion.p>
            </div>

            {/* Stats Cards */}
            <motion.div
                className="stats-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        className={`stat-card ${stat.color}`}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        onClick={() => speak(`${stat.title}: ${stat.value} ${stat.description}`)}
                    >
                        <div className="stat-icon">
                            <stat.icon size={32} />
                        </div>
                        <div className="stat-content">
                            <h3>{stat.value}</h3>
                            <p>{stat.title}</p>
                            <span className="stat-description">{stat.description}</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="dashboard-content">
                {/* Quick Actions */}
                <motion.section
                    className="dashboard-section"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2>Quick Actions</h2>
                    <div className="quick-actions-grid">
                        {quickActions.map((action, index) => (
                            <motion.button
                                key={action.title}
                                className={`quick-action-card ${action.color}`}
                                onClick={action.action}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                            >
                                <div className="action-icon">
                                    <action.icon size={24} />
                                </div>
                                <div className="action-content">
                                    <h4>{action.title}</h4>
                                    <p>{action.description}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.section>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <motion.section
                        className="dashboard-section"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <h2>Recommended for You</h2>
                        <div className="recommendations-list">
                            {recommendations.slice(0, 3).map((rec, index) => (
                                <motion.div
                                    key={rec.id}
                                    className="recommendation-card"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 + index * 0.1 }}
                                    onClick={() => speak(`Recommended: ${rec.title}`)}
                                >
                                    <div className="rec-content">
                                        <h4>{rec.title}</h4>
                                        <p>{rec.description?.substring(0, 100)}...</p>
                                        <div className="rec-meta">
                                            <span className="difficulty">{rec.difficulty_level}</span>
                                            <span className="subject">{rec.subject}</span>
                                        </div>
                                    </div>
                                    <div className="rec-actions">
                                        <button className="btn-primary">Start Learning</button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Recent Activity */}
                <motion.section
                    className="dashboard-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                >
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">
                                <BookOpen size={20} />
                            </div>
                            <div className="activity-content">
                                <p>Started learning "Introduction to Python"</p>
                                <span className="activity-time">2 hours ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">
                                <CheckCircle size={20} />
                            </div>
                            <div className="activity-content">
                                <p>Completed "Basic Algebra Quiz"</p>
                                <span className="activity-time">1 day ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">
                                <Award size={20} />
                            </div>
                            <div className="activity-content">
                                <p>Earned "Quick Learner" badge</p>
                                <span className="activity-time">3 days ago</span>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
};

export default Dashboard;
