# src/train.py

"""
Training pipeline for satellite image classification
"""

import matplotlib.pyplot as plt
from tensorflow import keras
from tensorflow.keras import callbacks
from .model import create_augmentation_generator


class TrainingPipeline:
    """Complete training pipeline with callbacks and monitoring"""
    
    def __init__(self, model, model_name='satellite_classifier'):
        self.model = model
        self.model_name = model_name
        self.history = None
    
    def compile_model(self, learning_rate=0.0001, class_weights=None):
        """Compile model with optimizer and loss"""
        
        optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
        
        # Use class weights if provided to handle imbalance
        if class_weights is not None:
            loss = keras.losses.SparseCategoricalCrossentropy()
        else:
            loss = keras.losses.SparseCategoricalCrossentropy()
        
        self.model.compile(
            optimizer=optimizer,
            loss=loss,
            metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
        )
        
        print(f"\n=== Model Compiled ===")
        print(f"Optimizer: Adam (lr={learning_rate})")
        print(f"Loss: Sparse Categorical Crossentropy")
        
    def get_callbacks(self, patience=10):
        """Get training callbacks"""
        
        callback_list = [
            callbacks.EarlyStopping(
                monitor='val_loss',
                patience=patience,
                restore_best_weights=True,
                verbose=1
            ),
            callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-7,
                verbose=1
            ),
            callbacks.ModelCheckpoint(
                f'models/{self.model_name}_best.h5',
                monitor='val_accuracy',
                save_best_only=True,
                verbose=1
            ),
            callbacks.CSVLogger(f'models/{self.model_name}_training.log')
        ]
        
        return callback_list
    
    def train(self, X_train, y_train, X_val, y_val, 
              epochs=50, batch_size=32, class_weights=None, use_augmentation=True):
        """Train the model"""
        
        print(f"\n=== Starting Training ===")
        print(f"Training samples: {len(X_train)}")
        print(f"Validation samples: {len(X_val)}")
        print(f"Batch size: {batch_size}")
        print(f"Epochs: {epochs}")
        
        if use_augmentation:
            train_generator = create_augmentation_generator(X_train, y_train, batch_size)
            steps_per_epoch = len(X_train) // batch_size
            
            self.history = self.model.fit(
                train_generator,
                steps_per_epoch=steps_per_epoch,
                epochs=epochs,
                validation_data=(X_val, y_val),
                callbacks=self.get_callbacks(),
                class_weight=class_weights,
                verbose=1
            )
        else:
            self.history = self.model.fit(
                X_train, y_train,
                batch_size=batch_size,
                epochs=epochs,
                validation_data=(X_val, y_val),
                callbacks=self.get_callbacks(),
                class_weight=class_weights,
                verbose=1
            )
        
        return self.history
    
    def plot_training_history(self):
        """Plot training history"""
        if self.history is None:
            print("No training history available")
            return
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # Accuracy
        axes[0, 0].plot(self.history.history['accuracy'], label='Train')
        axes[0, 0].plot(self.history.history['val_accuracy'], label='Validation')
        axes[0, 0].set_title('Model Accuracy')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Accuracy')
        axes[0, 0].legend()
        axes[0, 0].grid(True)
        
        # Loss
        axes[0, 1].plot(self.history.history['loss'], label='Train')
        axes[0, 1].plot(self.history.history['val_loss'], label='Validation')
        axes[0, 1].set_title('Model Loss')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()
        axes[0, 1].grid(True)
        
        # Precision
        axes[1, 0].plot(self.history.history['precision'], label='Train')
        axes[1, 0].plot(self.history.history['val_precision'], label='Validation')
        axes[1, 0].set_title('Model Precision')
        axes[1, 0].set_xlabel('Epoch')
        axes[1, 0].set_ylabel('Precision')
        axes[1, 0].legend()
        axes[1, 0].grid(True)
        
        # Recall
        axes[1, 1].plot(self.history.history['recall'], label='Train')
        axes[1, 1].plot(self.history.history['val_recall'], label='Validation')
        axes[1, 1].set_title('Model Recall')
        axes[1, 1].set_xlabel('Epoch')
        axes[1, 1].set_ylabel('Recall')
        axes[1, 1].legend()
        axes[1, 1].grid(True)
        
        plt.tight_layout()
        plt.savefig(f'models/{self.model_name}_training_history.png', dpi=300, bbox_inches='tight')
        plt.show()


if __name__ == '__main__':
    print("This module should be imported, not run directly")
    print("Use main.py to run the complete training pipeline")
