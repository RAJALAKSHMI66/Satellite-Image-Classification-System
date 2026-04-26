import numpy as np
from matplotlib.gridspec import GridSpec
import seaborn as sns

import matplotlib.pyplot as plt


def plot_image(image, title="Image", cmap="viridis"):
    """Display a single image."""
    plt.figure(figsize=(8, 8))
    plt.imshow(image, cmap=cmap)
    plt.title(title)
    plt.axis("off")
    plt.tight_layout()
    plt.show()


def plot_image_grid(images, labels=None, title="Image Grid", rows=2, cols=2):
    """Display multiple images in a grid."""
    fig, axes = plt.subplots(rows, cols, figsize=(12, 10))
    axes = axes.flatten()
    
    for idx, (ax, image) in enumerate(zip(axes, images)):
        ax.imshow(image, cmap="viridis")
        if labels:
            ax.set_title(labels[idx])
        ax.axis("off")
    
    fig.suptitle(title, fontsize=16)
    plt.tight_layout()
    plt.show()


def plot_confusion_matrix(cm, class_names, title="Confusion Matrix"):
    """Visualize confusion matrix."""
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", 
                xticklabels=class_names, yticklabels=class_names)
    plt.title(title)
    plt.ylabel("True Label")
    plt.xlabel("Predicted Label")
    plt.tight_layout()
    plt.show()


def plot_training_history(history, metrics=["loss", "accuracy"]):
    """Plot training and validation metrics."""
    fig, axes = plt.subplots(1, len(metrics), figsize=(15, 5))
    
    for idx, metric in enumerate(metrics):
        axes[idx].plot(history[metric], label=f"Train {metric}")
        axes[idx].plot(history[f"val_{metric}"], label=f"Val {metric}")
        axes[idx].set_title(f"{metric.capitalize()}")
        axes[idx].set_xlabel("Epoch")
        axes[idx].set_ylabel(metric.capitalize())
        axes[idx].legend()
        axes[idx].grid(True)
    
    plt.tight_layout()
    plt.show()
