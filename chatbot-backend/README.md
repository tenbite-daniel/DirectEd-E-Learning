## 🎓 DirectEd: An Adaptive AI Educational Assistant
DirectEd is a smart, adaptive educational assistant designed to provide personalized learning experiences. Built with FastAPI and LangChain, it uses a sophisticated multi-step pipeline to answer user questions, generate custom learning content, and provide actionable feedback. The assistant is powered by a large language model fine-tuned with LoRA, enabling it to maintain a specific instructional tone and format.

## ✨ Features
Adaptive Tutoring: Guides students using a Socratic method, providing hints and encouraging critical thinking rather than just giving answers.

Intelligent Content Generation: Creates tailored educational content, including summaries, quizzes, and examples, based on the student's needs and difficulty level.

Learning Analysis: Provides a detailed breakdown of a student's strengths and weaknesses and suggests personalized next steps.

Fine-Tuned Persona: Uses a fine-tuned LoRA adapter to ensure a consistent, supportive, and knowledgeable persona across all interactions.

## Project Structure
```
.
├── finetuning/                  # Contains all scripts and notebooks related to the fine-tuning workflow.
│   ├── finetuned_model/
│   │   ├── README.md            # Documentation for the final fine-tuned model.
│   │   └── finetuning_and_inference.ipynb # A Jupyter notebook for running fine-tuning and testing model inference.
│   ├── generate_dataset.py      # Generates a synthetic dataset for fine-tuning the model's behavior.
│   ├── prepare_data.py          # Prepares and formats the generated dataset for use by the fine-tuning script.
│   └── run_finetuning.py        # The main Python script to execute the fine-tuning process.
├── knowledge/                   # Stores raw text documents and data for the RAG (Retrieval-Augmented Generation) system.
├── data/                        # Contains the prepared datasets used for fine-tuning.
├── db/                          # The persistent storage location for the ChromaDB vector database.
├── src/                         # The source code directory for the main FastAPI application.
│   ├── __init__.py              # An empty file that makes `src` a Python package.
│   ├── main.py                  # The main entry point for the FastAPI application.
│   ├── pipeline.py              # Orchestrates the complex, multi-step LangChain workflow.
│   ├── templates.py             # A library of all the prompt templates used by the LLM chains.
│   └── core/                    # Contains the core logic and components of the application.
│       ├── __init__.py
│       ├── app.py               # The FastAPI application instance.
│       ├── chatbot.py           # The central hub for chatbot logic, integrating all components.
│       ├── components.py        # Holds reusable classes like the LearningAnalyzer.
│       ├── data_handlers.py     # Manages the creation and handling of the vector database.
│       ├── api/                 # The API layer of the application.
│       │   ├── __init__.py
│       │   └── endpoints.py     # Defines the specific API endpoints and their logic.
│       ├── schemas/             # Defines the data models for API requests and responses.
│       │   ├── __init__.py
│       │   └── chat_models.py   # Pydantic models for chat requests and responses.
│       └── services/            # Contains the business logic of the application.
│           ├── __init__.py
│           └── educational_assistant.py # The service that handles the core educational assistant logic.
├── .dockerignore                # Specifies files and directories to exclude from the Docker build.
├── .gitignore                   # Specifies files to be ignored by Git (e.g., temporary files, environment variables).
├── Dockerfile                   # The instructions for building the Docker image of the application.
├── docker-compose.yaml          # Defines how to run the application's services using Docker Compose.
├── requirements.txt             # A list of all the Python dependencies required for the project.
└── trials.ipynb                 # A Jupyter notebook for testing, experimentation, and debugging.
```

## Core Technologies
Python: The primary programming language.

FastAPI: A modern, high-performance web framework.

LangChain: The framework for building the LLM application pipeline.

Hugging Face: Used for loading models, tokenizers, and running fine-tuning.

PEFT (LoRA): Parameter-Efficient Fine-Tuning for adapting the model with minimal cost.

TRL (Transformer Reinforcement Learning): Provides the SFTTrainer for fine-tuning.

ChromaDB: The vector store for Retrieval-Augmented Generation (RAG).

Docker: For containerization and deployment.

## 🚀 Setup and Installation
Clone the repository:
```Bash

git clone https://github.com/TheuriEric/DirectEd-VA.git
cd DirectEd-VA
```
Create a virtual environment:

```Bash

python -m venv venv
source venv/bin/activate
Install dependencies:
```

```Bash

pip install -r requirements.txt
#Set up API Keys:
#Create a .env file in the root directory and add your API keys.


OPENAI_API_KEY="your-openai-key"
GROQ_API_KEY="your-groq-key"
```
## Fine-Tuning Workflow
The fine-tuning process is separate but essential for improving the model's performance.

Generate a Dataset: Run finetuning/generate_dataset.py.

Prepare the Data: Run finetuning/prepare_data.py.

Run Fine-Tuning: Use the finetuning/run_finetuning.py to execute the fine-tuning process and save the finetuned_adapters to the finetuned_adapters directory.


## Running with Docker
This project is fully containerized for easy deployment.

Build the Docker image:

```Bash

docker build -t direct-ed-app .
```
Run the application using Docker Compose:

```Bash

docker-compose up -d
```
This command will build and start your application and any other services defined in the docker-compose.yaml file (e.g., a database).

## Usage
Once the application is running, the API will be available at http://127.0.0.1:8000. You can test the endpoints using a tool like Postman or by navigating to http://127.0.0.1:8000/docs to use the interactive Swagger UI.

