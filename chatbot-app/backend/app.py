# app.py

import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
from constants import DEFAULT_MODEL, DEFAULT_SYSTEM_PROMPT, MAX_TOKENS, TEMPERATURE, ERROR_MESSAGES
from validation import validate_chat_input

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    filename='chatbot.log',
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
)

# Init Flask app
app = Flask(__name__)
CORS(app)

# Load API key securely
API_KEY = os.getenv("OPENROUTER_API_KEY")
REFERER = os.getenv("REFERER_URL")
APP_TITLE = os.getenv("APP_TITLE")

if not API_KEY:
    raise ValueError("OPENROUTER_API_KEY is not set in .env")

# Initialize OpenAI client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY
)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    is_valid, error_msg = validate_chat_input(data)

    if not is_valid:
        logging.warning(f"Validation failed: {error_msg}")
        return jsonify({"error": error_msg}), 400

    try:
        messages = [
            {"role": "system", "content": DEFAULT_SYSTEM_PROMPT},
            {"role": "user", "content": data["message"]}
        ]

        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": REFERER,
                "X-Title": APP_TITLE,
            },
            model=DEFAULT_MODEL,
            messages=messages,
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKENS,
        )

        reply = completion.choices[0].message.content
        logging.info(f"User: {data['message']} | Bot: {reply}")
        return jsonify({"reply": reply})

    except Exception as e:
        logging.error(f"API Error: {str(e)}")
        return jsonify({"error": ERROR_MESSAGES["openai_failure"]}), 500

if __name__ == "__main__":
    app.run(debug=True)
