import os
from datetime import timedelta


class Config:
    """Load configuration from environment with sane defaults for dev.

    This allows Vercel environment variables to control production settings
    while keeping sqlite for local development when DATABASE_URL is not set.
    """
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-key")
    # Use DATABASE_URL if provided, otherwise fallback to sqlite for local dev
    # If DATABASE_URL is provided and looks like a postgres URL, prefer a pg8000-based
    # SQLAlchemy URL to avoid binary drivers on serverless platforms.
    database_url = os.environ.get("DATABASE_URL", None)
    if database_url and database_url.startswith("postgres://"):
        # SQLAlchemy prefers the 'postgresql+pg8000://' driver name
        SQLALCHEMY_DATABASE_URI = database_url.replace("postgres://", "postgresql+pg8000://", 1)
    else:
        SQLALCHEMY_DATABASE_URI = database_url or "sqlite:///app.db"
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
