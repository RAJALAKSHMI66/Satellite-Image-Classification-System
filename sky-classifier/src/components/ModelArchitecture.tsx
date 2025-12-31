import React from 'react';
import { Layers, Zap, Target, Activity } from 'lucide-react';

const ModelArchitecture: React.FC = () => {
  const architectureLayers = [
    { name: 'Input Layer', spec: '224×224×3', color: 'bg-primary' },
    { name: 'Conv Block 1', spec: '64 filters, 3×3, ReLU + MaxPool', color: 'bg-primary/80' },
    { name: 'Conv Block 2', spec: '128 filters, 3×3, ReLU + MaxPool', color: 'bg-primary/60' },
    { name: 'Conv Block 3', spec: '256 filters, 3×3, ReLU + MaxPool', color: 'bg-secondary/80' },
    { name: 'Global Avg Pool', spec: 'Flatten features', color: 'bg-secondary/60' },
    { name: 'Dense', spec: '512 units, ReLU, Dropout 0.5', color: 'bg-secondary' },
    { name: 'Output', spec: '5 classes, Softmax', color: 'bg-secondary' },
  ];

  const trainingConfig = [
    { label: 'Optimizer', value: 'Adam (lr=0.0001)' },
    { label: 'Loss', value: 'Categorical Cross-entropy with class weights' },
    { label: 'Batch Size', value: '32' },
    { label: 'Epochs', value: '50 with early stopping' },
    { label: 'Augmentation', value: 'Rotation, flip, zoom, contrast' },
  ];

  const metrics = [
    { label: 'Accuracy', value: '94.2%', icon: Target },
    { label: 'F1-Score', value: '0.93', icon: Activity },
    { label: 'Precision', value: '0.95', icon: Zap },
    { label: 'Recall', value: '0.92', icon: Layers },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Architecture Visualization */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          CNN Architecture
        </h3>
        <div className="space-y-3">
          {architectureLayers.map((layer, index) => (
            <div
              key={index}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${layer.color} rounded-xl p-4 text-primary-foreground`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{layer.name}</span>
                  <span className="text-sm opacity-90 font-mono">{layer.spec}</span>
                </div>
              </div>
              {index < architectureLayers.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-0.5 h-4 bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Training Strategy */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-secondary" />
            Training Strategy
          </h3>
          <div className="space-y-3">
            {trainingConfig.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
              >
                <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                <div>
                  <span className="font-medium text-foreground">{item.label}:</span>
                  <span className="text-muted-foreground ml-2">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Performance Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50 text-center hover-lift"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <metric.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold gradient-text">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelArchitecture;
