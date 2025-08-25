import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from langserve import add_routes
from langchain.schema.runnable import RunnableLambda
from pydantic import BaseModel, Field
from typing import Dict, Any
from dotenv import load_dotenv

from .core.api.endpoints import router as api_router
from .core.chatbot import run_educational_assistant
from .core.components import LearningAnalyzer

# Avoid pydantic validation issues during development
os.environ['PYDANTIC_SKIP_VALIDATING_CORE_SCHEMAS'] = '1'

# Load environment variables first
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up LangSmith for tracing
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGSMITH_API_KEY"] = "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"
os.environ["LANGSMITH_PROJECT"] = "DirectEd"

# Initialize rate limiting
limiter = Limiter(key_func=get_remote_address, default_limits=["5/minute"])

# Define input/output models for the API
class AssistantInput(BaseModel):
    request: str = Field(..., description="The user's request or question")
    user_id: str = Field(default="anonymous", description="Unique identifier for the user")
    is_instructor: bool = Field(default=False, description="Whether the user is an instructor")

class AssistantOutput(BaseModel):
    user_type: str = Field(..., description="Type of user (student/instructor)")
    content_type: str = Field(..., description="Type of content generated")
    output: Dict[str, Any] = Field(..., description="The assistant's response")
    updated_profile: Dict[str, Any] = Field(default_factory=dict, description="Updated user profile")

def educational_assistant_wrapper(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Wrapper function to handle input/output for the educational assistant.
    Takes the raw input and formats it properly for our chatbot.
    """
    logger.info(f"Received input: {input_data}")
    
    try:
        # Extract the parameters we need
        if isinstance(input_data, dict):
            request = input_data.get('request', '')
            user_id = input_data.get('user_id', 'anonymous')
            is_instructor = input_data.get('is_instructor', False)
        else:
            # Fallback if input is not a dict
            request = str(input_data)
            user_id = 'anonymous'
            is_instructor = False
        
        logger.info(f"Processing request: {request} for user: {user_id}")
        
        # Call our main educational assistant function
        result = run_educational_assistant(
            request=request,
            user_id=user_id,
            analyzer=LearningAnalyzer(),
            is_instructor=is_instructor
        )
        
        # Make sure we return the result in the expected format
        if isinstance(result, dict):
            formatted_result = {
                'user_type': result.get('user_type', 'Student'),
                'content_type': result.get('content_type', 'TUTORING'),
                'output': result.get('output', {}),
                'updated_profile': result.get('updated_profile', {})
            }
        else:
            # If something went wrong, wrap it properly
            formatted_result = {
                'user_type': 'Student',
                'content_type': 'ERROR',
                'output': {'text': str(result)},
                'updated_profile': {}
            }
        
        return formatted_result
        
    except Exception as e:
        logger.error(f"Error in wrapper: {e}")
        return {
            'user_type': 'Student',
            'content_type': 'ERROR',
            'output': {'error': f"Sorry, I encountered an error: {str(e)}"},
            'updated_profile': {}
        }

# Create the runnable chain for LangServe
educational_chain = RunnableLambda(educational_assistant_wrapper)

# Initialize FastAPI app
app = FastAPI(
    title="DirectEd Educational API",
    description="Backend API for the DirectEd e-learning platform",
    version="1.0.0",
    docs_url="/swagger",
    redoc_url="/redoc"
)

# Add rate limiting middleware
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Configure CORS for frontend access
origins = [
    "https://direct-ed-e-learning.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"]
)

# Include our API routes
app.include_router(api_router)

@app.post("/test-assistant")
async def test_assistant(message: str):
    """Simple test endpoint to check if the assistant is working"""
    try:
        result = educational_assistant_wrapper({
            'request': message,
            'user_id': 'test_user',
            'is_instructor': False
        })
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Test endpoint error: {e}")
        return {"success": False, "error": str(e)}

@app.post("/chat")
async def chat_endpoint(request: AssistantInput):
    """
    Main chat endpoint that returns formatted responses.
    Makes the output more readable for the frontend.
    """
    try:
        result = educational_assistant_wrapper({
            'request': request.request,
            'user_id': request.user_id,
            'is_instructor': request.is_instructor
        })
        
        output = result['output']
        content_type = result['content_type']
        
        # Format quiz responses nicely
        if content_type == 'QUIZ' and isinstance(output, dict):
            formatted_response = f"## {output.get('title', 'Quiz')}\n\n"
            formatted_response += f"**Topic:** {output.get('topic', 'N/A')}\n"
            formatted_response += f"**Level:** {output.get('level', 'N/A')}\n\n"
            
            for i, q in enumerate(output.get('questions', []), 1):
                formatted_response += f"### Question {i}\n"
                formatted_response += f"{q.get('question', '')}\n\n"
                for opt in q.get('options', []):
                    formatted_response += f"**{opt.get('label')}**) {opt.get('text', '')}\n"
                formatted_response += f"\n*Correct Answer: {q.get('correct_label', 'N/A')}*\n"
                formatted_response += f"*Explanation: {q.get('explanation', 'N/A')}*\n\n"
                formatted_response += "---\n\n"
                
            return {
                "formatted_response": formatted_response,
                "raw_data": result,
                "content_type": content_type
            }
            
        # Format tutoring responses nicely
        elif content_type == 'TUTORING' and isinstance(output, dict):
            text_content = output.get('text', str(output))
            formatted_response = f"## Learning Content\n\n{text_content}"
            
            return {
                "formatted_response": formatted_response,
                "raw_data": result,
                "content_type": content_type
            }
        
        # Default formatting for other responses
        return {
            "formatted_response": str(output),
            "raw_data": result,
            "content_type": content_type
        }
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        return {"error": str(e)}

# Add LangServe routes for the playground interface
add_routes(
    app, 
    educational_chain, 
    path="/assistant",
    input_type=AssistantInput,
    output_type=AssistantOutput,
    enable_feedback_endpoint=False,
    enable_public_trace_link_endpoint=False
)

# Rebuild models to ensure proper validation
AssistantInput.model_rebuild()
AssistantOutput.model_rebuild()

@app.get("/")
async def root():
    return {"message": "DirectEd API is running. Visit /docs or /assistant/playground"}

@app.on_event("startup")
async def startup_event():
    """Test the system on startup to make sure everything works"""
    logger.info("🚀 DirectEd API starting up...")
    
    # Run a quick test to make sure the assistant works
    try:
        test_result = educational_assistant_wrapper({
            'request': 'Hello, this is a test',
            'user_id': 'startup_test',
            'is_instructor': False
        })
        logger.info(f"✅ Startup test successful")
    except Exception as e:
        logger.error(f"❌ Startup test failed: {e}")
    
    logger.info("🎯 API ready! Playground available at: http://127.0.0.1:8000/assistant/playground/")