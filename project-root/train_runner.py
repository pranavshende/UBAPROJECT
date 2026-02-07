# train_runner.py

import json
from src.config import (
    IMG_SIZE,
    BATCH_SIZE,
    LEARNING_RATE,
    EPOCHS,
    EARLY_STOPPING_PATIENCE,
    FINE_TUNE_AT
)
from src.data_loader import load_image_dataset, prepare_dataset
from src.model import (
    build_base_model,
    build_classification_model,
    enable_fine_tuning
)
from src.train import (
    compile_model,
    recompile_for_finetuning,
    train_model,
    save_model_weights
)

# --------------------------------------------------
# Paths
# --------------------------------------------------

DATA_DIR = "data/cotton_disease"
ARTIFACTS_DIR = "artifacts"

# --------------------------------------------------
# Load dataset
# --------------------------------------------------

print("Loading dataset...")
train_ds, class_names = load_image_dataset(
    DATA_DIR,
    IMG_SIZE,
    BATCH_SIZE,
    shuffle=True
)

train_ds = prepare_dataset(train_ds, training=True)

print("Class order (CRITICAL):", class_names)

# --------------------------------------------------
# Build model
# --------------------------------------------------

print("Building model...")

base_model = build_base_model(IMG_SIZE)

model = build_classification_model(
    img_size=IMG_SIZE,
    num_classes=len(class_names),
    base_model=base_model,
    data_augmentation=None
)

# --------------------------------------------------
# Initial training
# --------------------------------------------------

print("Starting initial training...")

model = compile_model(model, LEARNING_RATE)

history = train_model(
    model,
    train_ds,
    epochs=EPOCHS,
    early_stopping_patience=EARLY_STOPPING_PATIENCE
)

# --------------------------------------------------
# Fine-tuning (OPTIONAL BUT RECOMMENDED)
# --------------------------------------------------

print("Starting fine-tuning...")

enable_fine_tuning(base_model, FINE_TUNE_AT)

model = recompile_for_finetuning(
    model,
    LEARNING_RATE / 10
)

history_finetune = train_model(
    model,
    train_ds,
    epochs=EPOCHS,
    early_stopping_patience=EARLY_STOPPING_PATIENCE
)

# --------------------------------------------------
# Save artifacts
# --------------------------------------------------

print("Saving model weights and class names...")

weights_path = save_model_weights(
    model,
    ARTIFACTS_DIR,
    "cotton_disease_clean.weights.h5"
)

with open(f"{ARTIFACTS_DIR}/class_names.json", "w") as f:
    json.dump(class_names, f)

print("Training complete.")
print("Weights saved at:", weights_path)
print("Class names saved.")
