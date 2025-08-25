# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from langserve import add_routes
# from langchain.schema.runnable import RunnableLambda
# from pydantic import BaseModel
# from .core.api.endpoints import router as api_router
# from .core.chatbot import run_educational_assistant
# from .core.components import LearningAnalyzer
# from .core.app import app
# from pydantic import BaseModel
# from typing import Dict, Any
# from slowapi import Limiter, _rate_limit_exceeded_handler
# from slowapi.util import get_remote_address
# from slowapi.errors import RateLimitExceeded
# from slowapi.middleware import SlowAPIMiddleware
# from dotenv import load_dotenv
# import os

# load_dotenv()

# LANGSMITH_TRACING="true"
# LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
# LANGSMITH_API_KEY="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"
# LANGSMITH_PROJECT="DirectEd"


# limiter = Limiter(key_func=get_remote_address, default_limits=["5/minute"])


# # Define output schema
# class AssistantOutput(BaseModel):
#     user_type: str
#     content_type: str
#     output: str
#     updated_profile: Dict[str, Any]  


# class AssistantInput(BaseModel):
#     request: str
#     user_id: str = "anonymous"
#     is_instructor: bool = False

# educational_chain = RunnableLambda(
#     lambda inp: run_educational_assistant(
#         request=inp['request'],
#         user_id=inp.get("user_id", "0"),
#         analyzer=LearningAnalyzer(),
#         is_instructor=inp.get("is_instructor", False)
#     )
# ).with_types(
#     input_type=AssistantInput,
#     output_type=AssistantOutput
# )


# # app = FastAPI(
# #     title="DirectEd Educational API",
# #     description="Backend for the DirectEd educational platform.",
# #     version="1.0.0",
# #     docs_url="/swagger",
# #     redoc_url="/redoc"
# # )
# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
# app.add_middleware(SlowAPIMiddleware)

# origins = [
#     "https://direct-ed-e-learning.vercel.app",
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
#     "http://localhost:8000",
#     "http://127.0.0.1:8000",
# ]

# app.add_middleware(CORSMiddleware,
#                    allow_origins=origins,
#                    allow_methods = ["*"],
#                    allow_credentials = True,
#                    allow_headers = ["*"]
#                    )
# app.include_router(api_router)
# add_routes(app, educational_chain, path="/assistant")

# # @app.get("/")
# # async def root():
# #     return {"message": "DirectEd API is running. Visit /docs or /assistant/playground"}

# src/core/api/endpoints.py
from fastapi import APIRouter, HTTPException
from typing import Any, Dict, Optional

# main.py
from fastapi import FastAPI
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
os.environ["LANGSMITH_API_KEY"] = "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"
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
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"]
)

# Include the router from endpoints.py
app.include_router(api_router)

# Add LangServe routes
add_routes(app, educational_chain, path="/assistant")

@app.get("/")
async def root():
    return {"message": "DirectEd API is running. Visit /docs or /assistant/playground"}