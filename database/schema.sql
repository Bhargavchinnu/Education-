CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    learning_style VARCHAR(50),
    difficulty_level VARCHAR(20) DEFAULT "beginner",
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    content_type VARCHAR(20) NOT NULL,
    description TEXT,
    subject VARCHAR(100),
    difficulty_level VARCHAR(20),
    duration INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    completed BOOLEAN DEFAULT 0,
    rating INTEGER,
    time_spent INTEGER,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id),
    FOREIGN KEY (content_id) REFERENCES contents(id)
);
