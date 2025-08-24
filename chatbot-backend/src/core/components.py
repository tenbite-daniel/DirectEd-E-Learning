# Core langchain imports
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda

# Memory
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory, ConversationSummaryBufferMemory

# Retrivers
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Langsmith
from langsmith import traceable

import os
from dotenv import load_dotenv
from typing import Dict, Any, List

load_dotenv()

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

class EducationalRetriever:
    def __init__(self, retriever_instance):
        self.retriever = retriever_instance

    def get_documents(self,query: str) ->str:
        docs = self.retriever.invoke(query)
        return "\n\n".join([doc.page_content for doc in docs])
    
    def __call__(self, query: str) -> str:
        """Makes this class directly callable as a Runnable."""
        docs = self.retriever.invoke(query)
        return "\n\n".join(doc.page_content for doc in docs)
    

class AdaptiveConversationChain:
    def __init__(self, llm_model):
        self.llm = llm_model
        # Using ConversationalSummaryBufferMemory to manage long-term context
        self.memory = ConversationSummaryBufferMemory(llm=self.llm, max_token_limit=1000)

    def get_chain(self):
        """
        Creates and returns the conversational chain. The prompt is designed to
        receive history, context, and the user's question as direct inputs.
        """
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", 
             """You are DirectEd, a friendly and knowledgeable AI tutor. 
             Use the following educational context to answer the student's question. 
             If you don't know the answer, politely say so. Keep your response concise and encouraging.
             
             Context: {context}
             
             Conversation History:
             {history}
             """),
            ("user", "{question}")
        ])
        
        chain = prompt_template | self.llm | StrOutputParser()
        return chain


class ContentGenerator:
    def __init__(self, llm_model, retriever: EducationalRetriever):
        self.retriever = retriever
        self.llm = llm_model
        self.quiz_chain = self._quiz_generation_chain()
        self.answer_chain = self._answer_generation_chain()

    @traceable(run_type="chain")
    def _answer_generation_chain(self):
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
        #  Use ONLY the provided 'Content' to form your answer. 
        #     If the content does not contain the answer, say so.

        return {
            "question": RunnablePassthrough(),
            "content": RunnableLambda(lambda x: x["question"]) | self.retriever
        } | prompt_template | self.llm | StrOutputParser()
    
    @traceable(run_type="chain")
    def _quiz_generation_chain(self):
        prompt_template = PromptTemplate.from_template(
            """
            Create 5 multiple-choice questions (MCQs) about the given topic.  
            Each must include:
            - Question text  
            - Four options (A, B, C, D)  
            - The correct answer clearly labeled  

            

            Topic: {topic}  
            Content: {content}  
            """
        )
        # Use ONLY the provided 'Content'.  
        #     If content lacks enough info, say: "Not enough information to create a quiz."
        return {
            "topic": RunnablePassthrough(),
            "content": RunnableLambda(lambda x: x["topic"]) | self.retriever
        } | prompt_template | self.llm | StrOutputParser()

    @traceable(run_type="chain")
    def answer_generator(self, question: str) -> str:
        return self.answer_chain.invoke({"question": question})

    @traceable(run_type="chain")
    def generate_quiz(self, topic: str) -> str:
        return self.quiz_chain.invoke({"topic": topic})
    

class LearningAnalyzer:
    """
    A class that manages student progress and performance logs for multiple students.
    """
    def __init__(self):
        # Using a dictionary to store profiles for multiple students
        self.student_data = {}

    def get_profile(self, user_id: str) -> Dict[str, Any]:
        """Returns the profile for a specific user, creating one if it doesn't exist."""
        if user_id not in self.student_data:
            # Create a new profile for the user if they don't exist
            self.student_data[user_id] = {"completed_quizzes": [], "struggling_topics": []}
        return self.student_data[user_id]
        
    def log_performance(self, user_id: str, topic: str, performance: str):
        """Logs and updates a specific student's data based on a new interaction."""
        profile = self.get_profile(user_id)  # This now gets the correct profile
        if performance == "correct":
            if topic not in profile["completed_quizzes"]:
                 profile["completed_quizzes"].append(topic)
        else:
            if topic not in profile["struggling_topics"]:
                profile["struggling_topics"].append(topic)

        print(f"\n--- Log for User ID: {user_id} on {topic} ({performance}) ---")
        print("Updated Student Profile:")
        print(profile)
        print("-----------------------------------") 