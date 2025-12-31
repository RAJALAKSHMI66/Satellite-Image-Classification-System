import React from 'react';
import { Clock, TreePine, Building2, Waves, Wheat, Mountain } from 'lucide-react';

const recentItems = [
  { id: 1, filename: 'sentinel_2024_001.tif', class: 'Forest', confidence: 96.2, time: '2 min ago', icon: TreePine, color: 'text-chart-forest' },
  { id: 2, filename: 'landsat_patch_42.png', class: 'Urban', confidence: 89.1, time: '5 min ago', icon: Building2, color: 'text-chart-urban' },
  { id: 3, filename: 'coastal_area_15.jpg', class: 'Water', confidence: 97.8, time: '12 min ago', icon: Waves, color: 'text-chart-water' },
  { id: 4, filename: 'midwest_crop.tif', class: 'Agricultural', confidence: 91.5, time: '18 min ago', icon: Wheat, color: 'text-chart-agricultural' },
  { id: 5, filename: 'sahara_region.png', class: 'Desert', confidence: 94.3, time: '25 min ago', icon: Mountain, color: 'text-chart-desert' },
];

const RecentClassifications: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Classifications</h3>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>
      
      <div className="space-y-3">
        {recentItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.filename}</p>
              <p className="text-xs text-muted-foreground">{item.class}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-secondary">{item.confidence}%</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentClassifications;
