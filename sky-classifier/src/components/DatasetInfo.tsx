import React from 'react';
import { Database, Globe, Layers, Download } from 'lucide-react';

const datasets = [
  {
    name: 'EuroSAT',
    images: '27,000',
    classes: 10,
    resolution: '64×64',
    source: 'Sentinel-2',
    description: 'Land use and land cover classification from Sentinel-2 satellite images',
  },
  {
    name: 'UC Merced',
    images: '2,100',
    classes: 21,
    resolution: '256×256',
    source: 'USGS',
    description: 'High-resolution aerial imagery land use dataset',
  },
  {
    name: 'SAT-6',
    images: '405,000',
    classes: 6,
    resolution: '28×28',
    source: 'NAIP',
    description: 'Agriculture and building classification patches',
  },
  {
    name: 'BigEarthNet',
    images: '590,326',
    classes: 43,
    resolution: '120×120',
    source: 'Sentinel-2',
    description: 'Large-scale multi-label classification benchmark',
  },
];

const DatasetInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Available Datasets</h2>
            <p className="text-sm text-muted-foreground">Popular satellite imagery datasets for training</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {datasets.map((dataset, index) => (
            <div
              key={index}
              className="p-5 rounded-xl bg-muted/30 border border-border/50 hover-lift"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">{dataset.name}</h3>
                <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                  {dataset.source}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{dataset.description}</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-lg bg-background">
                  <div className="text-lg font-bold text-foreground">{dataset.images}</div>
                  <div className="text-xs text-muted-foreground">Images</div>
                </div>
                <div className="p-2 rounded-lg bg-background">
                  <div className="text-lg font-bold text-foreground">{dataset.classes}</div>
                  <div className="text-xs text-muted-foreground">Classes</div>
                </div>
                <div className="p-2 rounded-lg bg-background">
                  <div className="text-lg font-bold text-foreground font-mono">{dataset.resolution}</div>
                  <div className="text-xs text-muted-foreground">Resolution</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 hover-lift">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
            <Globe className="w-5 h-5 text-secondary" />
          </div>
          <h4 className="font-semibold text-foreground mb-1">Global Coverage</h4>
          <p className="text-sm text-muted-foreground">Datasets spanning multiple continents and climate zones</p>
        </div>
        <div className="glass-card rounded-2xl p-5 hover-lift">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-1">Multi-spectral</h4>
          <p className="text-sm text-muted-foreground">RGB + infrared bands for enhanced classification</p>
        </div>
        <div className="glass-card rounded-2xl p-5 hover-lift">
          <div className="w-10 h-10 rounded-lg bg-chart-forest/10 flex items-center justify-center mb-3">
            <Download className="w-5 h-5 text-chart-forest" />
          </div>
          <h4 className="font-semibold text-foreground mb-1">Open Access</h4>
          <p className="text-sm text-muted-foreground">Freely available for research and development</p>
        </div>
      </div>
    </div>
  );
};

export default DatasetInfo;
