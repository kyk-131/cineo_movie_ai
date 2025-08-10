import replicate
from typing import Dict, Any, Optional
from app.core.config import settings
import asyncio
import httpx
from pathlib import Path
import uuid


class ReplicateService:
    def __init__(self):
        if settings.replicate_api_token:
            replicate.api_token = settings.replicate_api_token
    
    async def generate_image(
        self,
        model_id: str,
        prompt: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate image using Replicate model"""
        try:
            # Model configurations for Cineo AI models
            model_configs = {
                "cineo-vision-pro": {
                    "model": "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
                    "params": {
                        "prompt": prompt,
                        "width": kwargs.get("width", 1024),
                        "height": kwargs.get("height", 1024),
                        "num_inference_steps": kwargs.get("steps", 30),
                        "guidance_scale": kwargs.get("guidance_scale", 7.5),
                        "seed": kwargs.get("seed"),
                    }
                },
                "cineo-ultrareal": {
                    "model": "lucataco/realistic-vision-v5:eab7df6f9ab5c3b18c3d4631eba1c9b1c7e3b3a3d0f0e4a1b2c3d4e5f6g7h8i9",
                    "params": {
                        "prompt": prompt,
                        "width": kwargs.get("width", 768),
                        "height": kwargs.get("height", 768),
                        "num_inference_steps": kwargs.get("steps", 25),
                        "guidance_scale": kwargs.get("guidance_scale", 7.0),
                        "seed": kwargs.get("seed"),
                    }
                },
                "cineo-3dform": {
                    "model": "prompthero/openjourney-v4:c8b4c2c9a3b1c7e9d3e2f1a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4",
                    "params": {
                        "prompt": f"{prompt}, 3D rendered, octane render, high quality",
                        "width": kwargs.get("width", 768),
                        "height": kwargs.get("height", 768),
                        "num_inference_steps": kwargs.get("steps", 20),
                        "guidance_scale": kwargs.get("guidance_scale", 7.0),
                        "seed": kwargs.get("seed"),
                    }
                },
                "cineo-retrovibe": {
                    "model": "ai-forever/kandinsky-2.2:ad601ca43a80c002b4e1921e78b6e20cec2d21b3a3a41f86b7dc67179e5a4e66",
                    "params": {
                        "prompt": f"{prompt}, retro style, vintage aesthetic, 80s vibe",
                        "width": kwargs.get("width", 768),
                        "height": kwargs.get("height", 768),
                        "num_inference_steps": kwargs.get("steps", 25),
                        "guidance_scale": kwargs.get("guidance_scale", 7.0),
                        "seed": kwargs.get("seed"),
                    }
                }
            }
            
            if model_id not in model_configs:
                raise ValueError(f"Unknown model: {model_id}")
            
            config = model_configs[model_id]
            
            # Start generation
            prediction = replicate.run(
                config["model"],
                input=config["params"]
            )
            
            # Get result URL (first image if multiple)
            result_url = prediction[0] if isinstance(prediction, list) else prediction
            
            return {
                "success": True,
                "result_url": result_url,
                "external_id": None,  # Replicate doesn't return prediction IDs in run()
                "metadata": {
                    "model": config["model"],
                    "parameters": config["params"]
                }
            }
            
        except Exception as e:
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
        """Generate video using Replicate model"""
        try:
            # Video model configurations
            model_configs = {
                "cineo-motion": {
                    "model": "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
                    "params": {
                        "prompt": prompt,
                        "width": kwargs.get("width", 1024),
                        "height": kwargs.get("height", 576),
                        "num_frames": kwargs.get("num_frames", 24),
                        "num_inference_steps": kwargs.get("steps", 20),
                        "guidance_scale": kwargs.get("guidance_scale", 7.5),
                        "seed": kwargs.get("seed"),
                    }
                },
                "cineo-quicktake": {
                    "model": "deforum/deforum_stable_diffusion:e22e77d4d90b4fccb5e9ac0b03a11c7b72ed3b5c8a3f6b1a8d3c9e7f1a2b4c6d8",
                    "params": {
                        "prompt": prompt,
                        "width": kwargs.get("width", 768),
                        "height": kwargs.get("height", 768),
                        "max_frames": kwargs.get("num_frames", 16),
                        "seed": kwargs.get("seed"),
                    }
                }
            }
            
            if model_id not in model_configs:
                raise ValueError(f"Unknown video model: {model_id}")
            
            config = model_configs[model_id]
            
            # Start generation
            prediction = replicate.run(
                config["model"],
                input=config["params"]
            )
            
            result_url = prediction[0] if isinstance(prediction, list) else prediction
            
            return {
                "success": True,
                "result_url": result_url,
                "external_id": None,
                "metadata": {
                    "model": config["model"],
                    "parameters": config["params"]
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "result_url": None,
                "external_id": None
            }
    
    async def check_generation_status(self, external_id: str) -> Dict[str, Any]:
        """Check status of a generation (if using async predictions)"""
        try:
            prediction = replicate.predictions.get(external_id)
            
            return {
                "status": prediction.status,
                "result_url": prediction.output,
                "error": prediction.error if prediction.status == "failed" else None
            }
            
        except Exception as e:
            return {
                "status": "failed",
                "result_url": None,
                "error": str(e)
            }