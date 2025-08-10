# 🚀 Cineo AI Backend Setup Guide

## 📋 Required API Keys

To generate real images and videos, you need API keys from these providers:

### 1. 🔄 Replicate API (For Premium Models)
**What it does:** Powers our premium image and video models
- `cineo-vision-pro` (SDXL)
- `cineo-ultrareal` (Photorealistic)  
- `cineo-3dform` (3D Rendering)
- `cineo-motion` (Premium Video)
- `cineo-quicktake` (Fast Video)

**How to get it:**
1. Go to [replicate.com](https://replicate.com)
2. Sign up for a free account
3. Navigate to [Account > API Tokens](https://replicate.com/account/api-tokens)
4. Create a new token
5. Copy the token (starts with `r8_`)

**Pricing:** ~$0.001-0.01 per generation (very affordable)

### 2. 🤗 HuggingFace API (For Specialized Models)
**What it does:** Powers our specialized and artistic models
- `cineo-conceptart` (Digital Art)
- `cineo-portraitmaster` (Portraits)
- `cineo-animecraft` (Anime Style)
- `cineo-frameflow` (Text-to-Video)

**How to get it:**
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for a free account
3. Navigate to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Create a new token with "Read" permissions
5. Copy the token (starts with `hf_`)

**Pricing:** Free tier available, then ~$0.0001-0.001 per generation

### 3. 💻 Local Models (Optional - Free!)
**What it does:** Runs Stable Diffusion locally on your machine
- `cineo-localvision` (Local SDXL)
- `cineo-quickdraw` (Fast Local)
- `cineo-localvision-motion` (Local Video)

**Requirements:**
- NVIDIA GPU with 6GB+ VRAM (recommended)
- Or CPU with 16GB+ RAM (slower)
- ~4GB disk space for models

## ⚙️ Setup Instructions

### Step 1: Copy Environment File
```bash
cd backend
cp .env.example .env
```

### Step 2: Edit .env File
Open `.env` and add your API keys:

```bash
# Add your actual API keys here
REPLICATE_API_TOKEN=r8_your_actual_replicate_token_here
HUGGINGFACE_API_TOKEN=hf_your_actual_huggingface_token_here

# Generate a secure secret key
SECRET_KEY=your-super-secure-secret-key-here
```

### Step 3: Generate Secret Key
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Copy the output to `SECRET_KEY` in `.env`

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Run the Backend
```bash
python app/main.py
```

## 🧪 Testing the Setup

### Check API Status
Visit: `http://localhost:8000/health`

Should return:
```json
{
  "status": "healthy",
  "app_name": "Cineo AI",
  "version": "1.0.0"
}
```

### Test Models Endpoint
Visit: `http://localhost:8000/models`

Should return a list of all available models with their status.

### Test Generation (with Frontend)
1. Start the frontend: `cd frontend && npm run dev`
2. Visit: `http://localhost:3000`
3. Go to Image Generation
4. Select a model and try generating!

## 💡 Model Costs & Credits

| Model | Provider | Credits | Real Cost |
|-------|----------|---------|-----------|
| Cineo Vision Pro | Replicate | 5 | ~$0.005 |
| Cineo UltraReal | Replicate | 4 | ~$0.004 |
| Cineo ConceptArt | HuggingFace | 3 | ~$0.001 |
| Cineo LocalVision | Local | 1 | Free! |
| Cineo Motion (Video) | Replicate | 25 | ~$0.025 |

## 🔧 Troubleshooting

### API Key Issues
**Error:** `Invalid API key`
- Double-check your API keys are correct
- Make sure there are no extra spaces
- Verify the tokens haven't expired

### Model Loading Issues
**Error:** `Model not available`
- Check your internet connection
- Verify API keys are working
- Some models may have usage limits

### Local Model Issues
**Error:** `CUDA out of memory`
- Reduce batch size in local settings
- Use CPU instead: `GPU_DEVICE=cpu`
- Close other GPU applications

### Database Issues
**Error:** `Database connection failed`
- For development, SQLite should work automatically
- Check file permissions in the backend directory

## 📊 Production Deployment

### Environment Variables
```bash
ENVIRONMENT=production
DEBUG=false
DATABASE_URL=postgresql://user:pass@localhost:5432/cineo_ai
```

### Security
- Use a strong `SECRET_KEY`
- Set up proper CORS origins
- Enable HTTPS in production

### Scaling
- Use PostgreSQL for production
- Consider Redis for caching
- Set up proper logging

## 💰 Cost Estimation

### Typical Usage:
- **100 image generations/month:** ~$0.50-2.00
- **20 video generations/month:** ~$0.50-1.00
- **Using local models:** FREE!

### Free Tiers:
- **Replicate:** $0.01 free credits
- **HuggingFace:** Generous free tier
- **Local models:** Completely free

## 🎯 Quick Start Checklist

- [ ] Get Replicate API key
- [ ] Get HuggingFace API key  
- [ ] Copy `.env.example` to `.env`
- [ ] Add API keys to `.env`
- [ ] Generate secure `SECRET_KEY`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Run backend: `python app/main.py`
- [ ] Test at `http://localhost:8000/health`
- [ ] Start frontend and test generation!

## 🚨 Important Notes

1. **Keep API keys secure** - Never commit them to git
2. **Monitor usage** - Check your API usage on provider dashboards
3. **Start small** - Test with a few generations first
4. **Local models** - Great for development and privacy
5. **Credits system** - Prevents overspending automatically

## 🆘 Need Help?

- **Replicate Docs:** [docs.replicate.com](https://docs.replicate.com)
- **HuggingFace Docs:** [huggingface.co/docs](https://huggingface.co/docs)
- **FastAPI Docs:** [fastapi.tiangolo.com](https://fastapi.tiangolo.com)

---

Once you have the API keys set up, your Cineo AI platform will be **fully functional** and ready to generate stunning images and videos! 🎨✨