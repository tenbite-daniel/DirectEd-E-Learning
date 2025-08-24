import json
import random

def generate_educational_example(track, topic, subtopic, example_type):
    """
    Generates a single educational example based on a template.
    """
    templates = {
        "tutoring": {
            "prompt": f"You are a tutor for the {track} tech track. Explain the topic of {subtopic} within {topic} in a clear, encouraging tone. End with a question to test the student's understanding.",
            "completion_start": f"Hello! Let's talk about {subtopic} in {topic}. "
        },
        "assessment": {
            "prompt": f"You are an assessment creator for the {track} tech track. Create one quiz question for the topic of {subtopic} within {topic} at a {random.choice(['Beginner', 'Intermediate', 'Advanced'])} difficulty level. Provide multiple-choice options and the correct answer.",
            "completion_start": f"Quiz: "
        }
    }
    
    selected_template = templates[example_type]

    # I am using pre-defined content to simulate LLM output
    if track == "Gen AI":
        if subtopic == "Prompt Engineering":
            completion_content = "Zero-shot prompting is when you ask a model a question without any examples. Few-shot prompting is when you provide a few examples to guide the model's response. What's the main benefit of few-shot prompting?" if example_type == "tutoring" else "What is the key difference between zero-shot and few-shot prompting? a) Model size b) Number of examples in the prompt c) Training data d) Temperature setting. (Answer: b) Number of examples in the prompt)"
        elif subtopic == "RAG":
            completion_content = "RAG systems improve accuracy by letting the model access external knowledge bases, reducing the risk of making things up. How does this improve factual accuracy?" if example_type == "tutoring" else "What does 'Retrieval' in RAG refer to? a) Retrieving user input b) Retrieving data from an external source c) Retrieving the model’s weights d) Retrieving conversational history. (Answer: b) Retrieving data from an external source)"
        elif subtopic == "Transformers":
             completion_content = "The Transformer architecture is a type of neural network that uses self-attention to weigh the importance of different parts of the input sequence. Why is this important for understanding long sentences?" if example_type == "tutoring" else "What mechanism allows a Transformer to weigh the importance of different words in a sentence? a) Convolutional layers b) Recurrent loops c) Attention d) Pooling. (Answer: c) Attention)"
    elif track == "MERN":
        if subtopic == "React State":
            completion_content = "State is data that changes over time and affects how a component renders. You can manage it with hooks like `useState`. What's one example of a piece of data you would manage with state?" if example_type == "tutoring" else "Which React Hook is used for managing component-level state? a) useEffect b) useContext c) useState d) useReducer. (Answer: c) useState)"
        elif subtopic == "MongoDB Queries":
            completion_content = "MongoDB uses JSON-like documents. You can use query operators like `$gt` (greater than) to find documents. For example, to find all users over 25. How would you find all posts from a specific date?" if example_type == "tutoring" else "What operator finds documents where an array field contains all the specified elements? a) $in b) $all c) $elemMatch d) $each. (Answer: b) $all)"
        elif subtopic == "Express Middleware":
            completion_content = "Middleware in Express.js are functions that run in the middle of a request and response cycle. They can modify the request or response objects before they reach the final route handler. What kind of tasks are good for middleware?" if example_type == "tutoring" else "Middleware in Express.js is most often used for which of the following? a) Frontend rendering b) User authentication and logging c) Database configuration d) Styling webpages. (Answer: b) User authentication and logging)"
    elif track == "UI/UX":
        if subtopic == "Accessibility (WCAG)":
            completion_content = "WCAG's POUR principles ensure web content is accessible to everyone. POUR stands for Perceivable, Operable, Understandable, and Robust. What's an example of an 'Operable' component?" if example_type == "tutoring" else "According to WCAG, which principle ensures users can interact with all UI components? a) Perceivable b) Operable c) Understandable d) Robust. (Answer: b) Operable)"
        elif subtopic == "Usability":
            completion_content = "Usability is about how easy a product is to use. A highly usable product is efficient and satisfying. How would you test if an app is easy to use?" if example_type == "tutoring" else "Which of the following best describes usability? a) How visually appealing a product is b) How quickly users can accomplish tasks with a product c) The speed of a website d) How many features a product has. (Answer: b) How quickly users can accomplish tasks with a product)"
        elif subtopic == "Prototyping":
            completion_content = "Prototyping involves creating drafts of your product. Low-fidelity prototypes are simple and quick to create, while high-fidelity prototypes are more detailed and interactive. When would you use a low-fidelity prototype?" if example_type == "tutoring" else "A low-fidelity prototype is characterized by its: a) High-detail, interactive design b) Simplicity and use of paper sketches c) Final code and polished look d) Full database integration. (Answer: b) Simplicity and use of paper sketches)"

    return {
        "prompt": selected_template["prompt"],
        "completion": selected_template["completion_start"] + completion_content
    }

def generate_datasets(num_examples=300):
    """Generates and saves the training and validation datasets."""
    tracks = ["Gen AI", "MERN", "UI/UX"]
    topics = {
        "Gen AI": ["Prompt Engineering", "RAG", "Transformers"],
        "MERN": ["React State", "MongoDB Queries", "Express Middleware"],
        "UI/UX": ["Accessibility (WCAG)", "Usability", "Prototyping"]
    }
    
    data = []
    for _ in range(num_examples):
        track = random.choice(tracks)
        topic = random.choice(topics[track])
        example_type = random.choice(["tutoring", "assessment"])
        
        example = generate_educational_example(track, "Curriculum", topic, example_type)
        data.append(example)

    # Split into training and validation sets
    random.shuffle(data)
    split_point = int(len(data) * 0.9)
    train_data = data[:split_point]
    val_data = data[split_point:]

    # Save to JSON files
    with open('../data/raw/raw_training_data.json', 'w') as f:
        json.dump(train_data, f, indent=2)
    with open('../data/raw/raw_validation_data.json', 'w') as f:
        json.dump(val_data, f, indent=2)

    print(f"Generated {len(train_data)} training examples.")
    print(f"Generated {len(val_data)} validation examples.")

if __name__ == "__main__":
    generate_datasets(num_examples=300)