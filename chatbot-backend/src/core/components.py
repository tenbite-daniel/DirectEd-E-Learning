# Core langchain imports
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory, ConversationSummaryBufferMemory
# Langsmith
from langsmith import traceable
import os
from dotenv import load_dotenv
from typing import Dict, Any, List
from data_handlers import retriever

load_dotenv()

llm = ChatGroq(
    model=os.getenv("GROQ_MODEL"),
    temperature=0.7
)

class EducationalRetriever:
    def get_documents(self,query: str) ->str:
        docs = retriever.get_relevant_documents(query)
        return "\n\n".join([doc.page_content for doc in docs])


class ContentGenerator:
    @traceable(run_type="chain")
    def answer_generation(self, query: str):
        answer_prompt_template = ChatPromptTemplate.from_template(
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
        answer_chain = answer_prompt_template | llm | StrOutputParser()
        return answer_chain.invoke({
            "question": query,
            "content": EducationalRetriever.get_documents(query=query)
            } )
    
    
    @traceable(run_type="chain")
    def quiz_generation(self, query: str, quiz_length: int):
        quiz_prompt_template = PromptTemplate.from_template(
            """
            Create a multiple-choice questions (MCQs)quiz of {quiz_length} questions about the given topic.  
            Each must include:
            - Question text  
            - Four options (A, B, C, D)  
            - Then ask the user for the answers in the following format:
                1. Answer
                2. Answer
                3. Answer.... 

            Topic: {topic}  
            Content: {content}  
            """
        )
        quiz_chain = quiz_prompt_template | llm | StrOutputParser()

        return quiz_chain.invoke({
            "topic": query,
            "content": EducationalRetriever().get_documents(query=query)
            })

    
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