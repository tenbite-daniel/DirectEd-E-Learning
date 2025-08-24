from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from langchain_community.document_loaders import (
    DirectoryLoader,
    PDFPlumberLoader,
    WebBaseLoader,
    TextLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
from pathlib import Path
import os

project_root = Path(__file__).resolve().parent.parent.parent
knowledge_path = project_root / "knowledge"
database_path = project_root/"db"


load_dotenv()

# Document loading

resources_links = [
    # FastAPI
    #"https://projector-video-pdf-converter.datacamp.com/36910/chapter1.pdf",
    # Postman
    "https://learning.postman.com/docs/introduction/overview/",
    "https://curl.se/docs/tutorial.html",
    "https://everything.curl.dev/index.html",
    # Cors
    "https://www.geeksforgeeks.org/configuring-cors-in-fastapi/",
    "https://pypi.org/project/fastapi-cors/",
    "https://learn.microsoft.com/en-us/answers/questions/2115649/cors-error-in-fastapi-backend-from-react-frontend",
    "https://fastapi.tiangolo.com/tutorial/",
    # Langchain
    # "https://archive.fosdem.org/2024/events/attachments/fosdem-2024-2384-langchain-from-0-to-1-unveiling-the-power-of-llm-programming/slides/22587/LangChain_From_0_To_1_public_1_PpuSgEN.pdf",
    ## LLMOps
    "https://code-b.dev/blog/llmops-for-machine-learning",
    "https://signoz.io/guides/llmops/",
    "https://www.analyticsvidhya.com/blog/2023/09/llmops-for-machine-learning-engineering/",
    "https://www.datacamp.com/blog/llmops-essentials-guide-to-operationalizing-large-language-models",
    ## Data Management
    "https://www.ibm.com/topics/data-management",
    "https://www.oracle.com/database/what-is-data-management/",
    "https://docs.pinecone.io/docs/quickstart",
    "https://weaviate.io/developers/weaviate/current/getting-started/quickstart.html",
    # Fine Tuning
    "https://cookbook.openai.com/articles/gpt-oss/fine-tune-transfomers",
    "https://huggingface.co/blog/dvgodoy/fine-tuning-llm-hugging-face",
    "https://huggingface.co/learn/llm-course/en/chapter3/1",    
]
# web_loader = WebBaseLoader(resources_links)
# pdf_loaders = DirectoryLoader(
#     str(knowledge_path),
#     loader_cls=PDFPlumberLoader,
#     glob="*.pdf"
# )
# text_loader = DirectoryLoader(
#     str(knowledge_path),
#     loader_cls=TextLoader,
#     glob="*.txt"
# )

# web_data = web_loader.load()
# pdf_data = pdf_loaders.load()
# text_data = text_loader.load()

# Embeddings

persist_directory = database_path
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001",
                                          google_api_key=GOOGLE_API_KEY)
# text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=20)
# pdf_chunks = text_splitter.split_documents(pdf_data)
# web_chunks = text_splitter.split_documents(web_data)
# text_chunks = text_splitter.split_documents(text_data)

# all_chunks =pdf_chunks + web_chunks + text_chunks

# Populatint the database
# vectordb = Chroma.from_documents(
#     documents=all_chunks,
#     embedding=embeddings,
#     persist_directory=persist_directory
# )


vectordb = Chroma(persist_directory=persist_directory,
                  embedding_function=embeddings)

retriever = vectordb.as_retriever()
