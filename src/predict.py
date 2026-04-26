# src/predict.py

"""
Inference pipeline for trained models
"""

import cv2
import numpy as np
from tensorflow import keras


class SatelliteImagePredictor:
    """Load trained model and make predictions on new images"""
    
    def __init__(self, model_path, class_names, img_size=(224, 224)):
        self.model = keras.models.load_model(model_path)
        self.class_names = class_names
        self.img_size = img_size
        print(f"✓ Model loaded: {model_path}")
    
    def preprocess_image(self, image_path):
        """Preprocess single image for prediction"""
        img = cv2.imread(image_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, self.img_size)
        img = img.astype('float32') / 255.0
        img = np.expand_dims(img, axis=0)
        return img
    
    def predict(self, image_path):
        """Make prediction on single image"""
        img = self.preprocess_image(image_path)
        predictions = self.model.predict(img, verbose=0)[0]
        
        predicted_class = np.argmax(predictions)
        confidence = predictions[predicted_class]
        
        result = {
            'predicted_class': self.class_names[predicted_class],
            'confidence': float(confidence),
            'all_probabilities': {
                self.class_names[i]: float(predictions[i]) 
                for i in range(len(self.class_names))
            }
        }
        
        return result
    
    def predict_batch(self, image_paths):
        """Make predictions on multiple images"""
        results = []
        for path in image_paths:
            results.append(self.predict(path))
        return results


if __name__ == '__main__':
    # Example usage
    print("Example usage:")
    print("""
    from src.predict import SatelliteImagePredictor
    
    predictor = SatelliteImagePredictor(
        model_path='models/satellite_classifier_final.h5',
        class_names=['forest', 'urban', 'water', 'agricultural', 'desert']
    )
    
    result = predictor.predict('path/to/image.jpg')
    print(f"Predicted: {result['predicted_class']}")
    print(f"Confidence: {result['confidence']:.2%}")
    """)
