from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Example: load a text-generation pipeline. This will download a model and may
# require large disk/memory. Use a small model for testing (distilgpt2) or a
# GPU-enabled host for larger models.
generator = None


def get_generator():
    global generator
    if generator is None:
        generator = pipeline('text-generation', model='distilgpt2')
    return generator


@app.route('/infer', methods=['POST'])
def infer():
    data = request.get_json() or {}
    text = data.get('input', '')
    if not text:
        return jsonify({'error': 'input required'}), 400
    gen = get_generator()
    out = gen(text, max_length=100, num_return_sequences=1)
    return jsonify(out)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
