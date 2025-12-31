import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Forest', precision: 0.95, recall: 0.93, f1: 0.94, color: 'hsl(142, 76%, 36%)' },
  { name: 'Urban', precision: 0.92, recall: 0.89, f1: 0.90, color: 'hsl(220, 9%, 46%)' },
  { name: 'Water', precision: 0.97, recall: 0.96, f1: 0.96, color: 'hsl(217, 91%, 60%)' },
  { name: 'Agriculture', precision: 0.93, recall: 0.91, f1: 0.92, color: 'hsl(45, 93%, 47%)' },
  { name: 'Desert', precision: 0.94, recall: 0.95, f1: 0.94, color: 'hsl(25, 95%, 53%)' },
];

const PerformanceBarChart: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Per-Class Performance</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis 
              type="number" 
              domain={[0, 1]} 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px',
              }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`]}
            />
            <Bar dataKey="f1" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="w-3 h-3 rounded bg-primary" />
        <span className="text-sm text-muted-foreground">F1-Score</span>
      </div>
    </div>
  );
};

export default PerformanceBarChart;
