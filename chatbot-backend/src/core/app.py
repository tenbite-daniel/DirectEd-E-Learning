from langsmith import traceable
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from .components import llm, AdaptiveConversationChain, ContentGenerator
from typing import Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .chat_models import ChatRequest, ChatResponse, ContentGenerateRequest


app = FastAPI(
    title="DirectEd Educational Assistant",
    description="AI-powered assistant for DirectEd",
    version="1.1"
)

adaptive_conversation = AdaptiveConversationChain()
content_generator = ContentGenerator()

async def router(user_input: str) -> str:
    """ 
    Identifies what the user's input is and determines the action to be taken.
    """
    routing_prompt_template = ChatPromptTemplate.from_template("""
    You are the **DirectEd Single-Word Intent Router**, a highly constrained and logic-driven system.

    **Your SOLE and ONLY task is to analyze the user's request and return a single, lowercase word corresponding to the correct intent.**

    ### Available Intents (One Word ONLY):

    * **flashcard**: For requests asking for a definition, simple explanation, quick fact, or study aid for memorization.
    * **quiz**: For requests that sound like a quick, informal check of knowledge or self-testing.
    * **assessment**: For requests that require a formal, structured, high-stakes examination (e.g., "exam," "assessment," "formal test").
    * **general_question**: For any informational or open-ended request that does not fit the educational tool categories above (e.g., "Explain X simply," "What is the history of Y?").

    ### Output Constraint (CRITICAL):

    1.  **Return ONLY ONE WORD:** Do not include any punctuation, quotes, spaces, reasoning, or introductory phrases.
    2.  **Case:** The word MUST be lowercase.
    3.  **Source:** The word MUST be one of the four words in the list above: `flashcard`, `quiz`, `assessment`, or `general_question`.

    ### User Request to Analyze:
    {user_input}
    """)
    router_chain = routing_prompt_template | llm | StrOutputParser()
    decision = await router_chain.ainvoke({
        "user_input": user_input
    })

    return decision.strip().lower()

async def run_educational_assistant(query: str, quiz_length: int = 5, flashcard_length: int = 5, learner_lvl: str = "Beginner"):
    router_answer = await router(user_input=query)
    if router_answer == "general_question":
        output = await adaptive_conversation.answer_generation(query)
    elif router_answer == "flashcard":
        output = await content_generator.flashcard_generation(query=query, flashcard_length=flashcard_length)
    elif router_answer == "quiz":
        output = await content_generator.quiz_generation(query=query, quiz_length=quiz_length)
    elif router_answer == "assessment":
        output = await content_generator.assessment_generator(topic=query, learner_lvl=learner_lvl)
    else:
        output = await adaptive_conversation.answer_generation(query=query)
    return output

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
    return {"message": "Loaded successfully ✅! Visit /docs"}


@app.post("/api/assistant/chat", response_model=ChatResponse)
async def main_chat(request: ChatRequest):
    generated_output = await run_educational_assistant(query=request.request_text)
    return ChatResponse(output=generated_output)


@app.post("/assistant/content/generate")
async def content_generation(content: ContentGenerateRequest):
    pass