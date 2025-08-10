from typing import Dict, Any, Optional
from .replicate_service import ReplicateService
from .huggingface_service import HuggingFaceService
from .local_service import LocalStableDiffusionService
from app.models.ai_model import ModelProvider
import logging

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        # Initialize all services
        self.replicate_service = ReplicateService()
        self.huggingface_service = HuggingFaceService()
        self.local_service = LocalStableDiffusionService()
        
        # Model to provider mapping
        self.model_providers = {
            # Replicate models
            "cineo-vision-pro": ModelProvider.REPLICATE,
            "cineo-ultrareal": ModelProvider.REPLICATE,
            "cineo-3dform": ModelProvider.REPLICATE,
            "cineo-retrovibe": ModelProvider.REPLICATE,
            "cineo-motion": ModelProvider.REPLICATE,
            "cineo-quicktake": ModelProvider.REPLICATE,
            
            # HuggingFace models
            "cineo-conceptart": ModelProvider.HUGGINGFACE,
            "cineo-portraitmaster": ModelProvider.HUGGINGFACE,
            "cineo-animecraft": ModelProvider.HUGGINGFACE,
            "cineo-illustrationx": ModelProvider.HUGGINGFACE,
            "cineo-photofix": ModelProvider.HUGGINGFACE,
            "cineo-stylefusion": ModelProvider.HUGGINGFACE,
            "cineo-naturelens": ModelProvider.HUGGINGFACE,
            "cineo-frameflow": ModelProvider.HUGGINGFACE,
            
            # Local models
            "cineo-localvision": ModelProvider.LOCAL,
            "cineo-quickdraw": ModelProvider.LOCAL,
            "cineo-localvision-motion": ModelProvider.LOCAL,
        }
    
    async def generate_image(
        self,
        model_id: str,
        prompt: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate image using the appropriate service based on model"""
        try:
            provider = self.model_providers.get(model_id)
            if not provider:
                return {
                    "success": False,
                    "error": f"Unknown model: {model_id}",
                    "result_url": None,
                    "external_id": None
                }
            
            logger.info(f"Generating image with {model_id} via {provider}")
            
            if provider == ModelProvider.REPLICATE:
                return await self.replicate_service.generate_image(model_id, prompt, **kwargs)
            elif provider == ModelProvider.HUGGINGFACE:
                return await self.huggingface_service.generate_image(model_id, prompt, **kwargs)
            elif provider == ModelProvider.LOCAL:
                return await self.local_service.generate_image(model_id, prompt, **kwargs)
            else:
                return {
                    "success": False,
                    "error": f"Provider {provider} not implemented",
                    "result_url": None,
                    "external_id": None
                }
                
        except Exception as e:
            logger.error(f"Image generation failed for {model_id}: {e}")
            return {
                "success": False,
                "error": str(e),
                "result_url": None,
                "external_id": None
            }
    
    async def generate_video(
        self,
        model_id: str,
        prompt: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate video using the appropriate service based on model"""
        try:
            provider = self.model_providers.get(model_id)
            if not provider:
                return {
                    "success": False,
                    "error": f"Unknown video model: {model_id}",
                    "result_url": None,
                    "external_id": None
                }
            
            logger.info(f"Generating video with {model_id} via {provider}")
            
            if provider == ModelProvider.REPLICATE:
                return await self.replicate_service.generate_video(model_id, prompt, **kwargs)
            elif provider == ModelProvider.HUGGINGFACE:
                return await self.huggingface_service.generate_video(model_id, prompt, **kwargs)
            elif provider == ModelProvider.LOCAL:
                return await self.local_service.generate_video(model_id, prompt, **kwargs)
            else:
                return {
                    "success": False,
                    "error": f"Provider {provider} not implemented for video",
                    "result_url": None,
                    "external_id": None
                }
                
        except Exception as e:
            logger.error(f"Video generation failed for {model_id}: {e}")
            return {
                "success": False,
                "error": str(e),
                "result_url": None,
                "external_id": None
            }
    
    def get_available_models(self) -> Dict[str, Dict[str, Any]]:
        """Get information about all available models"""
        models = {}
        
        for model_id, provider in self.model_providers.items():
            model_info = {
                "id": model_id,
                "provider": provider.value,
                "available": True
            }
            
            # Check availability based on provider
            if provider == ModelProvider.LOCAL:
                model_info["available"] = self.local_service.is_available()
                if model_info["available"]:
                    model_info["device_info"] = self.local_service.get_device_info()
            elif provider == ModelProvider.REPLICATE:
                model_info["available"] = bool(self.replicate_service.replicate.api_token)
            elif provider == ModelProvider.HUGGINGFACE:
                model_info["available"] = bool(self.huggingface_service.api_token)
            
            models[model_id] = model_info
        
        return models
    
    def get_provider_status(self) -> Dict[str, Dict[str, Any]]:
        """Get status of all providers"""
        return {
            "replicate": {
                "available": bool(self.replicate_service.replicate.api_token),
                "models": [k for k, v in self.model_providers.items() if v == ModelProvider.REPLICATE]
            },
            "huggingface": {
                "available": bool(self.huggingface_service.api_token),
                "models": [k for k, v in self.model_providers.items() if v == ModelProvider.HUGGINGFACE]
            },
            "local": {
                "available": self.local_service.is_available(),
                "device_info": self.local_service.get_device_info() if self.local_service.is_available() else None,
                "models": [k for k, v in self.model_providers.items() if v == ModelProvider.LOCAL]
            }
        }