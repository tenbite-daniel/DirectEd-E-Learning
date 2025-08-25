from __future__ import annotations
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, ValidationError, Field
import random

# LangChain Imports for the fix
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser


# Lightweight schemas 
class ContentType(str, Enum):
    flashcards = "flashcards"
    quiz = "quiz"
    practice_questions = "practice_questions"

class Flashcard(BaseModel):
    front: str
    back: str
    topic: Optional[str] = None
    level: Optional[str] = None

class MCQOption(BaseModel):
    label: str  # "A", "B", "C", "D"
    text: str

class QuizQuestion(BaseModel):
    question: str
    options: List[MCQOption]
    correct_label: str
    explanation: Optional[str] = None

class Quiz(BaseModel):
    title: str
    topic: Optional[str] = None
    level: Optional[str] = None
    questions: List[QuizQuestion]

class PracticeQuestion(BaseModel):
    prompt: str
    answer: Optional[str] = None
    hint: Optional[str] = None
    topic: Optional[str] = None
    level: Optional[str] = None

class ContentRequest(BaseModel):
    type: ContentType
    topic: str
    num_items: int = Field(5, ge=1, le=50)
    level: Optional[str] = "beginner"
    curriculum_notes: Optional[str] = None

class ContentResponse(BaseModel):
    type: ContentType
    flashcards: Optional[List[Flashcard]] = None
    quiz: Optional[Quiz] = None
    practice_questions: Optional[List[PracticeQuestion]] = None


# ------------------------
# Errors
# ------------------------
class ServiceError(Exception):
    """Base service-layer error with a safe, user-facing message."""
    def __init__(self, message: str, *, detail: dict | None = None):
        super().__init__(message)
        self.message = message
        self.detail = detail or {}

class ContentGenerationError(ServiceError):
    """Raised when content generation fails or input is invalid."""
    pass


# ContentGenerator
class ContentGenerator:
    """
    Deterministic content generator used by the chatbot.
    Keeps return values as Python objects (pydantic models) for ease of conversion.
    """

    def __init__(self, llm=None, retriever=None):
        """
        llm and retriever are optional. If provided, future versions can call the LLM.
        For now, generator uses simple deterministic templates so it's testable offline.
        """
        self.llm = llm
        self.retriever = retriever
        # NEW: Initialize the answer generation chain here
        self.answer_chain = self._setup_answer_chain()
        self.quiz_chain = self._setup_quiz_chain()

    # Public API
    def generate_flashcards(self, subject: str, n: int = 5, level: str | None = "beginner", notes: str | None = None) -> List[Flashcard]:
        try:
            return self._gen_flashcards(subject, n, level, notes)
        except ValidationError as ve:
            raise ContentGenerationError("Invalid flashcard shape", detail={"errors": ve.errors()}) from ve
        except Exception as e:
            raise ContentGenerationError("Flashcard generation failed", detail={"reason": str(e)}) from e

    def generate_quiz(self, subject_or_request: str, n: int = 5, level: str | None = "beginner", notes: str | None = None) -> Quiz:
        """
        `subject_or_request` can be either a subject string or a user request string.
        Keep it flexible so older calls like content_generator.generate_quiz(request_string) still work.
        """
        try:
            # For now, derive a short topic name from the input
            topic = subject_or_request.split("about")[-1].strip() if "about" in subject_or_request else subject_or_request.strip()
            return self._gen_quiz(topic or "General", n, level, notes)
        except ValidationError as ve:
            raise ContentGenerationError("Invalid quiz shape", detail={"errors": ve.errors()}) from ve
        except Exception as e:
            raise ContentGenerationError("Quiz generation failed", detail={"reason": str(e)}) from e

    def generate_practice(self, subject: str, n: int = 5, level: str | None = "beginner", notes: str | None = None) -> List[PracticeQuestion]:
        try:
            return self._gen_practice(subject, n, level, notes)
        except ValidationError as ve:
            raise ContentGenerationError("Invalid practice-question shape", detail={"errors": ve.errors()}) from ve
        except Exception as e:
            raise ContentGenerationError("Practice question generation failed", detail={"reason": str(e)}) from e

    # MODIFIED: This function now uses the new LangChain Expression Language (LCEL) chain.
    def answer_generator(self, request_text: str) -> str:
        """
        Generates a short, formatted answer using the LangChain expression chain.
        This ensures the LLM always processes the retrieved content.
        """
        if self.llm is None or self.retriever is None:
            # Fallback deterministic text if LLM or retriever are not configured
            return f"Sorry, I couldn’t generate an explanation for '{request_text}'."

        try:
            # Invoke the pre-configured chain.
            # It handles retrieval, prompting, and LLM invocation.
            response = self.answer_chain.invoke(request_text)
            return response
        except Exception as e:
            return f"[LLM or Chain error: {e}]"


    # NEW: A dedicated method to set up the answer generation chain
    def _setup_answer_chain(self):
        if self.llm is None or self.retriever is None:
            return None

        prompt_template = PromptTemplate.from_template(
            """
            You are an AI tutor. 
            
            Question: {question}
            Content: {content}

            Guidelines:
            - Start with a beginner-friendly explanation.   
            - Add deeper insights only if needed.   
            - Use bullet points or step-by-step lists.   
            - Include one real-world example or analogy.   
            - Be concise and motivating.   
            - Keep answers between **50 and 150 words**.   
            """
        )

        # The key change: The chain now combines the retriever and the LLM
        # This structure ensures the retrieved content is always passed to the LLM
        full_chain = (
            {
                "content": self.retriever,
                "question": RunnablePassthrough()
            }
            | prompt_template
            | self.llm
            | StrOutputParser()
        )
        return full_chain

    def _setup_quiz_chain(self):
        # NOTE: This method is needed to ensure the quiz chain is also defined,
        # but your existing implementation of `generate_quiz` does not use it.
        # This is a placeholder for future-proofing your code.
        return None

    # ------------------------
    # Internal deterministic helpers
    # ------------------------
    def _gen_flashcards(self, topic: str, n: int, level: str | None, notes: str | None) -> List[Flashcard]:
        suffix = f" ({level})" if level else ""
        cards: List[Flashcard] = []
        for i in range(1, max(1, n) + 1):
            front = f"{topic}{suffix}: Key point #{i}"
            back = f"Short explanation for key point #{i}. {notes or ''}".strip()
            cards.append(Flashcard(front=front, back=back, topic=topic, level=level))
        return cards

    def _gen_quiz(self, topic: str, n: int, level: str | None, notes: str | None) -> Quiz:
        random.seed(42)
        questions = []
        for i in range(1, max(1, n) + 1):
            q_text = f"[{topic}] Question #{i}" + (f" ({level})" if level else "")
            correct_idx = random.randint(0, 3)
            opts = []
            for idx, label in enumerate(["A", "B", "C", "D"]):
                text = f"Option {label} about {topic}"
                if idx == correct_idx:
                    text = f"Correct concept for #{i} in {topic}"
                opts.append(MCQOption(label=label, text=text))
            questions.append(QuizQuestion(
                question=q_text,
                options=opts,
                correct_label=opts[correct_idx].label,
                explanation=f"Because it aligns with: {notes or 'core concept'}."
            ))
        return Quiz(title=f"{topic} Quiz", topic=topic, level=level, questions=questions)

    def _gen_practice(self, topic: str, n: int, level: str | None, notes: str | None) -> List[PracticeQuestion]:
        qs = []
        for i in range(1, max(1, n) + 1):
            prompt = f"Practice: Explain '{topic}' concept #{i}" + (f" ({level})" if level else "")
            answer = f"Sample answer emphasizing {topic} key idea #{i}."
            hint = f"Think of the definition and one real-world example. {notes or ''}".strip()
            qs.append(PracticeQuestion(prompt=prompt, answer=answer, hint=hint, topic=topic, level=level))
        return qs
