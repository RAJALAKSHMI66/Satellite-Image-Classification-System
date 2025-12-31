import React, { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';

interface SegmentedImageProps {
  originalImage: string;
  prediction: number[] | null;
}

// Category colors matching the classification
const categoryColors = {
  forest: { r: 34, g: 197, b: 94 },      // Green
  urban: { r: 107, g: 114, b: 128 },     // Gray
  water: { r: 59, g: 130, b: 246 },      // Blue
  agricultural: { r: 234, g: 179, b: 8 }, // Yellow
  desert: { r: 249, g: 115, b: 22 },     // Orange
};

type CategoryKey = keyof typeof categoryColors;

const SegmentedImage: React.FC<SegmentedImageProps> = ({ originalImage, prediction }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!originalImage || !prediction) return;

    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const categories: CategoryKey[] = ['forest', 'urban', 'water', 'agricultural', 'desert'];
      
      // Get dominant categories from prediction (above 15% threshold)
      const dominantCategories = prediction
        .map((prob, idx) => ({ category: categories[idx], prob }))
        .filter(item => item.prob > 0.15)
        .map(item => item.category);
      
      // Common sense exclusion rules based on prediction
      const hasWater = prediction[2] > 0.1; // Water index
      const hasForest = prediction[0] > 0.1; // Forest index
      const hasAgricultural = prediction[3] > 0.1; // Agricultural index
      
      // If water OR forest OR agricultural is significant, desert is unlikely
      const excludeDesert = hasWater || hasForest || hasAgricultural;
      
      // Analyze image for global characteristics first
      let totalBlue = 0, totalGreen = 0, totalYellow = 0;
      const pixelCount = data.length / 4;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        if (b > r && b > g) totalBlue++;
        if (g > r && g > b) totalGreen++;
        if (r > 100 && g > 100 && b < 100) totalYellow++;
      }
      
      const blueRatio = totalBlue / pixelCount;
      const greenRatio = totalGreen / pixelCount;
      const yellowRatio = totalYellow / pixelCount;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        let category: CategoryKey;
        
        // Calculate color metrics
        const brightness = (r + g + b) / 3;
        const saturation = Math.max(r, g, b) - Math.min(r, g, b);
        
        // Improved water detection - deep blues, dark water, cyan tones
        const isWaterLike = (
          (b > r + 20 && b > g) ||  // Blue dominant
          (b > 100 && g > 80 && r < g && brightness < 180) ||  // Cyan/turquoise
          (brightness < 80 && b >= r && b >= g) ||  // Dark water
          (b > 150 && Math.abs(r - g) < 30)  // Light blue
        );
        
        // Improved forest detection - various green shades
        const isForestLike = (
          (g > r && g > b && g > 60) ||  // Green dominant
          (g > 80 && r < g && b < g && brightness < 200) ||  // Dark green
          (g > 100 && Math.abs(r - g) < 40 && b < g - 20)  // Olive green
        );
        
        // Improved urban detection - grays, concrete, buildings
        const isUrbanLike = (
          (Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && brightness > 60 && brightness < 220 && saturation < 50) ||
          (r > 100 && g > 100 && b > 100 && saturation < 40)  // Gray tones
        );
        
        // Improved agricultural detection - yellow/brown/tan fields
        const isAgriculturalLike = (
          (r > g && g > b && r > 100 && g > 80 && b < 120) ||  // Brown/tan
          (r > 120 && g > 100 && b < 80 && Math.abs(r - g) < 60) ||  // Golden fields
          (yellowRatio > 0.1 && r > 100 && g > 80 && b < g)  // Yellow tones
        );
        
        // Desert detection - sandy, arid, warm colors (but respect exclusion rules)
        const isDesertLike = (
          (r > g + 20 && r > b + 30 && r > 160 && g > 120) ||  // Sandy orange
          (r > 180 && g > 140 && b < 100 && saturation > 40)  // Bright sand
        );

        // Priority-based classification with common sense rules
        if (isWaterLike && !excludeDesert) {
          category = 'water';
        } else if (isWaterLike) {
          category = 'water';
        } else if (isForestLike) {
          category = 'forest';
        } else if (isAgriculturalLike) {
          category = 'agricultural';
        } else if (isUrbanLike) {
          category = 'urban';
        } else if (isDesertLike && !excludeDesert) {
          category = 'desert';
        } else {
          // Fallback to prediction-weighted decision
          // But apply common sense exclusion
          let adjustedPrediction = [...prediction];
          if (excludeDesert) {
            adjustedPrediction[4] = 0; // Zero out desert probability
          }
          
          // Re-normalize
          const sum = adjustedPrediction.reduce((a, b) => a + b, 0);
          if (sum > 0) {
            adjustedPrediction = adjustedPrediction.map(p => p / sum);
          }
          
          const maxIndex = adjustedPrediction.indexOf(Math.max(...adjustedPrediction));
          category = categories[maxIndex];
        }

        // Apply category color with transparency blending
        const color = categoryColors[category];
        const blendFactor = 0.65;
        
        data[i] = Math.round(r * (1 - blendFactor) + color.r * blendFactor);
        data[i + 1] = Math.round(g * (1 - blendFactor) + color.g * blendFactor);
        data[i + 2] = Math.round(b * (1 - blendFactor) + color.b * blendFactor);
      }

      ctx.putImageData(imageData, 0, 0);
      setSegmentedImage(canvas.toDataURL());
      setIsProcessing(false);
    };

    img.src = originalImage;
  }, [originalImage, prediction]);

  const handleDownloadReport = () => {
    if (!segmentedImage || !prediction) return;

    const categories = ['Forest', 'Urban', 'Water', 'Agricultural', 'Desert'];
    const maxIndex = prediction.indexOf(Math.max(...prediction));

    // Create a canvas for the report
    const reportCanvas = document.createElement('canvas');
    const ctx = reportCanvas.getContext('2d');
    if (!ctx) return;

    reportCanvas.width = 800;
    reportCanvas.height = 600;

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 800, 600);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Satellite Image Classification Report', 50, 50);

    // Date
    ctx.font = '14px Arial';
    ctx.fillStyle = '#888888';
    ctx.fillText(`Generated: ${new Date().toLocaleString()}`, 50, 75);

    // Load and draw images
    const origImg = new Image();
    origImg.crossOrigin = 'anonymous';
    origImg.onload = () => {
      // Draw original image
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('Original Image', 50, 110);
      ctx.drawImage(origImg, 50, 120, 300, 180);

      // Draw segmented image
      const segImg = new Image();
      segImg.onload = () => {
        ctx.fillText('Segmented Image', 450, 110);
        ctx.drawImage(segImg, 450, 120, 300, 180);

        // Classification Results
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('Classification Results', 50, 340);

        // Draw results bars
        categories.forEach((cat, idx) => {
          const y = 370 + idx * 40;
          const percentage = (prediction[idx] * 100).toFixed(1);
          const barWidth = prediction[idx] * 300;

          // Category name
          ctx.fillStyle = '#ffffff';
          ctx.font = '14px Arial';
          ctx.fillText(cat, 50, y + 15);

          // Bar background
          ctx.fillStyle = '#333333';
          ctx.fillRect(150, y, 300, 25);

          // Bar fill
          const colors = ['#22c55e', '#6b7280', '#3b82f6', '#eab308', '#f97316'];
          ctx.fillStyle = colors[idx];
          ctx.fillRect(150, y, barWidth, 25);

          // Percentage
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px Arial';
          ctx.fillText(`${percentage}%`, 470, y + 15);

          // Highlight predicted class
          if (idx === maxIndex) {
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.strokeRect(148, y - 2, 344, 29);
          }
        });

        // Predicted Class summary
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Predicted Class: ${categories[maxIndex]} (${(prediction[maxIndex] * 100).toFixed(1)}%)`, 50, 580);

        // Download
        const link = document.createElement('a');
        link.download = `satellite-classification-report-${Date.now()}.png`;
        link.href = reportCanvas.toDataURL('image/png');
        link.click();
      };
      segImg.src = segmentedImage;
    };
    origImg.src = originalImage;
  };

  if (!originalImage) return null;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Segmentation Results</h3>
        {segmentedImage && prediction && (
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Original Image */}
        <div>
          <p className="text-sm text-muted-foreground mb-2 text-center">Original Image</p>
          <div className="rounded-xl overflow-hidden border border-border">
            <img src={originalImage} alt="Original" className="w-full h-48 object-cover" />
          </div>
        </div>

        {/* Segmented Image */}
        <div>
          <p className="text-sm text-muted-foreground mb-2 text-center">Predicted Segmentation</p>
          <div className="rounded-xl overflow-hidden border border-border bg-muted">
            {isProcessing ? (
              <div className="w-full h-48 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : segmentedImage ? (
              <img src={segmentedImage} alt="Segmented" className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-muted-foreground">
                Processing...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {Object.entries(categoryColors).map(([name, color]) => (
          <div key={name} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
            />
            <span className="text-sm text-muted-foreground capitalize">{name}</span>
          </div>
        ))}
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default SegmentedImage;