# src/core/app.py

from __future__ import annotations

import logging
from typing import Optional, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Local project imports (avoid importing heavy modules at top-level to prevent cycles)
from .components import LearningAnalyzer
from src.core.schemas.chat_models import ChatRequest, ChatResponse

logger = logging.getLogger("DirectEd")
logger.setLevel(logging.INFO)

# Shared analyzer instance used by routes (stateful analyzers should be thread-safe)
analyzer = LearningAnalyzer()

# Create FastAPI app
app = FastAPI(
    title="DirectEd Educational Assistant",
    description="AI-powered assistant for DirectEd"
)

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Loaded successfully ✅!"}


@app.post("/api/assistant/chat", response_model=ChatResponse)
async def handle_user_request(request: ChatRequest):
    """
    Handle a chat request and forward it to the educational assistant runner.
    We import run_educational_assistant lazily to avoid circular imports at module load time.
    """
    try:
        # Lazy import to avoid circular dependencies
        from .chatbot import run_educational_assistant  # local relative import

        response_data = run_educational_assistant(
            request=request.request_text,
            user_id=request.user_id,
            analyzer=analyzer,
            is_instructor=request.is_instructor,
        )

        # If the function returned an error dict, raise HTTPException
        if isinstance(response_data, dict) and response_data.get("error"):
            raise HTTPException(status_code=500, detail=response_data.get("details", "Internal error"))

        return ChatResponse(
            user_type=response_data.get("user_type", "student"),
            content_type=response_data.get("content_type", "text"),
            output=response_data.get("output", ""),
            updated_profile=response_data.get("updated_profile", {}),
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error in /api/assistant/chat handler: %s", exc)
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {exc}")


def get_next_curriculum_topic(user_id: str) -> Optional[str]:
    """
    Decide next curriculum topic based on the user's profile.
    This is synchronous and lightweight — keep DB calls or heavy ops out of the main thread.
    """
    try:
        profile = analyzer.get_profile(user_id=user_id)
    except Exception as e:
        logger.warning("Failed to fetch profile for user %s: %s", user_id, e)
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


@app.post("/api/assistant/adaptive_learning", response_model=ChatResponse)
async def get_adaptive_content(user_id: str):
    """
    Generate adaptive content for the next suggested curriculum topic for a user.
    """
    try:
        adaptive_request = get_next_curriculum_topic(user_id=user_id)
        if not adaptive_request:
            # Return an informative ChatResponse if there's no next topic
            return ChatResponse(
                user_type="student",
                content_type="message",
                output="🎉 Congratulations! You have gone through the whole curriculum.",
                updated_profile=analyzer.get_profile(user_id=user_id) or {},
            )

        logger.info("Adaptive Learning generating content for user=%s request=%s", user_id, adaptive_request)

        # Lazy import to avoid circular dependencies with chatbot module
        from .chatbot import run_educational_assistant  # local relative import

        response_data = run_educational_assistant(
            request=adaptive_request,
            user_id=user_id,
            analyzer=analyzer,
            is_instructor=False,
        )

        if isinstance(response_data, dict) and response_data.get("error"):
            raise HTTPException(status_code=500, detail=response_data.get("details", "Internal error"))

        return ChatResponse(
            user_type=response_data.get("user_type", "student"),
            content_type=response_data.get("content_type", "text"),
            output=response_data.get("output", ""),
            updated_profile=response_data.get("updated_profile", {}),
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error in /api/assistant/adaptive_learning handler: %s", exc)
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {exc}")
