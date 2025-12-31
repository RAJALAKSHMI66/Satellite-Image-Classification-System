import React from 'react';
import { CheckCircle2, TreePine, Building2, Waves, Wheat, Mountain } from 'lucide-react';

interface ClassificationResultsProps {
  prediction: number[] | null;
}

const categories = [
  { name: 'Forest', icon: TreePine, color: 'bg-chart-forest' },
  { name: 'Urban', icon: Building2, color: 'bg-chart-urban' },
  { name: 'Water', icon: Waves, color: 'bg-chart-water' },
  { name: 'Agricultural', icon: Wheat, color: 'bg-chart-agricultural' },
  { name: 'Desert', icon: Mountain, color: 'bg-chart-desert' },
];

const ClassificationResults: React.FC<ClassificationResultsProps> = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Classification Results</h3>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-center">Upload and classify an image to see results</p>
        </div>
      </div>
    );
  }

  const maxIndex = prediction.indexOf(Math.max(...prediction));

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Classification Results</h3>
      
      <div className="space-y-3 mb-6">
        {categories.map((cat, idx) => (
          <div
            key={cat.name}
            className={`p-4 rounded-xl transition-all ${
              idx === maxIndex ? 'bg-secondary/10 ring-2 ring-secondary' : 'bg-muted/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center`}>
                  <cat.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-medium text-foreground">{cat.name}</span>
              </div>
              <span className="text-lg font-bold text-foreground">
                {(prediction[idx] * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`${cat.color} h-full transition-all duration-1000 ease-out`}
                style={{ width: `${prediction[idx] * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${categories[maxIndex].color} flex items-center justify-center`}>
            {React.createElement(categories[maxIndex].icon, { className: 'w-6 h-6 text-primary-foreground' })}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Predicted Class</p>
            <p className="text-xl font-bold text-foreground">{categories[maxIndex].name}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="text-xl font-bold text-secondary">{(Math.max(...prediction) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassificationResults;
