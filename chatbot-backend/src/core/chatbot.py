from langsmith import traceable
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from components import llm


def router(user_input: str) -> str:
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

    return router_chain.invoke({
        "user_input": user_input
    })

@traceable
def run_educational_assistant():
    pass