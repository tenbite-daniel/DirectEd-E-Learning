from pydantic import BaseModel, Field
from typing import Dict, Any, Optional


class ChatRequest(BaseModel):
    user_id: str = Field(1, description="The unique identifier for the user.")
    request_text: str = Field("Explain HTML", description="The user's educational query or request.")
    is_instructor: bool = Field(False, description="Whether the user is an instructor or student.")

class ChatResponse(BaseModel):
    output: str = Field(..., description="The generated educational content.")

class ContentGenerateRequest(BaseModel):
    user_id: str = Field(..., description="The unique identifier for the user.")
    subject: str = Field(..., description="The subject or topic for content generation.")
    learner_level: str = Field("Beginner", description="The level of the learner. Beginner, Intermediate or Advanced")
    request_type: str = Field("quiz", description="The type of content to generate (e.g., 'quiz', 'flashcard', 'assessment').")
    content_length: int = Field(5,description="The length of the quiz/flashcard/assessment")


class ContentGenerateResponse(BaseModel):
    conent_type: str = Field("Content type", description="The type of content generated. Flashcard | quiz | assessment")
    subject: str = Field("Title", description="The title of the content")
    content: str = Field("The generated content", description="The material content is displayed here")