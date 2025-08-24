"""
Chatbot orchestration.

- Instantiates the LLM (if creds available)
- Builds retriever, content_generator, analyzer
- Exposes run_educational_assistant(...) that your API and LangServe can call.
"""

from typing import Dict, Any
import os

try:
    from .components import EducationalRetriever, LearningAnalyzer
except Exception:
    from components import EducationalRetriever, LearningAnalyzer  



from .services.educational_assistant import ContentGenerator


try:
    from langchain_groq import ChatGroq
except Exception:
    ChatGroq = None


try:
    from langsmith import traceable
except Exception:

    def traceable(*_args, **_kwargs):
        def deco(fn):
            return fn
        return deco

from dotenv import load_dotenv
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


# Initialize LLM 
llm = None
if ChatGroq is not None and GROQ_API_KEY:
    try:
        llm = ChatGroq(
            model="openai/gpt-oss-20b",
            temperature=0.7,
            reasoning_effort="medium",
            api_key=GROQ_API_KEY
        )
    except Exception:
        llm = None


# Initialize retriever, generator, analyzer
try:
    from .data_handlers import retriever
except Exception:
    retriever = None

educational_retriever = EducationalRetriever(retriever) if retriever is not None else None
content_generator = ContentGenerator(llm=llm, retriever=educational_retriever)
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
        if llm is not None:
         pass
        # Keyword-based heuristic (robust enough for quick testing)
        lowered = (request or "").lower()
        if any(k in lowered for k in ["quiz", "test", "mcq", "multiple choice"]):
            user_intent = "QUIZ"
        elif any(k in lowered for k in ["explain", "teach", "flashcard", "flashcards", "tutor"]):
            user_intent = "TUTORING"
        else:
            # default to tutoring
            user_intent = "TUTORING"

        if user_intent == "QUIZ":
            # produce a quiz (structured)
            quiz = content_generator.generate_quiz(request)  # flexible: uses request to derive topic
            output_content = quiz.dict()
            content_type = "QUIZ"
            performance = "quiz_requested"
        else:
            # tutoring / answer generation
            answer = content_generator.answer_generator(request)
            output_content = {"text": answer}
            content_type = "TUTORING"
            performance = "tutoring_requested"

        # log user performance / action
        try:
            analyzer.log_performance(user_id, request, performance)
        except Exception:
            # analyzer failures shouldn't crash the assistant — swallow with a debug print
            print("Warning: analyzer.log_performance failed")

        # get updated profile
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
        # Return structured error for the API layer to convert to HTTP
        return {
            "error": "execution_failed",
            "details": str(e)
        }
