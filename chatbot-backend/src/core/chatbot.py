"""
Chatbot orchestration.

- Instantiates the LLM (if creds available)
- Builds retriever, content_generator, analyzer
- Exposes run_educational_assistant(...) that API and LangServe can call.
"""

from typing import Dict, Any, Optional
import os
import logging
import requests
import json
from pydantic import BaseModel, Field, ValidationError
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up logging for this module
logger = logging.getLogger(__name__)

# --- ENVIRONMENT-BASED CONFIGURATION ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL_NAME = os.getenv("GROQ_MODEL_NAME")  # Default fallback

if not GROQ_API_KEY:
    logger.error("GROQ_API_KEY not found in environment variables!")
    raise ValueError("GROQ_API_KEY must be set in environment variables or .env file")

logger.info(f"Using Groq model: {GROQ_MODEL_NAME}")

try:
    from .components import EducationalRetriever, LearningAnalyzer
except ImportError:
    from components import EducationalRetriever, LearningAnalyzer

try:
    from langsmith import traceable
except ImportError:
    def traceable(*_args, **_kwargs):
        def deco(fn):
            return fn
        return deco

# Define the structure for quiz questions
class QuizQuestion(BaseModel):
    question: str = Field(description="The quiz question text.")
    options: list[Dict[str, str]] = Field(description="A list of possible answers, each with a label (e.g., 'A', 'B') and text.")
    correct_label: str = Field(description="The label of the correct option (e.g., 'A').")
    explanation: str = Field(description="A brief explanation of why the correct answer is right.")

# Define the structure for the complete quiz
class Quiz(BaseModel):
    title: str = Field(description="The title of the quiz.")
    topic: str = Field(description="The topic covered in the quiz.")
    level: str = Field(description="The difficulty level of the quiz (e.g., 'beginner', 'intermediate', 'advanced').")
    questions: list[QuizQuestion] = Field(description="A list of quiz questions.")

# --- Function to call the Groq API directly ---
def call_groq_api(prompt: str) -> Optional[str]:
    """
    Makes a direct API call to the Groq LLM using the requests library.
    """
    if not GROQ_API_KEY:
        logger.error("Groq API key is not available")
        return "[LLM or Chain error: API key not set]"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    api_url = "https://api.groq.com/openai/v1/chat/completions"
    
    payload = {
        "model": GROQ_MODEL_NAME,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(api_url, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        response_json = response.json()
        
        if response_json and 'choices' in response_json and response_json['choices']:
            return response_json['choices'][0]['message']['content']
        else:
            logger.error("Groq API response did not contain a valid completion.")
            return None
            
    except requests.exceptions.HTTPError as errh:
        logger.error(f"HTTP Error: {errh}")
        logger.error(f"Response Content: {errh.response.text}")
        return f"[LLM or Chain error: HTTP Error: {errh} - {errh.response.text}]"
    except requests.exceptions.RequestException as err:
        logger.error(f"An unexpected error occurred: {err}")
        return f"[LLM or Chain error: An unexpected error occurred: {err}]"
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        return f"[LLM or Chain error: An unexpected error occurred: {e}]"


class ContentGenerator:
    """A class to generate educational content using a language model."""
    def __init__(self, llm_caller):
        # Store the function that calls the LLM, to be used later
        self.llm_caller = llm_caller
        self.quiz_prompt_template = """
        You are an expert quiz generator. Your task is to create a quiz based on a provided topic.
        The quiz must have 5 questions, each with 4 multiple-choice options (A, B, C, D).
        One of the options must be correct.
        Provide a brief explanation for the correct answer.
        The output must be a JSON object that strictly adheres to the provided Pydantic `Quiz` schema.

        Topic: {topic}
        """
        self.answer_prompt_template = """
        You are an educational assistant. Your task is to provide a concise and clear explanation
        for the following query. Keep the response to a single paragraph.

        Query: {query}
        """

    def generate_quiz(self, topic: str) -> Quiz:
        prompt = self.quiz_prompt_template.format(topic=topic)
        response_text = self.llm_caller(prompt)
        
        if response_text and response_text.strip().startswith('{') and response_text.strip().endswith('}'):
            try:
                quiz_data = json.loads(response_text)
                return Quiz.parse_obj(quiz_data)
            except (json.JSONDecodeError, ValidationError) as e:
                logger.error(f"Failed to parse quiz JSON: {e}")
                return Quiz(
                    title="Error Quiz",
                    topic=topic,
                    level="beginner",
                    questions=[
                        QuizQuestion(
                            question=f"[LLM or Chain error: Failed to parse quiz JSON. Details: {str(e)}]",
                            options=[{"label": "A", "text": "Error"}, {"label": "B", "text": "Error"}],
                            correct_label="A",
                            explanation="The response was not valid JSON."
                        )
                    ]
                )
        else:
            return Quiz(
                title="Error Quiz",
                topic=topic,
                level="beginner",
                questions=[
                    QuizQuestion(
                        question=f"[LLM or Chain error: Received a non-JSON or invalid response: {response_text}]",
                        options=[{"label": "A", "text": "Error"}, {"label": "B", "text": "Error"}],
                        correct_label="A",
                        explanation="The LLM did not return a valid JSON object as expected."
                    )
                ]
            )

    def answer_generator(self, query: str) -> str:
        prompt = self.answer_prompt_template.format(query=query)
        response_text = self.llm_caller(prompt)
        return response_text if response_text else "[LLM or Chain error: No response from LLM]"

# --- Main application logic starts here ---
# Initialize content generator and analyzer
try:
    from .data_handlers import retriever
except ImportError:
    retriever = None

educational_retriever = EducationalRetriever(retriever) if retriever is not None else None
content_generator = ContentGenerator(llm_caller=call_groq_api)
analyzer = LearningAnalyzer()


@traceable(run_type="chain")
def run_educational_assistant(
    request: str,
    user_id: str,
    analyzer: LearningAnalyzer,
    is_instructor: bool = False
) -> Dict[str, Any]:
    """
    Main entrypoint for the educational assistant flow:
    - detect intent (quiz vs tutoring) using a small heuristic or the LLM if available
    - produce structured output
    - log analytics via analyzer
    """
    user_intent = None
    try:
        lowered = (request or "").lower()
        if any(k in lowered for k in ["quiz", "test", "mcq", "multiple choice"]):
            user_intent = "QUIZ"
        else:
            user_intent = "TUTORING"

        if user_intent == "QUIZ":
            quiz = content_generator.generate_quiz(request)
            output_content = quiz.dict()
            content_type = "QUIZ"
            performance = "quiz_requested"
        else:
            answer = content_generator.answer_generator(request)
            output_content = {"text": answer}
            content_type = "TUTORING"
            performance = "tutoring_requested"

        try:
            analyzer.log_performance(user_id, request, performance)
        except Exception:
            logger.warning("Warning: analyzer.log_performance failed")

        try:
            updated_profile = analyzer.get_profile(user_id)
        except Exception:
            updated_profile = {}

        response = {
            "user_type": "Instructor" if is_instructor else "Student",
            "content_type": content_type,
            "output": output_content,
            "updated_profile": updated_profile
        }
        return response

    except Exception as e:
        logger.error(f"Error in run_educational_assistant: {e}")
        return {
            "error": "execution_failed",
            "details": str(e)
        }