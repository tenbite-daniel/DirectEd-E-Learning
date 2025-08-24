import torch
from datasets import load_from_disk
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    BitsAndBytesConfig,
    TrainingArguments,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer
import os
import gc
import transformers
import peft
import trl

# Print versions for debugging
print(f"Transformers version: {transformers.__version__}")
print(f"PEFT version: {peft.__version__}")
print(f"TRL version: {trl.__version__}")

# Configuration
MODEL_NAME = "google/gemma-2b"

# Clear GPU memory
if torch.cuda.is_available():
    torch.cuda.empty_cache()
    gc.collect()

# Use GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device.upper()}")
if torch.cuda.is_available():
    print(f"GPU memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")

# Load Datasets
train_dataset_path = "data/processed/train"
val_dataset_path = "data/processed/val"

assert os.path.exists(train_dataset_path), f"Training dataset not found: {train_dataset_path}"
assert os.path.exists(val_dataset_path), f"Validation dataset not found: {val_dataset_path}"

train_dataset = load_from_disk(train_dataset_path)
val_dataset = load_from_disk(val_dataset_path)

print(f"Train dataset size: {len(train_dataset)}")
print(f"Val dataset size: {len(val_dataset)}")

# Check dataset structure
print("Train dataset columns:", train_dataset.column_names if hasattr(train_dataset, 'column_names') else "Unknown")
print("Sample data:", train_dataset[0] if len(train_dataset) > 0 else "Empty dataset")

#  Preprocess Datasets for Sequence Length
def preprocess_dataset(dataset, max_length=256):
    """Preprocess dataset to handle sequence length"""
    def tokenize_function(examples):
        # Tokenize the text
        tokenized = tokenizer(
            examples["text"],
            truncation=True,
            padding=False,  
            max_length=max_length,
            return_tensors=None,
        )
        return tokenized
    
    # Apply tokenization
    tokenized_dataset = dataset.map(
        tokenize_function,
        batched=True,
        remove_columns=dataset.column_names,
        desc="Tokenizing dataset"
    )
    
    return tokenized_dataset

# Loading Tokenizer
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
except Exception as e:
    print(f"Error loading tokenizer: {e}")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.pad_token_id = tokenizer.eos_token_id

# Preprocess datasets with tokenization
print("Preprocessing datasets...")
train_dataset_processed = preprocess_dataset(train_dataset, max_length=256)
val_dataset_processed = preprocess_dataset(val_dataset, max_length=256)

print(f"Processed train dataset size: {len(train_dataset_processed)}")
print(f"Processed val dataset size: {len(val_dataset_processed)}")

# Load Model with Quantization
try:
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=True,
    )

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True,
        torch_dtype=torch.float16,
        low_cpu_mem_usage=True,
    )
except Exception as e:
    print(f"Error with quantization config: {e}")
    print("Trying without quantization...")
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        device_map="auto",
        trust_remote_code=True,
        torch_dtype=torch.float16,
    )

# Preparing model for k-bit training
try:
    model = prepare_model_for_kbit_training(model)
except Exception as e:
    print(f"Warning: prepare_model_for_kbit_training failed: {e}")

#  Configure LoRA
try:
    # Try with specific target modules first
    peft_config = LoraConfig(
        r=8,
        lora_alpha=16,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    )
except Exception as e:
    print(f"Error with specific target modules: {e}")
    # Fallback to basic config
    peft_config = LoraConfig(
        r=8,
        lora_alpha=16,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
    )

try:
    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()
except Exception as e:
    print(f"Error applying PEFT: {e}")
    raise e

#  Training Arguments - Version Compatible
def create_training_args():
    """Create training arguments compatible with different transformers versions"""
    base_args = {
        "output_dir": "./finetuned_adapters",
        "per_device_train_batch_size": 1,
        "gradient_accumulation_steps": 8,
        "num_train_epochs": 1,
        "logging_steps": 5,
        "save_strategy": "steps",
        "save_steps": 50,
        "learning_rate": 2e-4,
        "warmup_steps": 10,
        "report_to": "none",
    }
    
    # Add optional parameters based on version compatibility
    try:
        # Try newer parameter names first
        optional_args = {
            "eval_strategy": "steps",
            "eval_steps": 50,
            "per_device_eval_batch_size": 1,
        }
        test_args = TrainingArguments(**{**base_args, **optional_args})
        return test_args
    except TypeError as e:
        print(f"New parameter format failed: {e}")
        try:
            # Try older parameter names since the new ones have failed
            optional_args = {
                "evaluation_strategy": "steps",
                "eval_steps": 50,
                "per_device_eval_batch_size": 1,
            }
            test_args = TrainingArguments(**{**base_args, **optional_args})
            return test_args
        except TypeError:
            print("Using minimal training arguments")
            return TrainingArguments(**base_args)

training_args = create_training_args()

# SFTTrainer - Version Compatible
def create_sft_trainer():
    """Create SFTTrainer with version-compatible parameters"""
    
    # Starting with absolutely minimal parameters
    minimal_args = {
        "model": model,
        "train_dataset": train_dataset,
        "args": training_args,
    }
    
    # Trying to add parameters one by one to find what works
    try:
        # Trying minimal first
        print("Trying minimal SFTTrainer...")
        return SFTTrainer(
            model=model,
            train_dataset=train_dataset,
            args=training_args,
        )
    except Exception as e:
        print(f"Minimal SFTTrainer failed: {e}")
    
    try:
        # Try with eval dataset
        print("Trying with eval_dataset...")
        return SFTTrainer(
            model=model,
            train_dataset=train_dataset_processed,
            eval_dataset=val_dataset_processed,
            args=training_args,
        )
    except Exception as e:
        print(f"SFTTrainer with eval_dataset failed: {e}")
    
    try:
        # Try with peft_config
        print("Trying with peft_config...")
        return SFTTrainer(
            model=model,
            train_dataset=train_dataset,
            peft_config=peft_config,
            args=training_args,
        )
    except Exception as e:
        print(f"SFTTrainer with peft_config failed: {e}")
    
    try:
        # Try with just model and args
        print("Trying absolute minimal...")
        return SFTTrainer(
            model=model,
            train_dataset=train_dataset_processed,
            args=training_args,
        )
    except Exception as e:
        print(f"All SFTTrainer attempts failed: {e}")
        raise e

trainer = create_sft_trainer()

# Starts Training with Comprehensive Error Handling
def run_training():
    try:
        print("Starting training...")
        print(f"Training samples: {len(train_dataset_processed)}")
        print(f"Validation samples: {len(val_dataset_processed)}")
        
        trainer.train()
        
        # Save the final model
        print("Saving model...")
        trainer.save_model()
        
        # Save tokenizer
        tokenizer.save_pretrained(training_args.output_dir)
        
        print("Training completed successfully!")
        print(f"Model saved to: {training_args.output_dir}")
        
    except RuntimeError as e:
        if "out of memory" in str(e).lower():
            print("CUDA Out of Memory Error!")
            print("Try reducing batch size or sequence length")
            print(f"Current batch size: {training_args.per_device_train_batch_size}")
            print(f"Current max_seq_length: 256")
            
            # Clear GPU memory
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                gc.collect()
                
        print(f"Runtime error: {e}")
        raise e
        
    except Exception as e:
        print(f"Training failed with error: {e}")
        print(f"Error type: {type(e).__name__}")
        
        # Clear GPU memory in case of error
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            gc.collect()
            
        raise e

# Run the training
if __name__ == "__main__":
    run_training()
