import React from 'react';
import ClassificationChart from '../components/ClassificationChart';
import AccuracyTrendChart from '../components/AccuracyTrendChart';
import ConfusionMatrix from '../components/ConfusionMatrix';
import PerformanceBarChart from '../components/PerformanceBarChart';
import StatsCard from '../components/StatsCard';
import { Activity, TrendingUp, Target, Layers } from 'lucide-react';

const Analytics: React.FC = () => {
  const chartData = [
    { name: 'Forest', value: 35, color: 'hsl(142, 76%, 36%)' },
    { name: 'Urban', value: 25, color: 'hsl(220, 9%, 46%)' },
    { name: 'Water', value: 15, color: 'hsl(217, 91%, 60%)' },
    { name: 'Agriculture', value: 18, color: 'hsl(45, 93%, 47%)' },
    { name: 'Desert', value: 7, color: 'hsl(25, 95%, 53%)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Model Analytics</h2>
        <p className="text-muted-foreground">Comprehensive performance metrics and insights</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Overall Accuracy" value="94.2%" change={2.1} icon={Target} color="primary" />
        <StatsCard title="Macro F1-Score" value="0.93" change={1.8} icon={Activity} color="secondary" />
        <StatsCard title="Inference Speed" value="45ms" change={-12} icon={TrendingUp} color="chart-forest" />
        <StatsCard title="Model Params" value="23.5M" icon={Layers} color="chart-water" />
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <AccuracyTrendChart />
        <PerformanceBarChart />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ConfusionMatrix />
        <ClassificationChart data={chartData} />
      </div>
    </div>
  );
};

export default Analytics;
