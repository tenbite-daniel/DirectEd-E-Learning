---
base_model: google/gemma-2b
library_name: peft
model_name: finetuned_adapters
tags:
- base_model:adapter:google/gemma-2b
- lora
- sft
- transformers
- trl
licence: license
pipeline_tag: text-generation
---

# Model Card for finetuned_adapters

This model is a fine-tuned version of [google/gemma-2b](https://huggingface.co/google/gemma-2b).
It has been trained using [TRL](https://github.com/huggingface/trl).

---
language: en
tags:
  - education
  - curriculum
  - chatbot
  - fine-tuned
  - AI-assistant
  - DirectEd
license: mit
pipeline_tag: text-generation
---

# 🎓 DirectEd Curriculum Bot

**DirectEd-Curriculum-Bot** is a fine-tuned language model designed to serve as an **AI assistant for educational purposes**.  
It was trained on DirectEd's curriculum guidelines, textbooks, and lesson examples to help learners and educators quickly retrieve structured educational content.

---

## ✨ Model Description
- **Base model:** base_model:adapter:google/gemma-2b
- **Architecture:** Transformer-based LLM
- **Fine-tuning method:** LoRA
- **Trained on:** DirectEd curriculum materials
- **Languages:** English (`en`)
- **Pipeline:** `text-generation`

---

## 🎯 Intended Use
- Provide explanations of DirectEd curriculum content
- Help learners answer questions about lessons
- Support educators with quick curriculum insights
- Serve as a backend knowledge base for AI-powered apps

> ⚠️ **Note:** This model is not guaranteed to be factually perfect. It should be used as a support tool, not a substitute for expert teaching.

---

## 🚀 How to Use

You can run inference with `transformers` locally:

```python
from transformers import AutoTokenizer, AutoModelForCausalLM

model_name = "sidiushindi/DirectEd-Curriculum-Bot"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

prompt = "Explain the importance of critical thinking in the DirectEd curriculum."

inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=200)

print(tokenizer.decode(outputs[0], skip_special_tokens=True))

## Quick start

```python
from transformers import pipeline

question = "If you had a time machine, but could only go to the past or the future once and never return, which would you choose and why?"
generator = pipeline("text-generation", model="None", device="cuda")
output = generator([{"role": "user", "content": question}], max_new_tokens=128, return_full_text=False)[0]
print(output["generated_text"])
```

## Training procedure

 Training Data

DirectEd official curriculum guidelines

Textbooks and lesson examples

Supplementary educational material

## ⚠️ Limitations & Bias

The model reflects the scope of DirectEd’s materials only

May generate incomplete or verbose answers

Should not be used for grading or as the sole source of truth


This model was trained with SFT.

### Framework versions

- PEFT 0.17.0
- TRL: 0.21.0
- Transformers: 4.55.2
- Pytorch: 2.8.0+cu126
- Datasets: 4.0.0
- Tokenizers: 0.21.4

## Citations



Cite TRL as:
    
`@misc{directed2025,
  author = {Sidi Ushindi},
  title = {DirectEd Curriculum Bot},
  year = {2025},
  publisher = {Hugging Face},
  howpublished = https://huggingface.co/sidiushindi/DirectEd-Curriculum-Bot
}

```
