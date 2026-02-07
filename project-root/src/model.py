# src/model.py

from tensorflow import keras
from tensorflow.keras import layers


def build_base_model(img_size: int, trainable: bool = False):
    """
    Builds the MobileNetV2 base model.
    Expects input images already normalized to [-1, 1].
    """

    base_model = keras.applications.MobileNetV2(
        input_shape=(img_size, img_size, 3),
        include_top=False,
        weights="imagenet"
    )

    base_model.trainable = trainable
    return base_model


def build_classification_model(
    img_size: int,
    num_classes: int,
    base_model: keras.Model,
    data_augmentation: keras.Model | None = None,
    dropout_rate: float = 0.2
):
    """
    Builds the full classification model.

    IMPORTANT:
    - This model assumes inputs are already normalized to [-1, 1]
    - No preprocessing happens inside the model
    """

    base_model.trainable = False

    inputs = keras.Input(shape=(img_size, img_size, 3))
    x = inputs

    # Optional augmentation (TRAINING ONLY)
    if data_augmentation is not None:
        x = data_augmentation(x)

    # Feature extraction
    x = base_model(x, training=False)

    # Classification head
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(dropout_rate)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = keras.Model(
        inputs=inputs,
        outputs=outputs,
        name="cotton_disease_classifier"
    )

    return model


def enable_fine_tuning(base_model: keras.Model, fine_tune_at: int):
    """
    Unfreezes top layers of the base model for fine-tuning.
    """

    base_model.trainable = True

    for layer in base_model.layers[:fine_tune_at]:
        layer.trainable = False

    return base_model
