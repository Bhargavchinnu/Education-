from flask import Blueprint, request, jsonify, current_app
import requests
import os

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")

HF_API_URL = "https://api-inference.huggingface.co/models/"
HF_API_KEY = os.environ.get("HF_API_KEY")


def call_hf_model(model: str, payload: dict, timeout: int = 30):
    """Call Hugging Face Inference API for a given model.

    Returns parsed JSON or raises requests.HTTPError.
    """
    if not HF_API_KEY:
        raise RuntimeError("HF_API_KEY not configured")
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    url = HF_API_URL + model
    resp = requests.post(url, headers=headers, json=payload, timeout=timeout)
    resp.raise_for_status()
    return resp.json()


@ai_bp.route("/chat", methods=["POST"])
def chat():
    """Simple chat endpoint that proxies to a Hugging Face conversational/generation model.

    Request JSON: { "model": "gpt2", "input": "Hello" }
    """
    try:
        data = request.get_json() or {}
        model = data.get("model", "gpt2")
        user_input = data.get("input", "")
        if not user_input:
            return jsonify({"error": "input is required"}), 400

        payload = {"inputs": user_input}
        result = call_hf_model(model, payload)

        # Normalize response for simple clients
        if isinstance(result, list) and result:
            output = result[0].get("generated_text") or str(result[0])
        else:
            output = str(result)

        return jsonify({"reply": output}), 200
    except requests.HTTPError as e:
        current_app.logger.error("HF request failed: %s", e)
        return jsonify({"error": "model inference failed", "details": str(e)}), 502
    except Exception as e:
        current_app.logger.exception("AI route error")
        return jsonify({"error": str(e)}), 500


@ai_bp.route("/models", methods=["GET"])
def models():
    """Return a short list of suggested models (informational)."""
    return jsonify({
        "suggested": [
            "gpt2",
            "microsoft/DialoGPT-medium",
            "distilgpt2",
            "facebook/bart-large-cnn"
        ]
    })
