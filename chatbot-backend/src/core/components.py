from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory, ConversationSummaryBufferMemory
from langsmith import traceable
import os
from dotenv import load_dotenv
from typing import Dict, Any
from .data_handlers import retriever

load_dotenv()

llm = ChatGroq(
    model=os.getenv("GROQ_MODEL"),
    temperature=0.7
)

class EducationalRetriever:
    def get_documents(self,query: str) ->str:
        docs = retriever.invoke(query)
        return "\n\n".join([doc.page_content for doc in docs])


class ContentGenerator:
    # @traceable(run_type="chain")
    async def flashcard_generation(self, query: str, flashcard_length: int):
        flashcard_prompt_template = ChatPromptTemplate.from_template(
            """
            You are an intelligent flashcard generator for **DirectEd**, a learning platform focused on tech (web development, AI, design, and the developer industry).

            Your task is to create a set of **5-7 flashcards** based on the provided content and topic.

            **Topic:** {topic}
            **Content:** {content}

            ### Output Format Guidelines:
            1.  **Strictly use Markdown** for formatting.
            2.  Each flashcard must be clearly separated by a horizontal rule (`---`).
            3.  A flashcard must consist of exactly two parts: a **Front** (Question/Term) and a **Back** (Answer/Definition).
            4.  The output must follow this precise structure for every card:

            **<Front>**
            * **Term/Question (Maximum 10 words):** [Term or Question related to the topic]
            * **Context:** [A concise clue or category for the question/term]

            **<Back>**
            * **Definition/Answer (Maximum 4 sentences):** [The key definition or answer]
            * **Keyword Association:** [1-2 critical, easy-to-recall keywords]
            * **Why It Matters:** [1 sentence explaining its real-world relevance in tech]

            ---
            (Start Flashcard Generation Here)
            ### Final Output Constraint: (CRITICAL)
            **YOUR ENTIRE RESPONSE MUST BE A SINGLE, VALID JSON OBJECT.**
            Do NOT include any introduction, explanations, markdown outside the value field, or commentary.
            
            IT IS A MUST YOU return a JSON output with the following format:
            {{
            "subject": "This will be the title of the output. For example: 'Web development flashcard'",
            "output": "This will contain the actual flashcards/generated content"
            }} 
            Output ONLY valid JSON, with all keys and string values wrapped in double quotes (").

            """
        )
        flashcardchain = flashcard_prompt_template | llm | StrOutputParser()
        return await flashcardchain.ainvoke(
            {"topic": query,
             "flashcard_length": flashcard_length,
             "content": EducationalRetriever().get_documents(query=query)}
        )
    
    # @traceable(run_type="chain")
    async def quiz_generation(self, query: str, quiz_length: int):
        quiz_prompt_template = ChatPromptTemplate.from_template(
            """
            You are a **Quiz Generator** for DirectEd.

            **Topic:** {topic}  
            **Content:** {content}
            
            ### Task:
            Generate a multiple-choice questions (MCQs) quiz of exactly {quiz_length} questions based **ONLY** on the provided content.

            ### Quiz Format (The 'output' field):
            1. Each question must include the Question text and four options (A, B, C, D).
            2. After all questions, provide the correct answers clearly in the format: 
               1. Answer
               2. Answer
               3. Answer
            
            ### Final Output Constraint: (CRITICAL)
            **YOUR ENTIRE RESPONSE MUST BE A SINGLE, VALID JSON OBJECT.**
            Do NOT include any introduction, explanations, markdown outside the value field, or commentary.
            
            **JSON Format:**
            {{
            "subject": "This will be the title of the quiz (e.g., 'Web Development Quiz')",
            "output": "The entire, formatted quiz content (questions, options, and answer list) goes here as a single string."
            }} 
            Output ONLY valid JSON, with all keys and string values wrapped in double quotes (").

            """
        )
        quiz_chain = quiz_prompt_template | llm | StrOutputParser()

        return await quiz_chain.ainvoke({
            "topic": query,
            "quiz_length": quiz_length,
            "content": EducationalRetriever().get_documents(query=query)
            })
    
    # @traceable(run-"chain")
    async def assessment_generator(self,topic: str, learner_lvl: str, content_lenth: int):   
        assessment_prompt_template = ChatPromptTemplate.from_template(
            """
            You are an **Academic Assessment Engine** for DirectEd, specializing in creating structured, high-quality, and fair examinations.

            **Your Role:** Generate an exam based on the provided topic and source content.
            **Difficulty Level:** {difficulty_level}
            
            **Source Content (Context):** {content}
            **Exam Topic/Scope:** {topic}

            ### Output Format and Instruction Guidelines:
            
            1.  **Strict Constraint (The "Exam Rule"):**
                * You **MUST** output the exam questions and the answer key in two clearly separated sections.
                * The **first section** must contain **only the questions** (no answers, hints, or explanations).
                * The **second section** must be wrapped in JSON format and labeled `ANSWER_KEY_JSON`.
                * This JSON must not be shown to the user unless explicitly requested.

            2.  **Question Structure:**
                * Generate exactly **{num_questions}** questions.
                * Questions must be a mix of **Multiple Choice (MCQ)** and **Short Answer (SA)** questions, clearly labeled.
                * **MCQs** must have 4 distinct options (A, B, C, D).
                * All questions **MUST** be based **STRICTLY** on the 'Source Content' provided.

            3.  **Output Structure (Mandatory):**
            
                --- EXAM QUESTIONS ---
                
                **Subject:** {topic} - {difficulty_level} Assessment
                
                **Instructions:** Answer all questions below. Do NOT look ahead.
                
                1. [Question Type: MCQ] Question text...
                A. Option A
                B. Option B
                C. Option C
                D. Option D
                
                2. [Question Type: SA] Question text...
                
                [... Continue for {num_questions} questions ...]
                
                --- ANSWER KEY (HIDDEN JSON FORMAT) ---
                
                ```json
                {{
                    "exam_topic": "{topic}",
                    "difficulty_level": "{difficulty_level}",
                    "answer_key": [
                        {{
                            "question_number": 1,
                            "question_type": "MCQ",
                            "correct_answer": "B",
                            "explanation": "Explanation of why option B is correct."
                        }},
                        {{
                            "question_number": 2,
                            "question_type": "SA",
                            "correct_answer": "Short descriptive answer text.",
                            "explanation": "Short justification of the key idea."
                        }}
                        [... Continue for all {num_questions} questions ...]
                    ]
                }}
                ```
                
                *Do not display or discuss this JSON data unless explicitly requested. When requested, then provided the answer in a well formatted, professional way*

        ### Final Output Constraint: (CRITICAL)
        **YOUR ENTIRE RESPONSE MUST BE A SINGLE, VALID JSON OBJECT.**
        Do NOT include any text, headers, or commentary outside this final JSON structure.
        
        ALSO INCLUDE THE FOLLOWING IN THE GENERATED OUTPUT
        {{
        "subject": "This will be the title of the output. For example: 'Web development Assessment'",
        "output": "This will contain the actual generated content, including the EXAM QUESTIONS and the ANSWER KEY (JSON) embedded within it."
        }}
        Output ONLY valid JSON, with all keys and string values wrapped in double quotes (").

        """)
        assessment_chain = assessment_prompt_template | llm | StrOutputParser()
        return await assessment_chain.ainvoke({
            "difficulty_level": learner_lvl,
            "topic": topic,
            "num_questions": content_lenth,
            "content" : EducationalRetriever().get_documents(query=topic)
        })
        
class AdaptiveConversationChain:
        # @traceable(run_type="chain")
        async def answer_generation(self, query: str):
            answer_prompt_template = ChatPromptTemplate.from_template(
            """
            You are an **AI Tutor** for DirectEd, a tech learning platform.

            **Your Role:** Personalize the explanation based on the user's level, using both provided content and your general knowledge.
            **Learner Persona:** {persona}
        
            **Source Content:** {content}
            **User Question:** {question}

            ### Explanation Guidelines:
            - **Knowledge Base:** Prioritize information from the **'Source Content'** when relevant. If the source content is insufficient or a concept is better explained using general knowledge, supplement or answer using your **internal expertise**.
            - **Personalization:** Tailor the **tone, vocabulary, and complexity** to the '{persona}' (e.g., if the persona is 'Beginner', keep it very simple).
            - **Structure:**
                - Start with a concise, beginner-friendly summary.
                - Use **bullet points or step-by-step lists** for clarity.
                - Include one relevant real-world analogy or example suitable for the persona.
            - **Motivation & Concision:** Be encouraging and keep the explanation between **75 and 150 words** if it requires in-depth explanation. Otherwise keep it between **50 and 100 words**.
            """
)
            answer_chain = answer_prompt_template | llm | StrOutputParser()
            return await answer_chain.ainvoke({
                "question": query,
                "content": EducationalRetriever().get_documents(query=query),
                "persona": "Beginner"
                } )
    

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