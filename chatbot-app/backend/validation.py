# validation.py

from constants import ERROR_MESSAGES

def validate_chat_input(data):
    if "message" not in data or not data["message"].strip():
        return False, ERROR_MESSAGES["missing_input"]
    return True, ""
