import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=== Environment Variable Debug ===")
print(f"GROQ_API_KEY: {os.getenv('GROQ_API_KEY', 'NOT SET')[:20]}...")
print(f"GROQ_MODEL_NAME: '{os.getenv('GROQ_MODEL_NAME', 'NOT SET')}'")
print(f"Length of model name: {len(os.getenv('GROQ_MODEL_NAME', ''))}")

# Test if there are any hidden characters
model_name = os.getenv('GROQ_MODEL_NAME', '')
print(f"Model name as bytes: {model_name.encode()}")