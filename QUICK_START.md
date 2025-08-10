# 🚀 Cineo AI - Quick Start Guide

## 🎯 What You Need to Get Started

To generate **real images and videos**, you need API keys from:

1. **Replicate** (for premium models) - Get at [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. **HuggingFace** (for specialized models) - Get at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

**Cost:** Very affordable! ~$0.001-0.025 per generation

## ⚡ Super Quick Setup (2 minutes)

### 1. Backend Setup
```bash
cd backend
python setup.py
```
The setup script will:
- ✅ Create `.env` file with secure settings
- ✅ Help you add your API keys
- ✅ Check dependencies
- ✅ Give you next steps

### 2. Install Dependencies & Start Backend
```bash
pip install -r requirements.txt
python app/main.py
```

### 3. Start Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 4. Open Your App! 🎉
Visit: **http://localhost:3000**

## 🎨 What You Can Do

### Image Generation
- **12+ AI models** from premium to free local options
- **Advanced controls** - resolution, style, aspect ratio, seed
- **Instant results** with local models
- **Professional quality** with cloud models

### Video Generation  
- **4+ video models** for different use cases
- **Reference image upload** for guided generation
- **Custom frame rates** and video lengths
- **Cinematic quality** outputs

### Model Explorer
- **Browse all models** with detailed information
- **Filter by type** (image/video) and provider
- **Compare costs** and features
- **Try models instantly**

## 💡 Model Overview

| Model | Type | Provider | Credits | Speed | Quality |
|-------|------|----------|---------|-------|---------|
| Cineo Vision Pro | Image | Replicate | 5 | Fast | Premium |
| Cineo LocalVision | Image | Local | 1 | Instant | High |
| Cineo ConceptArt | Image | HuggingFace | 3 | Medium | Artistic |
| Cineo Motion | Video | Replicate | 25 | Slow | Cinematic |

## 🔧 Troubleshooting

### No API Keys Yet?
- You can still use **local models** (free!)
- Just skip API key setup and try `cineo-localvision` or `cineo-quickdraw`

### Backend Won't Start?
```bash
# Check if port 8000 is free
lsof -i :8000

# Try different port
uvicorn app.main:app --port 8001
```

### Frontend Won't Start?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Errors?
- Double-check API keys in `.env` file
- Make sure no extra spaces in keys
- Verify keys work on provider websites

## 📚 Detailed Guides

- **Backend Setup:** `backend/API_SETUP_GUIDE.md`
- **Model Information:** Visit `/models` page in the app
- **API Documentation:** `http://localhost:8000/docs` when backend is running

## 💰 Cost Control

- **Free local models** for unlimited generation
- **Credit system** prevents overspending
- **100 free credits** to start (worth ~$0.10-1.00)
- **Monitor usage** in the dashboard

## 🎯 Quick Test

1. Start both frontend and backend
2. Visit `http://localhost:3000`
3. Go to "Image Generation"
4. Select "Cineo LocalVision" (free!)
5. Enter prompt: "A beautiful sunset over mountains"
6. Click "Generate Image"
7. Watch the magic happen! ✨

## 🚨 Security Note

- Keep your API keys secure
- Never commit `.env` file to git
- The `.env` file is already in `.gitignore`

---

## 🎉 You're Ready!

Once you have your API keys set up, you'll have a **fully functional AI generation platform** that can create stunning images and videos on demand!

**Happy generating!** 🎨🎬