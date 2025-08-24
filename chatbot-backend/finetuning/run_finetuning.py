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

#  Configuration and Loading Datasets
MODEL_NAME = "google/gemma-2b"
train_dataset = load_from_disk("../data/processed/train")
val_dataset = load_from_disk("../data/processed/val")

# Load Model with Quantization (cause I am using a CPU)
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float32,
)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    quantization_config=bnb_config,
    device_map="cpu"
)
model = prepare_model_for_kbit_training(model)

# Configure LoRA
peft_config = LoraConfig(r=8, lora_alpha=16, lora_dropout=0.05, bias="none", task_type="CAUSAL_LM")
model = get_peft_model(model, peft_config)
model.print_trainable_parameters()

# Load Tokenizer and Run Trainer
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
tokenizer.pad_token = tokenizer.eos_token
training_args = TrainingArguments(
    output_dir="./finetuned_adapters",
    per_device_train_batch_size=1,
    gradient_accumulation_steps=8,
    num_train_epochs=1,
    logging_steps=5,
    evaluation_strategy="steps",
    eval_steps=5,
    report_to="none",
)
trainer = SFTTrainer(model=model, train_dataset=train_dataset, eval_dataset=val_dataset, peft_config=peft_config, dataset_text_field="text", tokenizer=tokenizer, args=training_args, max_seq_length=256)

print("Starting training on CPU. This will be very slow.")
trainer.train()

# Save the fine-tuned adapters
trainer.save_model("finetuned_adapters")