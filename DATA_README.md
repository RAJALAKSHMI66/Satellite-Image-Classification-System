# Data Directory Structure

This directory contains the satellite image dataset used for training and testing the classification model.

## Folder Structure

```
data/
├── raw/              # Original raw satellite images organized by category
│   ├── agricultural/ # Agricultural/crop images
│   ├── desert/      # Desert/arid region images
│   ├── forest/      # Forest/vegetation images
│   ├── urban/       # Urban/city images
│   └── water/       # Water body images
│
├── processed/       # Preprocessed and augmented data ready for training
│   ├── train/      # Training dataset
│   ├── val/        # Validation dataset
│   └── test/       # Test dataset
│
└── test/           # Additional test samples
```

## Dataset Details

### EuroSAT Dataset
- **Total Images**: 27,000+
- **Image Size**: 64x64 to 256x256 pixels
- **Categories**: 10 land use classes
- **Bands**: RGB (3 channels) or Multispectral (11 channels)

### Categories

1. **Annual Crop** - Agricultural areas with annual crops
2. **Forest** - Deciduous and coniferous forests
3. **Herbaceous Vegetation** - Grasslands and herbaceous areas
4. **Highway** - Major roads and highways
5. **Industrial** - Industrial zones and factories
6. **Pasture** - Permanent pasture areas
7. **Permanent Crop** - Vineyards, orchards, other permanent crops
8. **Residential** - Residential buildings and housing areas
9. **River** - Rivers and water courses
10. **Sea/Lake** - Sea, lakes, and water bodies

## Data Organization

### Raw Data Format
```
data/raw/agricultural/
├── AnnualCrop_AnnualCrop_1.jpg
├── AnnualCrop_AnnualCrop_2.jpg
└── ... (more images)
```

### Processed Data Format (Train/Val/Test Split)
```
data/processed/
├── train/
│   ├── AnnualCrop/
│   ├── Forest/
│   ├── Urban/
│   └── ... (all categories)
├── val/
│   ├── AnnualCrop/
│   ├── Forest/
│   └── ... (all categories)
└── test/
    ├── AnnualCrop/
    ├── Forest/
    └── ... (all categories)
```

## Data Statistics

### Training Distribution (Typical)
- Training: 70% of data
- Validation: 15% of data
- Testing: 15% of data

### Per-Category Distribution
- Each category contains approximately 2,700 images
- Balanced across all 10 land use classes

## Getting the Data

### Download Options

1. **EuroSAT Official Dataset**
   - URL: http://madm.web.unc.edu/sentinel2/
   - Format: GeoTIFF (11 bands) or JPG (RGB)

2. **Preprocessed EuroSAT**
   - Kaggle: https://www.kaggle.com/datasets/apollo2506/eurosat-ms
   - Size: ~10 GB

### Setup Script

To automatically download and organize the dataset:

```bash
python setup_data.py
```

This script will:
- Download the EuroSAT dataset
- Extract and organize files
- Split into train/val/test
- Apply preprocessing and augmentation

## Data Augmentation

Applied during training:

- **Rotation**: ±20 degrees
- **Horizontal Flip**: 50% probability
- **Vertical Flip**: 50% probability
- **Width/Height Shift**: ±20%
- **Zoom**: ±20%
- **Brightness**: ±20%
- **Contrast**: ±15%

## Data Quality Checks

Run quality checks on the data:

```bash
python utils/quality_check.py
```

This validates:
- Image integrity and format
- Correct labeling
- Missing or corrupted files
- Data distribution balance

## Data Visualization

Visualize sample images and augmentations:

```bash
python utils/augmentation_preview.py
python utils/visualization.py
```

## Sample Data Format

### Image Properties
```
Format: JPG/PNG/TIF
Resolution: 64x64 to 256x256 pixels (typically 64x64 for RGB)
Color Space: RGB or Multispectral (11 bands)
File Size: 2-50 KB per image (RGB), 100-500 KB (Multispectral)
```

### Metadata
- Filename: `{Category}_{Label}_{Number}.jpg`
- Label: Category name (e.g., AnnualCrop, Forest, Urban)
- Number: Sequential image number

## Using the Data

### Load with Python

```python
from src.data_loader import load_dataset

train_data = load_dataset('data/processed/train', img_size=256)
val_data = load_dataset('data/processed/val', img_size=256)
test_data = load_dataset('data/processed/test', img_size=256)
```

### Manual Loading

```python
import cv2
import numpy as np
from pathlib import Path

def load_images(directory, img_size=256):
    images = []
    labels = []
    
    for class_dir in Path(directory).iterdir():
        if class_dir.is_dir():
            label = class_dir.name
            for img_file in class_dir.glob('*.jpg'):
                img = cv2.imread(str(img_file))
                img = cv2.resize(img, (img_size, img_size))
                images.append(img)
                labels.append(label)
    
    return np.array(images), np.array(labels)

X_train, y_train = load_images('data/processed/train')
```

## Storage Requirements

- **Raw Data**: ~50 GB (original dataset)
- **Processed RGB**: ~2 GB (64x64 images)
- **Processed Multispectral**: ~8 GB (11-band images)
- **Recommended Storage**: 100 GB for full setup

## Data Privacy

- EuroSAT is a public dataset from Sentinel-2 satellite
- No private or personal information included
- Free for research and educational use
- See LICENSE for usage terms

## Troubleshooting

### Missing Data Files

```bash
# Check data integrity
python utils/quality_check.py

# Re-download if needed
python setup_data.py --force-download
```

### Out of Memory

```bash
# Use smaller batch size
# Reduce image size in config
# Process data in chunks
```

### Slow Data Loading

```bash
# Enable data caching
# Use SSD instead of HDD
# Preload into memory (if available)
```

## References

- **Paper**: EuroSAT: A Novel Dataset and Deep Learning Benchmark for Land Use and Land Cover Classification
- **Authors**: Helber et al., 2019
- **DOI**: 10.1109/IGARSS.2019.8898860

---

For more information on data preparation, see [GUIDE.md](GUIDE.md#data-preparation)
