# """
# FastAPI router with endpoints that call into the chatbot/run_educational_assistant.
# This file expects pydantic request/response models in src.core.schemas.chat_models.
# """

# from fastapi import APIRouter, HTTPException, Depends
# from typing import Any, Dict

# # Import your pydantic models (must already exist in your repo)
# from ..schemas.chat_models import (
#     ChatRequest,
#     ChatResponse,
#     ContentGenerateRequest,
#     ContentGenerateResponse,
#     AnalyticsResponse
# )

# # Import the chatbot runtime and objects
# from ..chatbot import run_educational_assistant, content_generator, analyzer as global_analyzer

# router = APIRouter()


# @router.post("/api/assistant/chat", response_model=ChatResponse)
# async def unified_conversation_interface(request: ChatRequest) -> ChatResponse:
#     """
#     Unified conversation endpoint: tutoring or quiz depending on the request.
#     """
#     try:
#         response_data = run_educational_assistant(
#             request=request.request_text,
#             user_id=request.user_id,
#             analyzer=global_analyzer,
#             is_instructor=request.is_instructor
#         )
#         # If the runtime returned an error dict, raise
#         if "error" in response_data:
#             raise Exception(response_data.get("details", "Unknown error"))
#         return ChatResponse(
#             user_id=request.user_id,
#             response_text=response_data.get("output"),
#             is_instructor=request.is_instructor
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"An internal error occurred: {e}")


# @router.post("/api/assistant/content/generate", response_model=ContentGenerateResponse)
# async def generate_specific_content(request: ContentGenerateRequest) -> ContentGenerateResponse:
#     """
#     Endpoint to generate quiz or flashcards explicitly.
#     Returns the structured content output.
#     """
#     try:
#         typ = request.request_type.lower()
#         if typ == "quiz":
#             quiz = content_generator.generate_quiz(request.subject, n=request.num_items, level=request.level)
#             content_value = quiz.dict()
#         elif typ in ("flashcard", "flashcards"):
#             cards = content_generator.generate_flashcards(request.subject, n=request.num_items, level=request.level)
#             content_value = [c.dict() for c in cards]
#         elif typ in ("practice", "practice_questions"):
#             qs = content_generator.generate_practice(request.subject, n=request.num_items, level=request.level)
#             content_value = [q.dict() for q in qs]
#         else:
#             raise HTTPException(status_code=400, detail="Invalid content type. Use 'quiz' or 'flashcard' or 'practice'.")

#         return ContentGenerateResponse(subject=request.subject, content=content_value)

#     except HTTPException as he:
#         raise he
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to generate content: {e}")


# @router.get("/analytics/{user_id}", response_model=AnalyticsResponse)
# async def get_analytics_for_user(user_id: str) -> AnalyticsResponse:
#     """
#     Retrieve user analytics/profile from the shared analyzer instance.
#     """
#     try:
#         profile = global_analyzer.get_profile(user_id)
#         if not profile:
#             raise HTTPException(status_code=404, detail="User not found.")
#         return AnalyticsResponse(
#             user_id=user_id,
#             completed_quizzes=profile.get("completed_quizzes", []),
#             struggling_topics=profile.get("struggling_topics", [])
#         )
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to fetch analytics: {e}")

"""
FastAPI router with endpoints that call into the chatbot/run_educational_assistant.
This file expects pydantic request/response models in src.core.schemas.chat_models.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Any, Dict, Optional

# Import your pydantic models (must already exist in your repo)
from ..schemas.chat_models import (
    ChatRequest,
    ChatResponse,
    ContentGenerateRequest,
    ContentGenerateResponse,
    AnalyticsResponse
)

# Import the chatbot runtime and objects
from ..chatbot import run_educational_assistant, content_generator, analyzer as global_analyzer
from ..components import LearningAnalyzer

router = APIRouter()


@router.post("/api/assistant/chat", response_model=ChatResponse)
async def unified_conversation_interface(request: ChatRequest) -> ChatResponse:
    """
    Unified conversation endpoint: tutoring or quiz depending on the request.
    """
    try:
        response_data = run_educational_assistant(
            request=request.request_text,
            user_id=request.user_id,
            analyzer=global_analyzer,
            is_instructor=request.is_instructor
        )
        # If the runtime returned an error dict, raise
        if "error" in response_data:
            raise Exception(response_data.get("details", "Unknown error"))

        # The output from run_educational_assistant is a structured dictionary,
        # which is what the frontend expects for the 'output' field.
        return ChatResponse(
            user_id=request.user_id,
            user_type=response_data.get("user_type", "student"),
            content_type=response_data.get("content_type", "text"),
            output=response_data.get("output"),
            updated_profile=response_data.get("updated_profile", {})
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {e}")


@router.post("/api/assistant/content/generate", response_model=ContentGenerateResponse)
async def generate_specific_content(request: ContentGenerateRequest) -> ContentGenerateResponse:
    """
    Endpoint to generate quiz or flashcards explicitly.
    Returns the structured content output.
    """
    try:
        typ = request.request_type.lower()
        if typ == "quiz":
            quiz = content_generator.generate_quiz(request.subject, n=request.num_items, level=request.level)
            content_value = quiz.dict()
        elif typ in ("flashcard", "flashcards"):
            cards = content_generator.generate_flashcards(request.subject, n=request.num_items, level=request.level)
            content_value = [c.dict() for c in cards]
        elif typ in ("practice", "practice_questions"):
            qs = content_generator.generate_practice(request.subject, n=request.num_items, level=request.level)
            content_value = [q.dict() for q in qs]
        else:
            raise HTTPException(status_code=400, detail="Invalid content type. Use 'quiz' or 'flashcard' or 'practice'.")

        return ContentGenerateResponse(subject=request.subject, content=content_value)

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {e}")


@router.get("/analytics/{user_id}", response_model=AnalyticsResponse)
async def get_analytics_for_user(user_id: str) -> AnalyticsResponse:
    """
    Retrieve user analytics/profile from the shared analyzer instance.
    """
    try:
        profile = global_analyzer.get_profile(user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="User not found.")
        return AnalyticsResponse(
            user_id=user_id,
            completed_quizzes=profile.get("completed_quizzes", []),
            struggling_topics=profile.get("struggling_topics", [])
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch analytics: {e}")
        
def get_next_curriculum_topic(user_id: str) -> Optional[str]:
    """
    Decide next curriculum topic based on the user's profile.
    """
    try:
        profile = global_analyzer.get_profile(user_id=user_id)
    except Exception as e:
        print(f"Warning: Failed to fetch profile for user {user_id}: {e}")
        return None

    if not profile:
        return None

    struggling = profile.get("struggling_topics") or []
    if struggling:
        return f"explain {struggling[0]} to me in detail."

    curriculum_topics = ["Langchain", "LLM reasoning", "Design"]
    completed_topics = profile.get("completed_quizzes") or []

    for topic in curriculum_topics:
        if topic not in completed_topics:
            return f"explain {topic} to me in detail."

    return None

@router.post("/api/assistant/adaptive_learning", response_model=ChatResponse)
async def get_adaptive_content(user_id: str):
    """
    Generate adaptive content for the next suggested curriculum topic for a user.
    """
    try:
        adaptive_request = get_next_curriculum_topic(user_id=user_id)
        if not adaptive_request:
            return ChatResponse(
                user_type="student",
                content_type="message",
                output={"text": "🎉 Congratulations! You have gone through the whole curriculum."},
                updated_profile=global_analyzer.get_profile(user_id=user_id) or {},
            )
        response_data = run_educational_assistant(
            request=adaptive_request,
            user_id=user_id,
            analyzer=global_analyzer,
            is_instructor=False,
        )
        if isinstance(response_data, dict) and response_data.get("error"):
            raise HTTPException(status_code=500, detail=response_data.get("details", "Internal error"))

        return ChatResponse(
            user_type=response_data.get("user_type", "student"),
            content_type=response_data.get("content_type", "text"),
            output=response_data.get("output", {}),
            updated_profile=response_data.get("updated_profile", {}),
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {exc}")