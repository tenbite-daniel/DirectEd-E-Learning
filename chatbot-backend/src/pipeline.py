#  Educational Pipeline using Google Gemini
from langchain.chains import LLMChain, SequentialChain
from langchain_google_vertexai import ChatGoogleGenerativeAI
from langchain.callbacks import LangSmithTracer
from src.templates import (
    content_retrieval_prompt,
    adaptive_conversation_prompt,
    content_generation_prompt,
    learning_analysis_prompt
)

MODEL_NAME = "gemini-1.5-flash"
TEMPERATURE = 0.2

llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=TEMPERATURE)

# Ensure LANGCHAIN_TRACING_V2 and LANGCHAIN_API_KEY environment variables are set.
tracer = LangSmithTracer(project_name="DirectEd_Education_Pipeline_Gemini")

# Content Retrieval Chain
# This chain takes user_question and retrieved_documents and generates the retrieved_content.
content_retrieval_chain = LLMChain(
    llm=llm,
    prompt=content_retrieval_prompt,
    output_key="retrieved_content",
    callbacks=[tracer]
)

#  Adaptive Conversation Chain
# This chain takes the user's question, the topic, and the content retrieved in the previous step. It then generates a response.
adaptive_conversation_chain = LLMChain(
    llm=llm,
    prompt=adaptive_conversation_prompt,
    output_key="conversation_response",
    callbacks=[tracer]
)

# Content Generation Chain
# This chain takes the topic, difficulty level, and retrieved content to generate a summary, quiz, and example.
content_generation_chain = LLMChain(
    llm=llm,
    prompt=content_generation_prompt,
    output_key="generated_content",
    callbacks=[tracer]
)

# Learning Analysis Chain
# This chain takes the full conversation history and generated content to provide a learning analysis.
learning_analysis_chain = LLMChain(
    llm=llm,
    prompt=learning_analysis_prompt,
    output_key="learning_analysis",
    callbacks=[tracer]
)

# SEQUENTIAL PIPELINE
# This pipeline runs the chains in a defined order.
# Note: The input_variables list only contains the *initial* inputs to the pipeline.
# Intermediate inputs (like retrieved_content) are handled automatically.
education_pipeline = SequentialChain(
    chains=[
        content_retrieval_chain,
        adaptive_conversation_chain,
        content_generation_chain,
        learning_analysis_chain
    ],
    input_variables=["user_question", "topic", "difficulty_level", "retrieved_documents", "conversation_history"],
    output_variables=["retrieved_content", "conversation_response", "generated_content", "learning_analysis"],
    verbose=True
)

# execution example
if __name__ == "__main__":
    # Example inputs
    user_question = "What are the best practices for creating accessible UI components?"
    topic = "UI/UX Design"
    difficulty_level = "Intermediate"
    retrieved_documents = """
    # Document 1: Web Content Accessibility Guidelines (WCAG)
    WCAG provides guidelines for making web content more accessible. Key principles are Perceivable, Operable, Understandable, and Robust (POUR).
    - Perceivable: Information and user interface components must be presentable to users in ways they can perceive.
    - Operable: User interface components and navigation must be operable.
    ... [rest of document] ...
    """
    conversation_history = "The student has previously asked about basic design principles and has a solid grasp of visual hierarchy."

    outputs = education_pipeline({
        "user_question": user_question,
        "topic": topic,
        "difficulty_level": difficulty_level,
        "retrieved_documents": retrieved_documents,
        "conversation_history": conversation_history
    })

    # Display outputs
    print("\n--- Retrieved Content ---")
    print(outputs["retrieved_content"])
    print("\n--- Conversation Response ---")
    print(outputs["conversation_response"])
    print("\n--- Generated Content ---")
    print(outputs["generated_content"])
    print("\n--- Learning Analysis ---")
    print(outputs["learning_analysis"])