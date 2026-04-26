# src/evaluate.py

"""
Model evaluation and metrics
"""

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix, f1_score


class ModelEvaluator:
    """Evaluate model performance with various metrics"""
    
    def __init__(self, model, class_names):
        self.model = model
        self.class_names = class_names
    
    def evaluate(self, X_test, y_test):
        """Comprehensive model evaluation"""
        
        print("\n=== Model Evaluation ===")
        
        # Get predictions
        y_pred_proba = self.model.predict(X_test, verbose=0)
        y_pred = np.argmax(y_pred_proba, axis=1)
        
        # Overall accuracy
        test_loss, test_acc, test_precision, test_recall = self.model.evaluate(
            X_test, y_test, verbose=0
        )
        
        print(f"\nTest Accuracy: {test_acc:.4f}")
        print(f"Test Precision: {test_precision:.4f}")
        print(f"Test Recall: {test_recall:.4f}")
        print(f"Test Loss: {test_loss:.4f}")
        
        # F1 Score
        f1 = f1_score(y_test, y_pred, average='weighted')
        print(f"F1-Score (weighted): {f1:.4f}")
        
        # Classification report
        print("\n" + "="*60)
        print("CLASSIFICATION REPORT")
        print("="*60)
        print(classification_report(y_test, y_pred, target_names=self.class_names))
        
        # Confusion matrix
        self.plot_confusion_matrix(y_test, y_pred)
        
        # Per-class analysis
        self.per_class_analysis(y_test, y_pred)
        
        return {
            'accuracy': test_acc,
            'precision': test_precision,
            'recall': test_recall,
            'f1_score': f1,
            'predictions': y_pred,
            'probabilities': y_pred_proba
        }
    
    def plot_confusion_matrix(self, y_true, y_pred):
        """Plot confusion matrix"""
        cm = confusion_matrix(y_true, y_pred)
        
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                    xticklabels=self.class_names, 
                    yticklabels=self.class_names,
                    cbar_kws={'label': 'Count'})
        plt.title('Confusion Matrix', fontsize=16, fontweight='bold')
        plt.ylabel('True Label', fontsize=12)
        plt.xlabel('Predicted Label', fontsize=12)
        plt.tight_layout()
        plt.savefig('models/confusion_matrix.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        # Normalized confusion matrix
        cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
        
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm_normalized, annot=True, fmt='.2%', cmap='Greens',
                    xticklabels=self.class_names, 
                    yticklabels=self.class_names,
                    cbar_kws={'label': 'Percentage'})
        plt.title('Normalized Confusion Matrix', fontsize=16, fontweight='bold')
        plt.ylabel('True Label', fontsize=12)
        plt.xlabel('Predicted Label', fontsize=12)
        plt.tight_layout()
        plt.savefig('models/confusion_matrix_normalized.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def per_class_analysis(self, y_true, y_pred):
        """Analyze performance per class"""
        print("\n" + "="*60)
        print("PER-CLASS ANALYSIS")
        print("="*60)
        
        for i, class_name in enumerate(self.class_names):
            class_mask = (y_true == i)
            class_total = np.sum(class_mask)
            class_correct = np.sum((y_true == i) & (y_pred == i))
            class_acc = class_correct / class_total if class_total > 0 else 0
            
            print(f"\n{class_name}:")
            print(f"  Total samples: {class_total}")
            print(f"  Correct predictions: {class_correct}")
            print(f"  Accuracy: {class_acc:.4f}")
    
    def visualize_predictions(self, X_test, y_test, num_samples=16):
        """Visualize predictions on test samples"""
        y_pred_proba = self.model.predict(X_test[:num_samples], verbose=0)
        y_pred = np.argmax(y_pred_proba, axis=1)
        
        fig, axes = plt.subplots(4, 4, figsize=(16, 16))
        axes = axes.ravel()
        
        for i in range(num_samples):
            axes[i].imshow(X_test[i])
            axes[i].axis('off')
            
            true_label = self.class_names[y_test[i]]
            pred_label = self.class_names[y_pred[i]]
            confidence = y_pred_proba[i][y_pred[i]]
            
            color = 'green' if y_test[i] == y_pred[i] else 'red'
            axes[i].set_title(f'True: {true_label}\nPred: {pred_label}\nConf: {confidence:.2f}',
                            color=color, fontsize=10, fontweight='bold')
        
        plt.tight_layout()
        plt.savefig('models/prediction_samples.png', dpi=300, bbox_inches='tight')
        plt.show()


if __name__ == '__main__':
    print("This module should be imported, not run directly")
    print("Use main.py to run the complete evaluation pipeline")
