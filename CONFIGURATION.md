# Configuration Template & Environment Setup

## Environment File (.env)

Create a `.env` file in the `sky-classifier` directory:

```bash
# sky-classifier/.env

# Supabase Configuration
VITE_SUPABASE_URL=https://whgkjiirhycnxsyyumdc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZ2tqaWlyaHljbnhzeXl1bWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.YOUR_KEY_HERE
VITE_SUPABASE_PROJECT_ID=whgkjiirhycnxsyyumdc

# Optional: API endpoints
VITE_API_URL=http://localhost:5000
VITE_ENABLE_DEBUG=true
```

## Backend Configuration (config.yaml)

```yaml
# config.yaml - Python Backend Configuration

# Model Configuration
model:
  type: "ResNet50"
  pretrained: true
  input_shape: [224, 224, 3]
  output_classes: 10
  dropout_rate: 0.5

# Data Configuration
data:
  dataset: "EuroSAT"
  data_dir: "./data/raw"
  processed_dir: "./data/processed"
  test_size: 0.2
  validation_size: 0.2

# Training Configuration
training:
  epochs: 50
  batch_size: 32
  learning_rate: 0.001
  optimizer: "adam"
  loss_function: "categorical_crossentropy"
  metrics: ["accuracy"]
  early_stopping_patience: 5

# Augmentation Configuration
augmentation:
  enabled: true
  rotation_range: 20
  width_shift_range: 0.2
  height_shift_range: 0.2
  horizontal_flip: true
  vertical_flip: true
  zoom_range: 0.2

# Paths
paths:
  model_dir: "./models"
  logs_dir: "./logs"
  checkpoints_dir: "./checkpoints"
```

## Supabase Project Secrets

The following secrets need to be configured in your Supabase project:

### Primary Secret (REQUIRED)

```bash
# LOVABLE_API_KEY
# Get from: https://lovable.dev/settings
# Format: pk_test_xxx or pk_live_xxx
# Set command:
supabase secrets set LOVABLE_API_KEY="pk_test_your_key_here" --project-id whgkjiirhycnxsyyumdc
```

### Optional Secrets

```bash
# For additional services (if needed)
supabase secrets set OPENAI_API_KEY="sk_..." --project-id whgkjiirhycnxsyyumdc
supabase secrets set DATABASE_URL="postgresql://..." --project-id whgkjiirhycnxsyyumdc
```

### Verify Secrets

```bash
# List all configured secrets
supabase secrets list --project-id whgkjiirhycnxsyyumdc

# Output should include:
# LOVABLE_API_KEY    [configured]
```

## Docker Configuration (Optional)

### Dockerfile for Python Backend

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run Flask API
CMD ["python", "api/flask_api.py"]
```

### Dockerfile for React Frontend

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY sky-classifier/package.json sky-classifier/package-lock.json ./
RUN npm ci

COPY sky-classifier .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - FLASK_APP=api/flask_api.py
    volumes:
      - ./models:/app/models
      - ./logs:/app/logs
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_SUPABASE_URL=https://whgkjiirhycnxsyyumdc.supabase.co
      - VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
    depends_on:
      - backend
    restart: unless-stopped

networks:
  default:
    name: satellite-network
```

## GitHub Actions CI/CD Configuration

### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.10"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Run tests
        run: python -m pytest tests/

      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Build frontend
        run: |
          cd sky-classifier
          npm ci
          npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Supabase
        env:
          SUPABASE_PROJECT_ID: whgkjiirhycnxsyyumdc
          SUPABASE_AUTH_TOKEN: ${{ secrets.SUPABASE_AUTH_TOKEN }}
        run: |
          npm install -g supabase
          supabase functions deploy classify-image --project-id $SUPABASE_PROJECT_ID
```

## Environment Variables Reference

| Variable                        | Type    | Example                       | Required |
| ------------------------------- | ------- | ----------------------------- | -------- |
| `VITE_SUPABASE_URL`             | string  | `https://project.supabase.co` | Yes      |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | string  | `eyJhbGc...`                  | Yes      |
| `VITE_SUPABASE_PROJECT_ID`      | string  | `whgkjiirhycnxsyyumdc`        | No       |
| `VITE_API_URL`                  | string  | `http://localhost:5000`       | No       |
| `VITE_ENABLE_DEBUG`             | boolean | `true`                        | No       |
| `FLASK_ENV`                     | string  | `production`                  | No       |
| `FLASK_DEBUG`                   | boolean | `false`                       | No       |
| `TF_CPP_MIN_LOG_LEVEL`          | integer | `2`                           | No       |

## Supabase Edge Function Configuration

### deno.json (Edge Function Config)

```json
{
  "imports": {
    "std/": "https://deno.land/std@0.168.0/"
  },
  "tasks": {
    "start": "deno run --allow-net --allow-env supabase/functions/classify-image/index.ts"
  }
}
```

## Setup Instructions by Environment

### Development

```bash
# Backend
python -m venv .venv
source .venv/bin/activate  # or .\.venv\Scripts\activate on Windows
pip install -r requirements.txt

# Frontend
cd sky-classifier
npm install
npm run dev

# Supabase (optional for local testing)
supabase start

# API
python api/flask_api.py
```

### Production

```bash
# Use Docker Compose
docker-compose up -d

# Or deploy manually to cloud:
# - Backend: Heroku, AWS, Azure, GCP
# - Frontend: Vercel, Netlify, GitHub Pages
# - Edge Functions: Supabase (automated)
```

### Testing

```bash
# Backend tests
python -m pytest tests/ -v

# Frontend tests
cd sky-classifier
npm run test

# Integration tests
pytest tests/integration/ -v
```

## Monitoring & Logging

### Application Logs

```bash
# Backend logs
tail -f logs/app.log

# Frontend logs (console)
F12 → Console tab

# Edge function logs
supabase functions logs classify-image
```

### Performance Monitoring

```bash
# Check API response times
curl -w "Total time: %{time_total}s\n" http://localhost:5000/predict

# Monitor edge function performance
supabase functions logs classify-image --tail 100
```

## Security Checklist

- [ ] Store API keys in environment variables (not in code)
- [ ] Use `.env.example` for template (without actual keys)
- [ ] Enable HTTPS in production
- [ ] Set proper CORS headers
- [ ] Validate all inputs (image format, size, etc.)
- [ ] Rate limit API endpoints
- [ ] Implement authentication for API
- [ ] Use signed URLs for image access
- [ ] Regular security updates for dependencies
- [ ] Monitor for suspicious activity

## Backup & Recovery

```bash
# Backup database
supabase db pull  # Pull schema
pg_dump postgresql://user:pass@host/db > backup.sql

# Backup models
tar -czf models-backup.tar.gz models/

# Restore from backup
psql postgresql://user:pass@host/db < backup.sql
tar -xzf models-backup.tar.gz
```

---

**Configuration Last Updated**: January 19, 2026
