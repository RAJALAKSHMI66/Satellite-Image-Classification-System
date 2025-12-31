import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ClassificationChartProps {
  data: { name: string; value: number; color: string }[];
}

const ClassificationChart: React.FC<ClassificationChartProps> = ({ data }) => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Classification Distribution</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 600 }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              formatter={(value: number, name: string) => [
                <span style={{ color: 'hsl(var(--popover-foreground))', fontWeight: 500 }}>{value}%</span>,
                <span style={{ color: 'hsl(var(--popover-foreground))' }}>{name}</span>
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClassificationChart;
