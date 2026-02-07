# src/utils.py

import matplotlib.pyplot as plt


def plot_training_curves(history):
    acc = history.history.get("accuracy", [])
    loss = history.history.get("loss", [])
    epochs = range(len(acc))

    plt.figure(figsize=(12, 5))

    plt.subplot(1, 2, 1)
    plt.plot(epochs, acc, label="Training Accuracy")
    plt.legend()
    plt.title("Training Accuracy")

    plt.subplot(1, 2, 2)
    plt.plot(epochs, loss, label="Training Loss")
    plt.legend()
    plt.title("Training Loss")

    plt.show()
