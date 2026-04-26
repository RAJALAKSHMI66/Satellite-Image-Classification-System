# utils/data_preparation.py

"""
Data preparation utilities for satellite image classification
"""

import os
import requests
import zipfile
from pathlib import Path
import shutil
import cv2
import numpy as np
import tensorflow as tf
import pandas as pd

class DatasetDownloader:
    """Download and prepare satellite imagery datasets"""
    
    def __init__(self, save_dir='./datasets'):
        self.save_dir = Path(save_dir)
        self.save_dir.mkdir(parents=True, exist_ok=True)
    
    def download_eurosat(self):
        """Download EuroSAT dataset (RGB version)"""
        print("Downloading EuroSAT dataset...")
        
        url = "http://madm.dfki.de/files/sentinel/EuroSAT.zip"
        
        zip_path = self.save_dir / "eurosat.zip"
        extract_path = self.save_dir / "eurosat"
        
        # Download
        response = requests.get(url, stream=True)
        with open(zip_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Extract
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
        
        # Clean up
        os.remove(zip_path)
        
        print(f"EuroSAT dataset downloaded to: {extract_path}")
        return extract_path
    
    def organize_custom_dataset(self, source_dir, target_dir):
        """Organize custom dataset into proper structure"""
        target_path = Path(target_dir)
        target_path.mkdir(parents=True, exist_ok=True)
        
        print(f"Organizing dataset from {source_dir} to {target_dir}")


def batch_process_directory(input_dir, output_csv, model_path):
    """Process entire directory of images and save results"""
    
    print(f"Processing images from: {input_dir}")
    
    # Load model
    model = tf.keras.models.load_model(model_path)
    CLASS_NAMES = ['forest', 'urban', 'water', 'agricultural', 'desert']
    
    results = []
    
    for img_path in Path(input_dir).glob('*.jpg') + list(Path(input_dir).glob('*.png')):
        try:
            # Preprocess
            img = cv2.imread(str(img_path))
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = cv2.resize(img, (224, 224))
            img = img.astype('float32') / 255.0
            img = np.expand_dims(img, axis=0)
            
            # Predict
            predictions = model.predict(img, verbose=0)[0]
            predicted_class_idx = np.argmax(predictions)
            
            results.append({
                'filename': img_path.name,
                'predicted_class': CLASS_NAMES[predicted_class_idx],
                'confidence': float(predictions[predicted_class_idx]),
                **{f'prob_{CLASS_NAMES[i]}': float(predictions[i]) for i in range(len(CLASS_NAMES))}
            })
            
        except Exception as e:
            print(f"Error processing {img_path.name}: {e}")
    
    # Save results
    df = pd.DataFrame(results)
    df.to_csv(output_csv, index=False)
    
    print(f"\nProcessed {len(results)} images")
    print(f"Results saved to: {output_csv}")
    
    return df


if __name__ == '__main__':
    # Example usage
    downloader = DatasetDownloader()
    # dataset_path = downloader.download_eurosat()
