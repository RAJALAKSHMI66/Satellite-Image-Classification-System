# Satellite Image Classification System

A comprehensive machine learning system for classifying satellite images using deep learning techniques. This project includes a Python backend with TensorFlow/Keras models and a React frontend for visualization and predictions.

**Repository**: https://github.com/RAJALAKSHMI66/Satellite-Image-Classification-System

## Features

- **Image Classification**: Classify satellite images into 10 different land use categories
- **REST API**: Flask-based API for model inference and predictions
- **Interactive Dashboard**: React-based web interface for visualization and analysis
- **Data Processing**: Complete pipeline for data preparation and augmentation
- **Model Training**: Customizable training pipeline with multiple model options
- **Evaluation Metrics**: Comprehensive evaluation with confusion matrices and accuracy metrics
- **Multi-band Support**: Handle RGB and multispectral satellite imagery
- **Real-time Processing**: Stream processing capabilities for live satellite feeds

## Project Structure

```
.
├── src/                      # Python backend source code
│   ├── train.py             # Model training script
│   ├── train_improved.py    # Advanced training pipeline
│   ├── evaluate.py          # Model evaluation
│   ├── predict.py           # Prediction utilities
│   ├── model.py             # Model architecture
│   ├── data_loader.py       # Data loading utilities
│   ├── data_generator.py    # Data augmentation
│   ├── improved_data_generator.py # Enhanced augmentation
│   ├── convert_model.py     # Model format conversion
│   └── __init__.py
├── api/                     # Flask API & Web Interfaces
│   ├── flask_api.py         # REST API endpoints
│   └── gradio_demo.py       # Gradio interface for testing
├── sky-classifier/          # React Frontend Application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Context API
│   │   ├── integrations/   # Supabase integration
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   ├── supabase/           # Supabase backend config
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── tailwind.config.ts  # Tailwind CSS config
│   └── tsconfig.json       # TypeScript config
├── notebooks/              # Jupyter Analysis Notebooks
│   ├── 01_data_exploration.ipynb
│   ├── 02_model_training.ipynb
│   └── 03_evaluation.ipynb
├── utils/                  # Utility Functions
│   ├── data_preparation.py
│   ├── visualization.py
│   ├── augmentation_preview.py
│   ├── model_conversion.py
│   ├── quality_check.py
│   └── __init__.py
├── config.yaml             # Configuration file
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── GUIDE.md               # Detailed usage guide
├── SETUP_EDGE_FUNCTION.md # Edge Function setup guide
├── EDGE_FUNCTION_FIXES.md # Troubleshooting guide
└── FIX_SUMMARY.md         # Complete fix documentation
```

## 🔧 Edge Function Setup

The system uses Supabase edge functions for cloud-based image classification. To set up the edge function:

1. **Quick Setup** (5 minutes): Follow [SETUP_EDGE_FUNCTION.md](SETUP_EDGE_FUNCTION.md)
2. **Troubleshooting**: See [EDGE_FUNCTION_FIXES.md](EDGE_FUNCTION_FIXES.md)
3. **Full Details**: Check [FIX_SUMMARY.md](FIX_SUMMARY.md)

**Key Steps:**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Deploy edge function
cd sky-classifier
supabase functions deploy classify-image --project-id whgkjiirhycnxsyyumdc

# Set API key secret
supabase secrets set LOVABLE_API_KEY="your_api_key" --project-id whgkjiirhycnxsyyumdc
```

## Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 16 or higher (for React frontend)
- **TensorFlow**: 2.10+
- **CUDA**: 11.x (optional, for GPU acceleration)
- **Git**: For cloning the repository
- **Supabase CLI**: For edge function deployment (optional)
- **Lovable API Key**: For AI-based classification (optional)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/RAJALAKSHMI66/Satellite-Image-Classification-System.git
cd Satellite-Image-Classification-System

# Backend Setup
python -m venv .venv
.\.venv\Scripts\activate  # Windows
# OR
source .venv/bin/activate  # Linux/Mac

pip install -r requirements.txt

# Frontend Setup
cd sky-classifier
npm install
npm run dev

# In another terminal, start the API
cd ..
python api/flask_api.py
```

For detailed setup instructions, see [GUIDE.md](GUIDE.md)

For edge function setup, see [SETUP_EDGE_FUNCTION.md](SETUP_EDGE_FUNCTION.md)

## Installation

### Backend Setup

1. Create and activate virtual environment:

```bash
python -m venv .venv
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure settings:

```bash
cp config.yaml.example config.yaml
# Edit config.yaml with your settings
```

### Frontend Setup

1. Install frontend dependencies:

```bash
cd sky-classifier
npm install
```

2. Build frontend:

```bash
npm run build
```

## Usage

### Training the Model

```bash
python src/train.py
```

### Running the API

```bash
python api/flask_api.py
```

The API will be available at `http://localhost:5000`

### Running the Frontend

```bash
cd sky-classifier
npm run dev
```

### Making Predictions

```python
from src.predict import predict_image
result = predict_image('path/to/image.jpg')
print(result)
```

## Model Information

### Architecture

- **Base Model**: ResNet50 with ImageNet pre-training
- **Input Size**: 256x256 RGB images
- **Output Classes**: 10 land use categories
  - Annual Crop
  - Forest
  - Herbaceous Vegetation
  - Highway
  - Industrial
  - Pasture
  - Permanent Crop
  - Residential
  - River
  - Sea/Lake

### Performance

- **Training Accuracy**: ~97%
- **Validation Accuracy**: ~95%
- **Test Accuracy**: ~94%

## Dataset

The model is trained on the EuroSAT dataset:

- **Total Images**: 27,000+
- **Image Size**: 64x64 to 256x256 pixels
- **Bands**: RGB or 11-band multispectral

To download and prepare the dataset:

```bash
python setup_data.py
```

## API Endpoints

### POST /predict

Predict image class

```bash
curl -X POST -F "file=@image.jpg" http://localhost:5000/predict
```

### GET /health

Health check endpoint

```bash
curl http://localhost:5000/health
```

### GET /model-info

Get model information

```bash
curl http://localhost:5000/model-info
```

## Configuration

Edit `config.yaml` to customize:

- Model architecture
- Training parameters
- Data paths
- API settings
- Logging options

## Testing

Run tests:

```bash
pytest tests/
```

Run specific test:

```bash
pytest tests/test_model.py -v
```

## Data Preparation

The project includes utility scripts for data preparation:

```bash
# Check data quality
python utils/quality_check.py

# Visualize augmentations
python utils/augmentation_preview.py

# Prepare dataset
python utils/data_preparation.py
```

## Model Conversion

Convert models to different formats:

```bash
python src/convert_model.py
```

Supported formats:

- TensorFlow SavedModel
- ONNX
- TensorFlow Lite
- TensorFlow.js

## Performance Optimization

### GPU Acceleration

The project automatically uses GPU if CUDA is available. To force CPU:

```bash
export CUDA_VISIBLE_DEVICES=""
```

### Batch Processing

For faster inference on multiple images:

```python
from src.predict import batch_predict
results = batch_predict(['image1.jpg', 'image2.jpg'])
```

## Troubleshooting

### Out of Memory

- Reduce batch size in config.yaml
- Use model quantization
- Reduce image size

### Slow Training

- Enable GPU acceleration
- Increase batch size
- Use mixed precision training

### API Connection Issues

- Ensure Flask server is running
- Check firewall settings
- Verify port 5000 is available

## Future Improvements

- [ ] Support for multi-spectral images
- [ ] Real-time processing pipeline
- [ ] Model ensemble support
- [ ] Mobile app deployment
- [ ] Automated model versioning
- [ ] Enhanced visualization tools

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Citation

If you use this project, please cite:

```
@software{satellite_classification_2025,
  title={Satellite Image Classification System},
  author={Your Name},
  year={2025},
  url={https://github.com/RAJALAKSHMI66/Satellite-Image-Classification-System}
}
```

## Support

For support, open an issue on GitHub or contact [your email].

## Acknowledgments

- EuroSAT dataset creators
- TensorFlow and PyTorch communities
- Contributors and testers

---

**Last Updated**: January 2026
**Version**: 1.0.0
