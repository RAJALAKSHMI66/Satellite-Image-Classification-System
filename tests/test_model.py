import pytest
import numpy as np
from pathlib import Path
import sys
from model import Model

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))



class TestModel:
    """Test suite for satellite classification model."""
    
    @pytest.fixture
    def model(self):
        """Initialize model for testing."""
        return Model()
    
    def test_model_initialization(self, model):
        """Test model initializes correctly."""
        assert model is not None
    
    def test_model_predict_shape(self, model):
        """Test model prediction output shape."""
        dummy_input = np.random.rand(1, 224, 224, 3)
        prediction = model.predict(dummy_input)
        assert prediction.shape[0] == 1
    
    def test_model_predict_range(self, model):
        """Test model predictions are in valid range."""
        dummy_input = np.random.rand(1, 224, 224, 3)
        prediction = model.predict(dummy_input)
        assert np.all(prediction >= 0) and np.all(prediction <= 1)
    
    def test_invalid_input_shape(self, model):
        """Test model handles invalid input shapes."""
        invalid_input = np.random.rand(1, 100, 100, 3)
        with pytest.raises(ValueError):
            model.predict(invalid_input)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
