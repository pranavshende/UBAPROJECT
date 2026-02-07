from src.config import (
    IMG_SIZE,
    BATCH_SIZE,
    LEARNING_RATE,
    EPOCHS,
    EARLY_STOPPING_PATIENCE,
    FINE_TUNE_AT
)
from src.data_loader import load_image_dataset, prepare_dataset
from src.preprocessing import get_data_augmentation
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

DATA_DIR = "data/cotton_disease"
MODEL_DIR = "artifacts"

# Load dataset
train_ds, class_names = load_image_dataset(
    DATA_DIR, IMG_SIZE, BATCH_SIZE
)
train_ds = prepare_dataset(train_ds)

# Build model
base_model = build_base_model(IMG_SIZE)
augmentation = get_data_augmentation()

model = build_classification_model(
    IMG_SIZE,
    len(class_names),
    base_model,
    augmentation
)

# Initial training
model = compile_model(model, LEARNING_RATE)
train_model(model, train_ds, EPOCHS, EARLY_STOPPING_PATIENCE)

# Fine-tuning
enable_fine_tuning(base_model, FINE_TUNE_AT)
model = recompile_for_finetuning(model, LEARNING_RATE / 10)
train_model(model, train_ds, EPOCHS, EARLY_STOPPING_PATIENCE)

# Save weights
save_model_weights(
    model,
    MODEL_DIR,
    "cotton_disease_finetuned.weights.h5"
)


print("Training complete. Model saved.")
