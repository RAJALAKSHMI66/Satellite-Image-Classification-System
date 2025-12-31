import React from 'react';

const SatelliteLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gradient-bg">
      {/* Orbit container */}
      <div className="relative w-48 h-48">
        {/* Earth */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-chart-water via-chart-forest to-chart-water shadow-lg animate-pulse" />
        </div>
        
        {/* Orbit path */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-[spin_8s_linear_infinite]" />
        
        {/* Satellite orbiting */}
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Satellite body */}
              <div className="w-6 h-4 bg-muted-foreground rounded-sm shadow-md" />
              {/* Solar panels */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-3 h-6 bg-chart-water/70 rounded-sm" />
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-3 h-6 bg-chart-water/70 rounded-sm" />
              {/* Antenna */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-muted-foreground rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Second orbit */}
        <div className="absolute inset-4 animate-[spin_5s_linear_infinite_reverse]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-primary rounded-full shadow-lg glow-primary" />
          </div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Initializing Satellite System
        </h2>
        <p className="text-muted-foreground animate-pulse">
          Connecting to classification network...
        </p>
      </div>
      
      {/* Progress dots */}
      <div className="mt-6 flex gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default SatelliteLoader;
