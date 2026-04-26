# api/flask_api.py

"""
Flask API for serving the trained model
Run: python api/flask_api.py
"""

import os
import cv2
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Load model at startup
MODEL_PATH = 'models/satellite_classifier_final.h5'
model = None
CLASS_NAMES = ['forest', 'urban', 'water', 'agricultural', 'desert']

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"✓ Model loaded successfully: {MODEL_PATH}")
except Exception as e:
    print(f"✗ Error loading model: {e}")


def preprocess_image(image_path):
    """Preprocess image for prediction"""
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0)
    return img


@app.route('/predict', methods=['POST'])
def predict():
    """API endpoint for image classification"""
    
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400
    
    try:
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join('/tmp', filename)
        file.save(filepath)
        
        # Preprocess and predict
        img = preprocess_image(filepath)
        predictions = model.predict(img, verbose=0)[0]
        
        # Clean up
        os.remove(filepath)
        
        # Format results
        predicted_class_idx = np.argmax(predictions)
        result = {
            'predicted_class': CLASS_NAMES[predicted_class_idx],
            'confidence': float(predictions[predicted_class_idx]),
            'all_probabilities': {
                CLASS_NAMES[i]: float(predictions[i])
                for i in range(len(CLASS_NAMES))
            }
        }
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'classes': CLASS_NAMES
    }), 200


if __name__ == '__main__':
    print("="*60)
    print("Starting Flask API server...")
    print(f"Model: {MODEL_PATH}")
    print(f"Classes: {CLASS_NAMES}")
    print("="*60)
    app.run(host='0.0.0.0', port=5000, debug=False)
