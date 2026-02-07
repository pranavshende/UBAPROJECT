# src/train.py

import os
from tensorflow import keras
from tqdm.keras import TqdmCallback


def compile_model(model: keras.Model, learning_rate: float):
    """
    Compiles model for initial training.
    """
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
        loss=keras.losses.SparseCategoricalCrossentropy(),
        metrics=["accuracy"]
    )
    return model


def recompile_for_finetuning(model: keras.Model, learning_rate: float):
    """
    Recompiles model for fine-tuning with lower learning rate.
    """
    model.compile(
        optimizer=keras.optimizers.RMSprop(learning_rate=learning_rate),
        loss=keras.losses.SparseCategoricalCrossentropy(),
        metrics=["accuracy"]
    )
    return model


def train_model(
    model: keras.Model,
    train_ds,
    epochs: int,
    early_stopping_patience: int
):
    """
    Trains the model on the given dataset.
    Assumes dataset is already preprocessed and shuffled.
    """

    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor="loss",          # training-only (no val set yet)
            patience=early_stopping_patience,
            restore_best_weights=True
        ),
        TqdmCallback(verbose=0)
    ]

    history = model.fit(
        train_ds,
        epochs=epochs,
        callbacks=callbacks,
        verbose=0
    )

    return history


def get_final_accuracy(history) -> float:
    return history.history["accuracy"][-1]


def save_model_weights(
    model: keras.Model,
    save_dir: str,
    filename: str
):
    """
    Saves model weights only.
    """
    os.makedirs(save_dir, exist_ok=True)
    path = os.path.join(save_dir, filename)
    model.save_weights(path)
    return path
