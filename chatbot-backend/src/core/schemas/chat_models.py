from pydantic import BaseModel, Field
from typing import Dict, Any, Optional


class ChatRequest(BaseModel):
    user_id: str = Field(..., description="The unique identifier for the user.")
    request_text: str = Field(..., description="The user's educational query or request.")
    is_instructor: bool = Field(False, description="Whether the user is an instructor or student.")

class ChatResponse(BaseModel):
    user_type: str = Field(..., description="The type of user (Student or Instructor).")
    content_type: str = Field(..., description="The type of content generated (TUTORING or QUIZ).")
    output: str = Field(..., description="The generated educational content.")
    updated_profile: Dict[str, Any] = Field(..., description="The updated learning profile of the user.")

class ContentGenerateRequest(BaseModel):
    user_id: str = Field(..., description="The unique identifier for the user.")
    subject: str = Field(..., description="The subject or topic for content generation.")
    request_type: str = Field("quiz", description="The type of content to generate (e.g., 'quiz', 'flashcard').")

class AnalyticsResponse(BaseModel):
    user_id: str
    completed_quizzes: list
    struggling_topics: list

class ContentGenerateResponse(BaseModel):
    subject: str
    content: str