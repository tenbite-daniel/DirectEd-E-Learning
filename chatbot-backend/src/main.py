from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from langserve import add_routes
from langchain.schema.runnable import RunnableLambda
from pydantic import BaseModel
from typing import Dict, Any
from dotenv import load_dotenv
import os

from .core.api.endpoints import router as api_router
from .core.chatbot import run_educational_assistant
from .core.components import LearningAnalyzer

load_dotenv()

# Set up LangSmith environment variables
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGSMITH_API_KEY"] = os.getenv("LANGSMITH_API_KEY")
os.environ["LANGSMITH_PROJECT"] = "DirectEd"

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["5/minute"])

# Define Pydantic models for LangServe
class AssistantOutput(BaseModel):
    user_type: str
    content_type: str
    output: Dict[str, Any]
    updated_profile: Dict[str, Any]

class AssistantInput(BaseModel):
    request: str
    user_id: str = "anonymous"
    is_instructor: bool = False

# Define Pydantic model for the custom chat endpoint
class ChatRequest(BaseModel):
    user_id: str
    request_text: str
    is_instructor: bool = False

# Create the runnable chain for LangServe
educational_chain = RunnableLambda(
    lambda inp: run_educational_assistant(
        request=inp['request'],
        user_id=inp.get("user_id", "0"),
        analyzer=LearningAnalyzer(),
        is_instructor=inp.get("is_instructor", False)
    )
).with_types(
    input_type=AssistantInput,
    output_type=AssistantOutput
)

# Initialize the main app instance
app = FastAPI(
    title="DirectEd Educational API",
    description="Backend for the DirectEd educational platform.",
    version="1.0.0",
    docs_url="/swagger",
    redoc_url="/redoc"
)

# Add middleware and exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

origins = [
    "https://direct-ed-e-learning.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"]
)

# Custom chat endpoint to match frontend expectations
@app.post("/api/assistant/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Convert to the format expected by your educational_chain
        chain_input = {
            "request": request.request_text,
            "user_id": request.user_id,
            "is_instructor": request.is_instructor
        }
        
        result = await educational_chain.ainvoke(chain_input)
        
        # Extract the text response from the result
        response_text = ""
        if isinstance(result, dict):
            if "output" in result and isinstance(result["output"], dict):
                response_text = result["output"].get("text", "")
                if not response_text and "content" in result["output"]:
                    response_text = str(result["output"]["content"])
            elif "content" in result:
                response_text = str(result["content"])
            else:
                response_text = str(result)
        else:
            response_text = str(result)
        
        # Return in the format your frontend expects
        return {
            "output": {
                "text": response_text or "I'm sorry, I couldn't generate a response. Please try again."
            },
            "status": "success"
        }
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Include the router from endpoints.py
app.include_router(api_router)

# Add LangServe routes
add_routes(app, educational_chain, path="/assistant")

@app.get("/")
async def root():
    return {"message": "DirectEd API is running. Visit /docs or /assistant/playground"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)