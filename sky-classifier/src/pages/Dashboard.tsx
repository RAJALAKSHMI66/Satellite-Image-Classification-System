import React, { useState } from 'react';
import { Image, BarChart3, Clock, Zap } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import ImageUploader from '../components/ImageUploader';
import ClassificationResults from '../components/ClassificationResults';
import ClassificationChart from '../components/ClassificationChart';
import AccuracyTrendChart from '../components/AccuracyTrendChart';
import RecentClassifications from '../components/RecentClassifications';
import SegmentedImage from '../components/SegmentedImage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [prediction, setPrediction] = useState<number[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isClassified, setIsClassified] = useState(false);
  const { toast } = useToast();

  const handleClassify = async (image: string) => {
    setIsProcessing(true);
    setUploadedImage(image);
    
    try {
      console.log("Sending image for classification...");
      
      const { data, error } = await supabase.functions.invoke('classify-image', {
        body: { imageBase64: image }
      });

      if (error) {
        console.error("Classification error:", error);
        toast({
          title: "Classification Error",
          description: error.message || "Failed to classify image",
          variant: "destructive"
        });
        fallbackClassification(image);
        return;
      }

      if (data.error) {
        console.error("Error:", data.error);
        toast({
          title: " Analysis Error", 
          description: data.error,
          variant: "destructive"
        });
        fallbackClassification(image);
        return;
      }

      const classification = data.classification;
      console.log("Classification result:", classification);

      // Convert to array format: [forest, urban, water, agricultural, desert]
      const predictionArray = [
        classification.forest / 100,
        classification.urban / 100,
        classification.water / 100,
        classification.agricultural / 100,
        classification.desert / 100
      ];

      setPrediction(predictionArray);
      setIsClassified(true);
      
      toast({
        title: "Classification Complete",
        description: "Analyzed your satellite image successfully!",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      fallbackClassification(image);
    } finally {
      setIsProcessing(false);
    }
  };

  const fallbackClassification = (image: string) => {
    // Analyze image using canvas for pixel-based fallback
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let forest = 0, urban = 0, water = 0, agricultural = 0, desert = 0;
      const pixelCount = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (b > r + 20 && b > g) water++;
        else if (g > r && g > b && g > 60) forest++;
        else if (Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && r > 60 && r < 220) urban++;
        else if (r > g && g > b && r > 100 && g > 80 && b < 120) agricultural++;
        else if (r > g + 20 && r > b + 30 && r > 160) desert++;
        else forest++; // Default
      }

      const total = water + forest + urban + agricultural + desert;
      const predictionArray = [
        forest / total,
        urban / total,
        water / total,
        agricultural / total,
        desert / total
      ];

      setPrediction(predictionArray);
      setIsClassified(true);
    };
    img.src = image;
  };

  const handleClearClassification = () => {
    setPrediction(null);
    setUploadedImage(null);
    setIsClassified(false);
  };

  // Generate chart data from prediction or use defaults
  const chartData = prediction
    ? [
        { name: 'Forest', value: Math.round(prediction[0] * 100), color: 'hsl(142, 76%, 36%)' },
        { name: 'Urban', value: Math.round(prediction[1] * 100), color: 'hsl(220, 9%, 46%)' },
        { name: 'Water', value: Math.round(prediction[2] * 100), color: 'hsl(217, 91%, 60%)' },
        { name: 'Agriculture', value: Math.round(prediction[3] * 100), color: 'hsl(45, 93%, 47%)' },
        { name: 'Desert', value: Math.round(prediction[4] * 100), color: 'hsl(25, 95%, 53%)' },
      ]
    : [
        { name: 'Forest', value: 35, color: 'hsl(142, 76%, 36%)' },
        { name: 'Urban', value: 25, color: 'hsl(220, 9%, 46%)' },
        { name: 'Water', value: 15, color: 'hsl(217, 91%, 60%)' },
        { name: 'Agriculture', value: 18, color: 'hsl(45, 93%, 47%)' },
        { name: 'Desert', value: 7, color: 'hsl(25, 95%, 53%)' },
      ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Classifications"
          value="12,847"
          change={12.5}
          icon={Image}
          color="primary"
        />
        <StatsCard
          title="Accuracy Rate"
          value="94.2%"
          change={2.3}
          icon={BarChart3}
          color="secondary"
        />
        <StatsCard
          title="Avg Processing Time"
          value="1.2s"
          change={-8.1}
          icon={Clock}
          color="chart-water"
        />
        <StatsCard
          title="Models Trained"
          value="156"
          change={5.7}
          icon={Zap}
          color="chart-forest"
        />
      </div>

      {/* Main Classification Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ImageUploader 
          onClassify={handleClassify} 
          isProcessing={isProcessing}
          isClassified={isClassified}
          onClearClassification={handleClearClassification}
        />
        <ClassificationResults prediction={prediction} />
      </div>

      {/* Segmentation & Distribution Results - Shows after classification */}
      {uploadedImage && prediction && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <SegmentedImage originalImage={uploadedImage} prediction={prediction} />
            <ClassificationChart data={chartData} />
          </div>
        </div>
      )}

      {/* Charts Row - Only show when no classification is active */}
      {!prediction && (
        <div className="grid lg:grid-cols-2 gap-6">
          <ClassificationChart data={chartData} />
          <AccuracyTrendChart />
        </div>
      )}

      {/* Training Progress - Always show */}
      {prediction && (
        <AccuracyTrendChart />
      )}

      {/* Recent Activity */}
      <RecentClassifications />
    </div>
  );
};

export default Dashboard;
