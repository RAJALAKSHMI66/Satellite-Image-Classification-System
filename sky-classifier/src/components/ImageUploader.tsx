import React, { useState, useRef } from 'react';
import { Upload, Image, X, Play, Loader2, Trash2 } from 'lucide-react';

interface ImageUploaderProps {
  onClassify: (image: string) => void;
  isProcessing: boolean;
  isClassified: boolean;
  onClearClassification: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onClassify, 
  isProcessing, 
  isClassified,
  onClearClassification 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearImage = () => {
    setSelectedImage(null);
    onClearClassification();
  };

  // If image is classified, show completed state
  if (isClassified && selectedImage) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Classification Complete</h3>
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={selectedImage}
              alt="Classified satellite"
              className="w-full h-64 object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <div className="bg-background/90 backdrop-blur rounded-xl px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-chart-forest rounded-full animate-pulse" />
                <span className="text-sm font-medium text-foreground">Image Classified</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={clearImage}
            className="w-full py-4 rounded-xl bg-destructive text-destructive-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            <Trash2 className="w-5 h-5" />
            Remove Image & Classify New
          </button>
          <p className="text-xs text-center text-muted-foreground">
            Image classified. Remove this image to upload a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Upload Satellite Image</h3>
      
      {!selectedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <p className="text-foreground font-medium mb-2">Drop your satellite image here</p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
          <p className="text-xs text-muted-foreground">Supports PNG, JPG, TIFF up to 50MB</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={selectedImage}
              alt="Uploaded satellite"
              className="w-full h-64 object-cover"
            />
            <button
              onClick={clearImage}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>
          
          <button
            onClick={() => onClassify(selectedImage)}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Classify Image
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
