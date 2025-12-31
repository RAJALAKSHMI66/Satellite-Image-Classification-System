# Satellite Image Classification System - Complete Guide

A step-by-step guide for setting up, using, and deploying the Satellite Image Classification System.

## Table of Contents

1. [Installation](#installation)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [API Reference](#api-reference)
6. [Training Models](#training-models)
7. [Making Predictions](#making-predictions)
8. [Configuration](#configuration)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/RAJALAKSHMI66/Satellite-Image-Classification-System.git
cd Satellite-Image-Classification-System
```

### 2. System Requirements Check

Verify your system has the required tools:

```bash
# Check Python version
python --version  # Should be 3.8+

# Check Node.js version
node --version    # Should be 16+

# Check npm version
npm --version

# Check Git version
git --version
```

---

## Backend Setup

### Step 1: Create Virtual Environment

```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# Linux/macOS
python3 -m venv .venv
source .venv/bin/activate
```

### Step 2: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 3: Verify Installation

```bash
python -c "import tensorflow; print(f'TensorFlow version: {tensorflow.__version__}')"
python -c "import torch; print(f'PyTorch version: {torch.__version__}')"
```

### Step 4: Configure Environment

Copy and edit the configuration file:

```bash
cp config.yaml.example config.yaml
# Edit config.yaml with your settings
```

**Key Configuration Options:**

```yaml
# Model settings
model:
  architecture: "resnet50"
  input_size: 256
  num_classes: 10
  pretrained: true

# Training settings
training:
  batch_size: 32
  epochs: 50
  learning_rate: 0.001
  validation_split: 0.2

# Data settings
data:
  raw_path: "data/raw/"
  processed_path: "data/processed/"
  augmentation: true

# API settings
api:
  host: "0.0.0.0"
  port: 5000
  debug: false
```

---

## Frontend Setup

### Step 1: Install Frontend Dependencies

```bash
cd sky-classifier
npm install
```

### Step 2: Configure API Endpoint

Create `.env.local` file:

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Step 3: Build Frontend

```bash
# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Running the Application

### Option 1: Development Mode

**Terminal 1 - Backend API:**

```bash
# In project root
python api/flask_api.py
# API available at http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
# In project root
cd sky-classifier
npm run dev
# Frontend available at http://localhost:5173
```

### Option 2: Using Docker

```bash
# Build Docker image
docker build -t satellite-classifier .

# Run container
docker run -p 5000:5000 -p 5173:5173 satellite-classifier
```

### Option 3: Production Mode

```bash
# Build frontend
cd sky-classifier
npm run build
cd ..

# Start production server
gunicorn -w 4 -b 0.0.0.0:5000 api.flask_api:app
```

---

## API Reference

### Base URL

```
http://localhost:5000
```

### Endpoints

#### 1. Health Check

```bash
GET /health

Response:
{
  "status": "healthy",
  "timestamp": "2025-01-10T10:30:00Z"
}
```

#### 2. Predict Image

```bash
POST /predict

Request:
- Form data with file: satellite_image.jpg

Response:
{
  "prediction": "Urban",
  "confidence": 0.95,
  "class_probabilities": {
    "Urban": 0.95,
    "Industrial": 0.03,
    "Residential": 0.02
  },
  "processing_time_ms": 125
}
```

#### 3. Batch Prediction

```bash
POST /batch-predict

Request:
- Form data with multiple files

Response:
{
  "predictions": [
    {"filename": "image1.jpg", "prediction": "Urban", "confidence": 0.95},
    {"filename": "image2.jpg", "prediction": "Forest", "confidence": 0.92}
  ],
  "total_time_ms": 450
}
```

#### 4. Model Information

```bash
GET /model-info

Response:
{
  "model_name": "satellite_classifier_final",
  "architecture": "ResNet50",
  "input_shape": [256, 256, 3],
  "num_classes": 10,
  "classes": ["Annual Crop", "Forest", "Urban", ...],
  "version": "1.0.0"
}
```

#### 5. Training Status

```bash
GET /training/status

Response:
{
  "is_training": false,
  "last_training": "2025-01-09T15:30:00Z",
  "model_accuracy": 0.94,
  "model_loss": 0.18
}
```

---

## Training Models

### Train from Scratch

```bash
python src/train.py --config config.yaml
```

### Resume Training

```bash
python src/train.py --config config.yaml --resume --checkpoint models/checkpoint.ckpt
```

### Train with Custom Parameters

```python
from src.train import train_model
from src.model import create_model

# Create model
model = create_model(
    architecture='resnet50',
    input_size=256,
    num_classes=10,
    pretrained=True
)

# Train
history = train_model(
    model=model,
    epochs=50,
    batch_size=32,
    learning_rate=0.001,
    data_path='data/processed/'
)
```

### Monitor Training

```bash
# TensorBoard
tensorboard --logdir=logs/

# Open browser to http://localhost:6006
```

---

## Making Predictions

### Single Image Prediction

```python
from src.predict import predict_image

result = predict_image('path/to/image.jpg')
print(f"Prediction: {result['prediction']}")
print(f"Confidence: {result['confidence']:.2%}")
```

### Batch Prediction

```python
from src.predict import batch_predict

image_paths = ['image1.jpg', 'image2.jpg', 'image3.jpg']
results = batch_predict(image_paths)

for result in results:
    print(f"{result['filename']}: {result['prediction']}")
```

### Via REST API

```bash
# Using curl
curl -X POST -F "file=@image.jpg" http://localhost:5000/predict

# Using Python requests
import requests

with open('image.jpg', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:5000/predict', files=files)
    print(response.json())
```

### Real-time Video Stream

```python
from src.predict import predict_video_stream
import cv2

camera = cv2.VideoCapture(0)
for predictions in predict_video_stream(camera):
    print(f"Real-time: {predictions['prediction']}")
```

---

## Configuration

### config.yaml Reference

```yaml
# Model Configuration
model:
  name: "satellite_classifier"
  architecture: "resnet50" # resnet50, resnet101, vgg16, mobilenet
  input_size: 256
  num_classes: 10
  dropout_rate: 0.3
  pretrained: true

# Training Configuration
training:
  batch_size: 32
  epochs: 50
  learning_rate: 0.001
  learning_rate_decay: 0.95
  momentum: 0.9
  validation_split: 0.2
  test_split: 0.1
  early_stopping_patience: 10
  reduce_lr_patience: 5

# Data Augmentation
augmentation:
  enabled: true
  rotation_range: 20
  width_shift_range: 0.2
  height_shift_range: 0.2
  horizontal_flip: true
  vertical_flip: true
  zoom_range: 0.2
  brightness_range: [0.8, 1.2]

# Data Paths
data:
  raw_path: "data/raw/"
  processed_path: "data/processed/"
  train_split: 0.7
  val_split: 0.15
  test_split: 0.15

# API Configuration
api:
  host: "0.0.0.0"
  port: 5000
  debug: false
  max_upload_size: 52428800 # 50MB

# Logging
logging:
  level: "INFO"
  file: "logs/app.log"
```

---

## Troubleshooting

### Common Issues

#### 1. CUDA Not Found

```bash
# Check if GPU is available
python -c "import torch; print(torch.cuda.is_available())"

# Solution: Install CPU-only version
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

#### 2. Out of Memory

```bash
# Reduce batch size in config.yaml
batch_size: 16  # Reduce from 32

# Or use gradient accumulation
python src/train.py --accumulation-steps 2
```

#### 3. Module Not Found

```bash
# Ensure virtual environment is activated
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Reinstall dependencies
pip install -r requirements.txt
```

#### 4. Port Already in Use

```bash
# Use different port
python api/flask_api.py --port 5001

# Or find and kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :5000
kill -9 <PID>
```

#### 5. Frontend Not Connecting to API

```bash
# Check API is running
curl http://localhost:5000/health

# Check API URL in .env.local
VITE_API_URL=http://localhost:5000

# Check browser console for CORS errors
```

---

## Deployment

### Deploy to Heroku

```bash
# Create Procfile
echo "web: gunicorn -w 4 -b 0.0.0.0:\$PORT api.flask_api:app" > Procfile

# Deploy
heroku create satellite-classifier
git push heroku main
```

### Deploy to AWS

```bash
# Using EC2
ssh -i key.pem ec2-user@instance

# Install dependencies
sudo yum install python3 python3-pip nodejs npm
git clone <repo>
pip install -r requirements.txt

# Run with systemd
sudo cp satellite-classifier.service /etc/systemd/system/
sudo systemctl start satellite-classifier
```

### Deploy to Docker

```dockerfile
FROM python:3.10

WORKDIR /app

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Install frontend dependencies
COPY sky-classifier/package.json sky-classifier/
WORKDIR /app/sky-classifier
RUN npm install
RUN npm run build

# Copy application
WORKDIR /app
COPY . .

# Expose ports
EXPOSE 5000 3000

# Run application
CMD ["python", "api/flask_api.py"]
```

### Environment Variables for Production

```bash
export FLASK_ENV=production
export DEBUG=False
export MODEL_PATH=models/satellite_classifier_final.keras
export LOG_LEVEL=INFO
```

---

## Performance Optimization

### Model Optimization

```python
# Quantization
from tensorflow.lite.python import lite
converter = lite.TFLiteConverter.from_saved_model("models/satellite_classifier")
converter.optimizations = [lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Pruning
from tensorflow_model_optimization.sparsity import keras as sparsity
pruning_schedule = sparsity.PolynomialDecay(...)
```

### Batch Processing

```bash
python src/train.py --batch-size 64 --mixed-precision
```

### Caching

```python
# Enable result caching
from functools import lru_cache

@lru_cache(maxsize=1000)
def predict_cached(image_hash):
    return predict_image(image_hash)
```

---

## Advanced Topics

### Custom Model Architecture

```python
# In src/model.py
from tensorflow import keras

class CustomSatelliteModel(keras.Model):
    def __init__(self, num_classes=10):
        super().__init__()
        # Define layers

    def call(self, inputs):
        # Forward pass
        return outputs
```

### Multi-GPU Training

```bash
python src/train.py --multi-gpu --gpu-count 4
```

### Model Ensembling

```python
from src.predict import ensemble_predict

predictions = ensemble_predict(
    'image.jpg',
    models=['model1.keras', 'model2.keras', 'model3.keras']
)
```

---



---

## License

MIT License - See LICENSE file for details

---

**Last Updated**: January 2026 
**Version**: 1.0.0

