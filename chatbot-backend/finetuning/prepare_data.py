import json
import os
from datasets import Dataset

def load_and_format_data(file_path):
    """Loads a JSON file and formats it for fine-tuning."""
    with open(file_path, 'r', encoding='utf-8') as f:
        # Load the raw data from the JSON file
        raw_data = json.load(f)

    # Converting each entry into a single string for fine-tuning
    formatted_data = []
    for entry in raw_data:
        formatted_example = f"### Instruction:\n{entry['prompt']}\n\n### Response:\n{entry['completion']}"
        formatted_data.append({"text": formatted_example})

    return Dataset.from_list(formatted_data)

if __name__ == "__main__":
    train_data_path = "./data/raw/raw_training_data.json"
    val_data_path = "./data/raw/raw_validation_data.json"

    # Loads and processes the datasets
    train_dataset = load_and_format_data(train_data_path)
    val_dataset = load_and_format_data(val_data_path)
    
    # Creates the processed directory if it doesn't exist
    processed_dir_train = "../data/processed/train"
    processed_dir_val = "../data/processed/val"
    os.makedirs(processed_dir_train, exist_ok=True)
    os.makedirs(processed_dir_val, exist_ok=True)

    # Save the processed datasets to disk
    train_dataset.save_to_disk(processed_dir_train)
    val_dataset.save_to_disk(processed_dir_val)
    
    print("Datasets successfully processed and saved to data/processed.")