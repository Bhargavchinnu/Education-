import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import {
    Menu,
    X,
    User,
    Settings,
    LogOut,
    Home,
    BookOpen,
    BarChart3,
    Users,
    GraduationCap,
    Accessibility
} from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, logout, isStudent, isTeacher, isAdmin } = useAuth();
    const { speak } = useAccessibility();

    const navigationItems = [
        { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['student', 'teacher', 'admin'] },
        { path: '/content', label: 'Content', icon: BookOpen, roles: ['student', 'teacher', 'admin'] },
        { path: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['teacher', 'admin'] },
        { path: '/students', label: 'Students', icon: Users, roles: ['teacher', 'admin'] },
        { path: '/admin', label: 'Admin', icon: Settings, roles: ['admin'] },
    ];

    const filteredItems = navigationItems.filter(item =>
        item.roles.includes(user?.role)
    );

    const handleLogout = () => {
        speak('Logging out');
        logout();
        setIsUserMenuOpen(false);
        setIsMenuOpen(false);
    };

    const handleNavigation = (path, label) => {
        speak(`Navigating to ${label}`);
        window.location.href = path;
        setIsMenuOpen(false);
    };

    return (
        <motion.nav
            className="navbar"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="navbar-container">
                <motion.div
                    className="navbar-brand"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation('/dashboard', 'Dashboard')}
                >
                    <GraduationCap size={32} className="brand-icon" />
                    <span className="brand-text">EduRecommender</span>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="navbar-menu desktop-menu">
                    {filteredItems.map((item) => (
                        <motion.button
                            key={item.path}
                            className="nav-item"
                            onClick={() => handleNavigation(item.path, item.label)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </motion.button>
                    ))}
                </div>

                {/* User Menu */}
                <div className="navbar-user">
                    <motion.button
                        className="accessibility-btn"
                        onClick={() => handleNavigation('/accessibility', 'Accessibility Settings')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Accessibility Settings"
                    >
                        <Accessibility size={20} />
                    </motion.button>

                    <motion.div className="user-menu-container">
                        <motion.button
                            className="user-menu-trigger"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <User size={20} />
                            <span className="user-name">{user?.username}</span>
                        </motion.button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    className="user-dropdown"
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            <User size={24} />
                                        </div>
                                        <div className="user-details">
                                            <div className="user-display-name">{user?.username}</div>
                                            <div className="user-role">{user?.role}</div>
                                        </div>
                                    </div>

                                    <div className="dropdown-divider"></div>

                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            handleNavigation('/profile', 'Profile');
                                            setIsUserMenuOpen(false);
                                        }}
                                    >
                                        <User size={16} />
                                        <span>Profile</span>
                                    </button>

                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            handleNavigation('/settings', 'Settings');
                                            setIsUserMenuOpen(false);
                                        }}
                                    >
                                        <Settings size={16} />
                                        <span>Settings</span>
                                    </button>

                                    <div className="dropdown-divider"></div>

                                    <button
                                        className="dropdown-item logout"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mobile-menu-content">
                            {filteredItems.map((item, index) => (
                                <motion.button
                                    key={item.path}
                                    className="mobile-nav-item"
                                    onClick={() => handleNavigation(item.path, item.label)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
