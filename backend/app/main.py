from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import create_tables
from app.routes import auth, generation
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("app.log")
    ]
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered image and video generation platform",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount static files for serving generated content
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Include routers
app.include_router(auth.router)
app.include_router(generation.router)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app_name": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.app_name} API",
        "version": settings.app_version,
        "docs": "/docs" if settings.debug else "Documentation not available in production"
    }

# Dashboard endpoint
@app.get("/dashboard")
async def get_dashboard():
    """Get dashboard data (placeholder)"""
    # This would be implemented with real user data
    return {
        "user": {
            "id": "placeholder",
            "email": "user@example.com",
            "credits": 1250,
            "plan": "Pro Plan",
            "created_at": "2024-01-01T00:00:00Z"
        },
        "recent_generations": [],
        "usage_stats": {
            "total_generations": 0,
            "credits_used_this_month": 0,
            "images_generated": 0,
            "videos_generated": 0
        }
    }

# Models endpoint
@app.get("/models")
async def get_models():
    """Get available AI models"""
    from app.services.ai_service import AIService
    
    ai_service = AIService()
    
    # Get available models from AI service
    available_models = ai_service.get_available_models()
    
    # Model information with descriptions
    model_info = {
        # Image models - Replicate
        "cineo-vision-pro": {
            "name": "Cineo Vision Pro",
            "description": "Premium high-resolution image generation with SDXL. Perfect for professional artwork and detailed scenes.",
            "type": "image",
            "provider": "replicate",
            "credits_per_generation": 5,
            "category": "premium",
            "features": ["High resolution", "Premium quality", "Professional grade"]
        },
        "cineo-ultrareal": {
            "name": "Cineo UltraReal",
            "description": "Photorealistic image generation for lifelike portraits and scenes.",
            "type": "image",
            "provider": "replicate",
            "credits_per_generation": 4,
            "category": "realistic",
            "features": ["Photorealistic", "Portrait optimized", "High detail"]
        },
        "cineo-3dform": {
            "name": "Cineo 3DForm",
            "description": "3D rendered style images with depth and professional rendering quality.",
            "type": "image",
            "provider": "replicate",
            "credits_per_generation": 4,
            "category": "3d",
            "features": ["3D rendering", "Octane render", "Professional quality"]
        },
        "cineo-retrovibe": {
            "name": "Cineo RetroVibe",
            "description": "Vintage and retro aesthetic images with 80s and nostalgic vibes.",
            "type": "image",
            "provider": "replicate",
            "credits_per_generation": 3,
            "category": "artistic",
            "features": ["Retro style", "Vintage aesthetic", "80s vibe"]
        },
        
        # Image models - HuggingFace
        "cineo-conceptart": {
            "name": "Cineo ConceptArt",
            "description": "Digital concept art and illustrations perfect for game design and creative projects.",
            "type": "image",
            "provider": "huggingface",
            "credits_per_generation": 3,
            "category": "artistic",
            "features": ["Concept art", "Digital painting", "Creative design"]
        },
        "cineo-portraitmaster": {
            "name": "Cineo PortraitMaster",
            "description": "Professional portrait generation with studio lighting and composition.",
            "type": "image",
            "provider": "huggingface",
            "credits_per_generation": 4,
            "category": "portrait",
            "features": ["Professional portraits", "Studio lighting", "High quality"]
        },
        "cineo-animecraft": {
            "name": "Cineo AnimeCraft",
            "description": "Anime and manga style illustrations with authentic Japanese art aesthetics.",
            "type": "image",
            "provider": "huggingface",
            "credits_per_generation": 3,
            "category": "anime",
            "features": ["Anime style", "Manga artwork", "Japanese aesthetics"]
        },
        "cineo-illustrationx": {
            "name": "Cineo IllustrationX",
            "description": "Stylized illustrations with unique artistic flair and creative interpretation.",
            "type": "image",
            "provider": "huggingface",
            "credits_per_generation": 3,
            "category": "illustration",
            "features": ["Artistic style", "Unique illustrations", "Creative design"]
        },
        "cineo-photofix": {
            "name": "Cineo PhotoFix",
            "description": "Image enhancement and improvement with AI-powered corrections.",
            "type": "image",
            "provider": "huggingface",
            "credits_per_generation": 4,
            "category": "enhancement",
            "features": ["Image enhancement", "Quality improvement", "AI corrections"]
        },
        "cineo-stylefusion": {
            "name": "Cineo StyleFusion",
            "description": "Artistic style transfer and creative interpretations with multiple aesthetics.",
            "type": "image",
            "provider": "huggingface",
            "credits_per_generation": 3,
            "category": "artistic",
            "features": ["Style transfer", "Creative interpretation", "Multiple aesthetics"]
        },
        "cineo-naturelens": {
            "name": "Cineo NatureLens",
            "description": "Nature photography and landscape generation with realistic environmental details.",
            "type": "image",
            "provider": "huggingface",
            "credits_per_generation": 3,
            "category": "nature",
            "features": ["Nature photography", "Landscape generation", "Environmental details"]
        },
        
        # Local image models
        "cineo-localvision": {
            "name": "Cineo LocalVision",
            "description": "High-quality local generation with GPU acceleration. Instant results at the lowest cost.",
            "type": "image",
            "provider": "local",
            "credits_per_generation": 1,
            "category": "local",
            "features": ["Instant generation", "GPU accelerated", "Lowest cost"]
        },
        "cineo-quickdraw": {
            "name": "Cineo QuickDraw",
            "description": "Fast local image generation perfect for quick iterations and testing.",
            "type": "image",
            "provider": "local",
            "credits_per_generation": 1,
            "category": "local",
            "features": ["Fast generation", "Quick iterations", "Local processing"]
        },
        
        # Video models
        "cineo-motion": {
            "name": "Cineo Motion",
            "description": "Premium video generation with smooth motion and high-quality temporal consistency.",
            "type": "video",
            "provider": "replicate",
            "credits_per_generation": 25,
            "category": "premium",
            "features": ["Smooth motion", "High quality", "Temporal consistency"]
        },
        "cineo-quicktake": {
            "name": "Cineo QuickTake",
            "description": "Fast video generation for quick clips and creative experiments.",
            "type": "video",
            "provider": "replicate",
            "credits_per_generation": 20,
            "category": "fast",
            "features": ["Fast generation", "Quick clips", "Creative experiments"]
        },
        "cineo-frameflow": {
            "name": "Cineo FrameFlow",
            "description": "Text-to-video generation with natural frame transitions and movement.",
            "type": "video",
            "provider": "huggingface",
            "credits_per_generation": 15,
            "category": "natural",
            "features": ["Natural transitions", "Frame flow", "Smooth movement"]
        },
        "cineo-localvision-motion": {
            "name": "Cineo LocalVision Motion",
            "description": "Local video generation using frame sequences. Basic motion at low cost.",
            "type": "video",
            "provider": "local",
            "credits_per_generation": 5,
            "category": "local",
            "features": ["Local processing", "Frame sequences", "Low cost"]
        }
    }
    
    # Combine with availability info
    result = []
    for model_id, info in model_info.items():
        model_data = info.copy()
        model_data["id"] = model_id
        model_data["available"] = available_models.get(model_id, {}).get("available", False)
        result.append(model_data)
    
    return result

# Credits endpoint
@app.get("/credits")
async def get_credits():
    """Get user credits (placeholder)"""
    return {"credits": 1250}

# Plans endpoint  
@app.get("/plans")
async def get_plans():
    """Get subscription plans"""
    return [
        {
            "id": "free",
            "name": "Free Plan",
            "description": "Perfect for getting started with AI generation",
            "price_monthly": 0,
            "price_yearly": 0,
            "monthly_credits": 100,
            "features": [
                "100 credits per month",
                "Access to local models",
                "Basic support",
                "Standard quality"
            ]
        },
        {
            "id": "pro",
            "name": "Pro Plan",
            "description": "For creators who need more power and flexibility",
            "price_monthly": 19.99,
            "price_yearly": 199.99,
            "monthly_credits": 500,
            "features": [
                "500 credits per month",
                "Access to all models",
                "Priority support",
                "High-resolution outputs",
                "Commercial usage rights"
            ]
        },
        {
            "id": "enterprise",
            "name": "Enterprise Plan",
            "description": "For teams and businesses with high-volume needs",
            "price_monthly": 99.99,
            "price_yearly": 999.99,
            "monthly_credits": 2500,
            "features": [
                "2500 credits per month",
                "All premium models",
                "Dedicated support",
                "Custom integrations",
                "Team management",
                "Commercial license"
            ]
        }
    ]

# Coupon redemption endpoint
@app.post("/coupon/redeem")
async def redeem_coupon():
    """Redeem coupon code (placeholder)"""
    return {"credits_added": 50}

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug mode: {settings.debug}")
    
    # Create database tables
    create_tables()
    logger.info("Database tables created")
    
    # Initialize AI services
    from app.services.ai_service import AIService
    ai_service = AIService()
    provider_status = ai_service.get_provider_status()
    
    logger.info("AI Service Provider Status:")
    for provider, status in provider_status.items():
        logger.info(f"  {provider}: {'✓' if status['available'] else '✗'}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )