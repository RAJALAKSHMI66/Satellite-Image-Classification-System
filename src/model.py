# src/model.py

"""
Model architectures for satellite image classification
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.applications import ResNet50, EfficientNetB0
from tensorflow.keras.preprocessing.image import ImageDataGenerator


def create_augmentation_generator(X_train, y_train, batch_size=32):
    """Create data augmentation generator to handle class imbalance"""
    
    datagen = ImageDataGenerator(
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        vertical_flip=True,
        zoom_range=0.2,
        shear_range=0.15,
        brightness_range=[0.8, 1.2],
        fill_mode='reflect'
    )
    
    datagen.fit(X_train)
    return datagen.flow(X_train, y_train, batch_size=batch_size)


class SatelliteClassifier:
    """Build various CNN architectures for satellite image classification"""
    
    def __init__(self, input_shape=(224, 224, 3), num_classes=5):
        self.input_shape = input_shape
        self.num_classes = num_classes
    
    def build_custom_cnn(self):
        """Build custom CNN architecture"""
        model = models.Sequential([
            # Block 1
            layers.Conv2D(64, (3, 3), activation='relu', padding='same', input_shape=self.input_shape),
            layers.BatchNormalization(),
            layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Block 2
            layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Block 3
            layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Block 4
            layers.Conv2D(512, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.Conv2D(512, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.GlobalAveragePooling2D(),
            
            # Dense layers
            layers.Dense(512, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(256, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(self.num_classes, activation='softmax')
        ])
        
        return model
    
    def build_transfer_learning_model(self, base_model='resnet50', trainable_layers=20):
        """Build transfer learning model with pretrained backbone"""
        
        if base_model == 'resnet50':
            base = ResNet50(weights='imagenet', include_top=False, input_shape=self.input_shape)
        elif base_model == 'efficientnet':
            base = EfficientNetB0(weights='imagenet', include_top=False, input_shape=self.input_shape)
        else:
            raise ValueError(f"Unknown base model: {base_model}")
        
        # Freeze base layers except last few
        for layer in base.layers[:-trainable_layers]:
            layer.trainable = False
        
        # Add custom classification head
        model = models.Sequential([
            base,
            layers.GlobalAveragePooling2D(),
            layers.Dense(512, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(256, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.3),
            layers.Dense(self.num_classes, activation='softmax')
        ])
        
        return model


if __name__ == '__main__':
    # Test model building
    classifier = SatelliteClassifier(input_shape=(224, 224, 3), num_classes=5)
    
    print("Building Custom CNN...")
    custom_model = classifier.build_custom_cnn()
    custom_model.summary()
    
    print("\n" + "="*60)
    print("Building Transfer Learning Model...")
    transfer_model = classifier.build_transfer_learning_model(base_model='resnet50')
    transfer_model.summary()
