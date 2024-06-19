from transformers import DistilBertForQuestionAnswering, DistilBertTokenizerFast, Trainer, TrainingArguments
from datasets import load_dataset, Dataset

# Load the dataset
data = load_dataset('json', data_files='training_data.jsonl')

# Tokenizer
tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')

# Preprocess the dataset
def preprocess(examples):
    questions = [q.strip() for q in examples['question']]
    answers = [a.strip() for a in examples['answer']]
    inputs = tokenizer(questions, padding=True, truncation=True, max_length=256)
    outputs = tokenizer(answers, padding=True, truncation=True, max_length=256)
    inputs['labels'] = outputs['input_ids']
    return inputs

tokenized_data = data.map(preprocess, batched=True, remove_columns=["question", "answer"])

# Load the model
model = DistilBertForQuestionAnswering.from_pretrained('distilbert-base-uncased')

# Training arguments
training_args = TrainingArguments(
    output_dir='./results',
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_data['train'],
    eval_dataset=tokenized_data['test'],
)

# Train the model
trainer.train()

# Save the model
model.save_pretrained('./finetuned_model')
tokenizer.save_pretrained('./finetuned_model')
