# src/preprocessing.py

from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


def get_data_augmentation():
    return keras.Sequential(
        [
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.2),
            layers.RandomContrast(0.2),
            layers.RandomZoom(0.5, 0.2),
        ],
        name="data_augmentation"
    )


def get_preprocess_input():
    return preprocess_input
