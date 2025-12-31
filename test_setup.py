# Create test file: test_setup.py
import tensorflow as tf
import cv2
import numpy as np
import matplotlib.pyplot as plt

print("✓ TensorFlow version:", tf.__version__)
print("✓ GPU Available:", tf.config.list_physical_devices('GPU'))
print("✓ OpenCV version:", cv2.__version__)
print("✓ NumPy version:", np.__version__)
print("\n🎉 Setup successful!")