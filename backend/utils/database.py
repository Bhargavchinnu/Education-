from models import db
from flask import current_app

def init_db():
    with current_app.app_context():
        db.create_all()
        print("? Database initialized successfully")

def drop_db():
    with current_app.app_context():
        db.drop_all()
        print("? Database dropped successfully")

def reset_db():
    drop_db()
    init_db()
