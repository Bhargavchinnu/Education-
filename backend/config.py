import os
from datetime import timedelta

class Config:
    SECRET_KEY = 'dev-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    JWT_SECRET_KEY = 'jwt-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
