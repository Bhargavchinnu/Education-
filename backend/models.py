from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role
        }

class StudentProfile(db.Model):
    __tablename__ = "student_profiles"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    learning_style = db.Column(db.String(50))
    difficulty_level = db.Column(db.String(20), default="beginner")
    total_points = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)

class Content(db.Model):
    __tablename__ = "contents"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content_type = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text)
    subject = db.Column(db.String(100))
    difficulty_level = db.Column(db.String(20))
    duration = db.Column(db.Integer)

class UserInteraction(db.Model):
    __tablename__ = "user_interactions"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("student_profiles.id"), nullable=False)
    content_id = db.Column(db.Integer, db.ForeignKey("contents.id"), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    rating = db.Column(db.Integer)
    time_spent = db.Column(db.Integer)
