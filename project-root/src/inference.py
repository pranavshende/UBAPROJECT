# src/inference.py

import numpy as np
import tensorflow as tf
from PIL import Image


def load_image(image_path: str, img_size: int):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((img_size, img_size))
    img = np.array(img, dtype=np.float32)
    img = np.expand_dims(img, axis=0)
    return img


def predict_image(
    model: tf.keras.Model,
    image_path: str,
    img_size: int,
    class_names: list
):
    image = load_image(image_path, img_size)
    preds = model.predict(image, verbose=0)

    class_index = int(np.argmax(preds))
    confidence = float(np.max(preds))

    return {
        "predicted_class": class_names[class_index],
        "confidence": confidence
    }
