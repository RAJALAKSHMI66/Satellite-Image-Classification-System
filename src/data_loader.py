# src/data_loader.py

"""
Data loading and preprocessing for satellite images (Memory-Efficient)
"""

import numpy as np
import cv2
import os


class SatelliteDataLoader:
    """Handle satellite image data loading and preprocessing (memory-efficient)"""
    
    def __init__(self, data_dir, img_size=(224, 224), classes=None):
        self.data_dir = data_dir
        self.img_size = img_size
        self.classes = classes or ['forest', 'urban', 'water', 'agricultural', 'desert']
        self.image_paths = []
        self.image_labels = []
        self._index_images()
        
    def _index_images(self):
        """Index all image paths without loading them"""
        for class_idx, class_name in enumerate(self.classes):
            class_path = os.path.join(self.data_dir, class_name)
            if not os.path.exists(class_path):
                continue
                
            for img_file in os.listdir(class_path):
                if img_file.lower().endswith(('.jpg', '.png', '.jpeg')):
                    img_path = os.path.join(class_path, img_file)
                    self.image_paths.append(img_path)
                    self.image_labels.append(class_idx)
    
    def load_image(self, image_path):
        """Load and preprocess single image"""
        img = cv2.imread(image_path)
        if img is not None:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = cv2.resize(img, self.img_size)
            img = img.astype('float32') / 255.0
        return img
    
    def get_batch(self, indices):
        """Load a batch of images by indices"""
        images = []
        labels = []
        
        for idx in indices:
            img = self.load_image(self.image_paths[idx])
            if img is not None:
                images.append(img)
                labels.append(self.image_labels[idx])
        
        return np.array(images), np.array(labels)
    
    def get_generator(self, indices, batch_size=32, shuffle=True):
        """Create a data generator that yields batches"""
        indices = np.array(indices)
        
        while True:
            if shuffle:
                np.random.shuffle(indices)
            
            for start_idx in range(0, len(indices), batch_size):
                batch_indices = indices[start_idx:start_idx + batch_size]
                X_batch, y_batch = self.get_batch(batch_indices)
                yield X_batch, y_batch
    
    def analyze_class_distribution(self):
        """Analyze class distribution without loading images"""
        unique, counts = np.unique(self.image_labels, return_counts=True)
        class_dist = dict(zip(unique, counts))
        
        total = len(self.image_labels)
        print("\n=== Class Distribution ===")
        for class_idx, count in class_dist.items():
            print(f"{self.classes[class_idx]}: {count} images ({count/total*100:.2f}%)")
        
        return class_dist
