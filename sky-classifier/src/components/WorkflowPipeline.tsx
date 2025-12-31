import React from 'react';
import { Database, Cog, Cpu, GraduationCap, Rocket, AlertCircle } from 'lucide-react';

const workflow = [
  {
    step: 1,
    title: "Data Collection & Preparation",
    description: "Gather satellite imagery datasets",
    icon: Database,
    details: [
      "Use EuroSAT, UC Merced, or Sentinel-2 datasets",
      "Image preprocessing: resize, normalize, augment",
      "Handle class imbalance with weighted sampling"
    ]
  },
  {
    step: 2,
    title: "Feature Engineering",
    description: "Extract relevant features",
    icon: Cog,
    details: [
      "RGB and multispectral bands processing",
      "Texture features (GLCM, LBP)",
      "Spatial context extraction"
    ]
  },
  {
    step: 3,
    title: "Model Architecture",
    description: "Design CNN or hybrid models",
    icon: Cpu,
    details: [
      "Transfer learning: ResNet, EfficientNet",
      "Custom CNN architectures",
      "Ensemble methods for robustness"
    ]
  },
  {
    step: 4,
    title: "Training & Validation",
    description: "Train with proper validation",
    icon: GraduationCap,
    details: [
      "K-fold cross-validation",
      "Class weighting for imbalance",
      "Early stopping and learning rate scheduling"
    ]
  },
  {
    step: 5,
    title: "Evaluation & Deployment",
    description: "Test and deploy model",
    icon: Rocket,
    details: [
      "Metrics: Accuracy, F1-score, Confusion Matrix",
      "Model optimization for inference",
      "API deployment for real-time classification"
    ]
  }
];

const WorkflowPipeline: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Complete ML Pipeline</h2>
        
        <div className="space-y-4">
          {workflow.map((item, index) => (
            <div
              key={item.step}
              className="relative pl-8 pb-8 last:pb-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline line */}
              {index < workflow.length - 1 && (
                <div className="absolute left-[15px] top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary to-secondary" />
              )}
              
              {/* Step indicator */}
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm glow-primary">
                {item.step}
              </div>

              <div className="glass-card rounded-xl p-5 ml-4 hover-lift">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <ul className="space-y-2">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border-l-4 border-chart-agricultural">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-chart-agricultural/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-chart-agricultural" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Key Challenges Addressed</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-chart-agricultural mt-2" />
                <span><strong className="text-foreground">Image quality variability:</strong> Data augmentation and preprocessing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-chart-agricultural mt-2" />
                <span><strong className="text-foreground">Class imbalance:</strong> Weighted loss functions and oversampling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-chart-agricultural mt-2" />
                <span><strong className="text-foreground">Complex features:</strong> Deep CNN architectures with transfer learning</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPipeline;
