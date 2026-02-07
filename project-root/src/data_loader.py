# src/data_loader.py

import os
import tensorflow as tf
from tensorflow.keras.preprocessing import image_dataset_from_directory

AUTOTUNE = tf.data.AUTOTUNE


def load_image_dataset(
    data_dir: str,
    img_size: int,
    batch_size: int,
    shuffle: bool = True
):
    """
    Loads image dataset from directory.

    Images are loaded as uint8 [0, 255].
    Preprocessing is applied later in the pipeline.
    """

    if not os.path.exists(data_dir):
        raise FileNotFoundError(f"Dataset directory not found: {data_dir}")

    dataset = image_dataset_from_directory(
        data_dir,
        labels="inferred",
        label_mode="int",
        image_size=(img_size, img_size),
        batch_size=batch_size,
        shuffle=shuffle,
        interpolation="nearest"
    )

    return dataset, dataset.class_names


def _normalize(image, label):
    """
    Normalizes images to [-1, 1].

    This MUST match inference preprocessing exactly.
    """
    image = tf.cast(image, tf.float32)
    image = image / 127.5 - 1.0
    return image, label


def prepare_dataset(dataset: tf.data.Dataset, training: bool = True):
    """
    Applies normalization and performance optimizations.
    """

    # Apply normalization (ONCE)
    dataset = dataset.map(_normalize, num_parallel_calls=AUTOTUNE)

    if training:
        dataset = dataset.shuffle(buffer_size=1000)

    dataset = dataset.prefetch(AUTOTUNE)
    return dataset
