import os
from datetime import timedelta


class Config:
    """Load configuration from environment with sane defaults for dev.

    This allows Vercel environment variables to control production settings
    while keeping sqlite for local development when DATABASE_URL is not set.
    """
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-key")
    # Use DATABASE_URL if provided, otherwise fallback to sqlite for local dev
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///app.db")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
