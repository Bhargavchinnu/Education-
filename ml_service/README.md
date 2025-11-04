This folder contains a scaffold for a standalone ML inference service you can deploy to Render, Railway, or any Docker host.

Notes:
- This is a scaffold. Running modern transformer models will require significant memory and possibly GPU.
- Use this service behind authentication and rate limiting in production.

Files:
- app.py: minimal Flask app exposing a /infer endpoint
- requirements.txt: contains transformer dependencies (heavy)
- Dockerfile: containerize the service
