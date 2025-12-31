import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Label } from 'recharts';

const data = [
  { epoch: '1', accuracy: 65, loss: 0.8 },
  { epoch: '5', accuracy: 72, loss: 0.6 },
  { epoch: '10', accuracy: 78, loss: 0.45 },
  { epoch: '15', accuracy: 83, loss: 0.35 },
  { epoch: '20', accuracy: 87, loss: 0.28 },
  { epoch: '25', accuracy: 90, loss: 0.22 },
  { epoch: '30', accuracy: 92, loss: 0.18 },
  { epoch: '35', accuracy: 93, loss: 0.15 },
  { epoch: '40', accuracy: 93.8, loss: 0.13 },
  { epoch: '45', accuracy: 94, loss: 0.12 },
  { epoch: '50', accuracy: 94.2, loss: 0.11 },
];

const AccuracyTrendChart: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Training Progress</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Chart */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 text-center">Accuracy</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="epoch" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                >
                  <Label value="Epoch" offset={-10} position="insideBottom" fill="hsl(var(--muted-foreground))" fontSize={12} />
                </XAxis>
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  domain={[60, 100]}
                >
                  <Label value="Accuracy (%)" angle={-90} position="insideLeft" fill="hsl(var(--muted-foreground))" fontSize={12} style={{ textAnchor: 'middle' }} />
                </YAxis>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={3}
                  fill="url(#accuracyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loss Chart */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 text-center">Loss</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
                <defs>
                  <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="epoch" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                >
                  <Label value="Epoch" offset={-10} position="insideBottom" fill="hsl(var(--muted-foreground))" fontSize={12} />
                </XAxis>
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  domain={[0, 1]}
                >
                  <Label value="Loss" angle={-90} position="insideLeft" fill="hsl(var(--muted-foreground))" fontSize={12} style={{ textAnchor: 'middle' }} />
                </YAxis>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="loss"
                  stroke="hsl(0, 84%, 60%)"
                  strokeWidth={3}
                  fill="url(#lossGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Accuracy (%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-sm text-muted-foreground">Loss</span>
        </div>
      </div>
    </div>
  );
};

export default AccuracyTrendChart;
