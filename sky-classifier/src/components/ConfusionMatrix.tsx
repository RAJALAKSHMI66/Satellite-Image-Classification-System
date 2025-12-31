import React from 'react';

const categories = ['Forest', 'Urban', 'Water', 'Agriculture', 'Desert'];

const matrix = [
  [0.94, 0.02, 0.01, 0.02, 0.01],
  [0.03, 0.91, 0.02, 0.03, 0.01],
  [0.01, 0.01, 0.96, 0.01, 0.01],
  [0.02, 0.02, 0.01, 0.93, 0.02],
  [0.01, 0.01, 0.01, 0.02, 0.95],
];

const ConfusionMatrix: React.FC = () => {
  const getColor = (value: number) => {
    if (value > 0.9) return 'bg-secondary text-secondary-foreground';
    if (value > 0.5) return 'bg-secondary/50 text-foreground';
    if (value > 0.1) return 'bg-secondary/20 text-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Confusion Matrix</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[400px]">
          <div className="flex">
            <div className="w-20" />
            {categories.map((cat) => (
              <div key={cat} className="flex-1 text-center text-xs font-medium text-muted-foreground py-2">
                {cat.slice(0, 4)}
              </div>
            ))}
          </div>
          {matrix.map((row, i) => (
            <div key={i} className="flex">
              <div className="w-20 text-xs font-medium text-muted-foreground flex items-center">
                {categories[i]}
              </div>
              {row.map((value, j) => (
                <div
                  key={j}
                  className={`flex-1 aspect-square m-0.5 rounded-lg flex items-center justify-center text-xs font-semibold ${getColor(value)}`}
                >
                  {(value * 100).toFixed(0)}%
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span>Predicted →</span>
        <span>↓ Actual</span>
      </div>
    </div>
  );
};

export default ConfusionMatrix;
