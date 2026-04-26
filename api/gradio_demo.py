# api/gradio_demo.py

"""
Interactive web interface using Gradio
Run: python api/gradio_demo.py
"""

import cv2
import numpy as np
import tensorflow as tf
import gradio as gr


def create_gradio_interface():
    """Create Gradio interface for model demo"""
    
    # Load model
    try:
        model = tf.keras.models.load_model('models/satellite_classifier_final.h5')
        print("✓ Model loaded successfully")
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        return None
    
    CLASS_NAMES = ['forest', 'urban', 'water', 'agricultural', 'desert']
    
    def classify_image(image):
        """Classify uploaded image"""
        if image is None:
            return None
        
        # Preprocess
        img = cv2.resize(image, (224, 224))
        img = img.astype('float32') / 255.0
        img = np.expand_dims(img, axis=0)
        
        # Predict
        predictions = model.predict(img, verbose=0)[0]
        
        # Format results as dict for Gradio
        return {CLASS_NAMES[i]: float(predictions[i]) for i in range(len(CLASS_NAMES))}
    
    # Create interface
    interface = gr.Interface(
        fn=classify_image,
        inputs=gr.Image(type="numpy", label="Upload Satellite Image"),
        outputs=gr.Label(num_top_classes=5, label="Classification Results"),
        title="🛰️ Satellite Image Classifier",
        description="Upload a satellite image to classify it into categories: Forest, Urban, Water, Agricultural, or Desert",
        examples=[
        ],
        theme="default"
    )
    
    return interface


if __name__ == '__main__':
    print("="*60)
    print("Starting Gradio Interface...")
    print("="*60)
    interface = create_gradio_interface()
    if interface:
        interface.launch(share=True)
    else:
        print("Failed to create interface")
