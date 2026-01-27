# Satellite Image Classification System

A comprehensive **software-based image processing system** for classifying satellite images using predefined algorithms and feature-based techniques. This project includes a Python backend for image analysis and a React frontend for visualization and predictions.

**Repository**: [https://github.com/RAJALAKSHMI66/Satellite-Image-Classification-System](https://github.com/RAJALAKSHMI66/Satellite-Image-Classification-System)

## Features

* **Image Classification**: Classify satellite images into 10 different land use categories using feature extraction and rule-based classification logic
* **REST API**: Flask-based API for image processing and classification results
* **Interactive Dashboard**: React-based web interface for visualization and analysis
* **Data Processing**: Complete pipeline for data preparation, normalization, and transformation
* **Processing Pipeline**: Configurable image-processing workflow with multiple processing options
* **Evaluation Metrics**: Accuracy calculations, confusion matrices, and result summaries
* **Multi-band Support**: Handle RGB and multispectral satellite imagery
* **Batch Processing**: Support for processing multiple satellite images efficiently

## Project Structure

```
.
├── src/                      # Python backend source code
│   ├── train.py             # Classification configuration setup
│   ├── train_improved.py    # Enhanced processing pipeline
│   ├── evaluate.py          # Classification evaluation
│   ├── predict.py           # Prediction utilities
│   ├── model.py             # Classification logic and rules
│   ├── data_loader.py       # Data loading utilities
│   ├── data_generator.py    # Data transformation utilities
│   ├── improved_data_generator.py # Enhanced transformations
│   ├── convert_model.py     # Format conversion utilities
│   └── __init__.py
├── api/                     # Flask API & Web Interfaces
│   ├── flask_api.py         # REST API endpoints
│   └── gradio_demo.py       # Interactive demo interface
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
│   ├── 02_processing_pipeline.ipynb
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
└── FIX_SUMMARY.md         # Complete fix documentation
```

## Prerequisites

* **Python**: 3.8 or higher
* **Node.js**: 16 or higher (for React frontend)
* **NumPy / OpenCV / PIL**: For image processing
* **Git**: For cloning the repository

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

### Running the Classification Pipeline

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

## Classification Information

### Categories

The system classifies satellite images into the following land use categories:

* Annual Crop
* Forest
* Herbaceous Vegetation
* Highway
* Industrial
* Pasture
* Permanent Crop
* Residential
* River
* Sea/Lake

### Dataset

The system operates on satellite imagery such as the EuroSAT dataset:

* **Total Images**: 27,000+
* **Image Size**: 64x64 to 256x256 pixels
* **Bands**: RGB or multispectral

## API Endpoints

### POST /predict

Process and classify an image

```bash
curl -X POST -F "file=@image.jpg" http://localhost:5000/predict
```

### GET /health

Health check endpoint

```bash
curl http://localhost:5000/health
```

### GET /system-info

Get system configuration details

```bash
curl http://localhost:5000/system-info
```

## Configuration

Edit `config.yaml` to customize:

* Processing parameters
* Classification rules
* Data paths
* API settings
* Logging options

## Testing

Run tests:

```bash
pytest tests/
```

## Performance Optimization

* Enable batch processing for large datasets
* Reduce image resolution if processing is slow
* Adjust configuration parameters for faster execution

## Future Improvements

* [ ] Improved multispectral support
* [ ] Real-time image stream processing
* [ ] Advanced visualization tools
* [ ] Mobile-friendly frontend
* [ ] Automated configuration management

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For support, open an issue on GitHub.

---

**Last Updated**: January 2026
**Version**: 1.0.0
