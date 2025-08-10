import httpx
import io
import base64
from typing import Dict, Any, Optional
from PIL import Image
from app.core.config import settings
import uuid
from pathlib import Path
import asyncio


class HuggingFaceService:
    def __init__(self):
        self.api_token = settings.huggingface_api_token
        self.base_url = "https://api-inference.huggingface.co/models"
        self.headers = {
            "Authorization": f"Bearer {self.api_token}" if self.api_token else None
        }
    
    async def generate_image(
        self,
        model_id: str,
        prompt: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate image using HuggingFace Inference API"""
        try:
            # Model configurations for Cineo AI models
            model_configs = {
                "cineo-conceptart": {
                    "model": "runwayml/stable-diffusion-v1-5",
                    "params": {
                        "inputs": f"{prompt}, concept art, detailed, digital painting",
                        "parameters": {
                            "num_inference_steps": kwargs.get("steps", 30),
                            "guidance_scale": kwargs.get("guidance_scale", 7.5),
                            "width": kwargs.get("width", 512),
                            "height": kwargs.get("height", 512),
                            "seed": kwargs.get("seed"),
                        }
                    }
                },
                "cineo-portraitmaster": {
                    "model": "SG161222/Realistic_Vision_V5.1_noVAE",
                    "params": {
                        "inputs": f"portrait of {prompt}, highly detailed, professional photography, studio lighting",
                        "parameters": {
                            "num_inference_steps": kwargs.get("steps", 25),
                            "guidance_scale": kwargs.get("guidance_scale", 7.0),
                            "width": kwargs.get("width", 512),
                            "height": kwargs.get("height", 768),
                            "seed": kwargs.get("seed"),
                        }
                    }
                },
                "cineo-animecraft": {
                    "model": "Linaqruf/anything-v3.0",
                    "params": {
                        "inputs": f"{prompt}, anime style, manga, high quality, detailed",
                        "parameters": {
                            "num_inference_steps": kwargs.get("steps", 20),
                            "guidance_scale": kwargs.get("guidance_scale", 8.0),
                            "width": kwargs.get("width", 512),
                            "height": kwargs.get("height", 768),
                            "seed": kwargs.get("seed"),
                        }
                    }
                },
                "cineo-illustrationx": {
                    "model": "nitrosocke/Arcane-Diffusion",
                    "params": {
                        "inputs": f"{prompt}, illustration, arcane style, detailed artwork",
                        "parameters": {
                            "num_inference_steps": kwargs.get("steps", 25),
                            "guidance_scale": kwargs.get("guidance_scale", 7.5),
                            "width": kwargs.get("width", 512),
                            "height": kwargs.get("height", 512),
                            "seed": kwargs.get("seed"),
                        }
                    }
                },
                "cineo-photofix": {
                    "model": "timbrooks/instruct-pix2pix",
                    "params": {
                        "inputs": f"enhance and improve this image: {prompt}",
                        "parameters": {
                            "num_inference_steps": kwargs.get("steps", 20),
                            "guidance_scale": kwargs.get("guidance_scale", 7.0),
                            "seed": kwargs.get("seed"),
                        }
                    }
                },
                "cineo-stylefusion": {
                    "model": "dreamlike-art/dreamlike-diffusion-1.0",
                    "params": {
                        "inputs": f"{prompt}, artistic style, creative interpretation, unique aesthetic",
                        "parameters": {
                            "num_inference_steps": kwargs.get("steps", 30),
                            "guidance_scale": kwargs.get("guidance_scale", 8.0),
                            "width": kwargs.get("width", 512),
                            "height": kwargs.get("height", 512),
                            "seed": kwargs.get("seed"),
                        }
                    }
                },
                "cineo-naturelens": {
                    "model": "gsdf/Counterfeit-V2.5",
                    "params": {
                        "inputs": f"{prompt}, nature photography, landscape, realistic, detailed",
                        "parameters": {
                            "num_inference_steps": kwargs.get("steps", 25),
                            "guidance_scale": kwargs.get("guidance_scale", 7.0),
                            "width": kwargs.get("width", 768),
                            "height": kwargs.get("height", 512),
                            "seed": kwargs.get("seed"),
                        }
                    }
                }
            }
            
            if model_id not in model_configs:
                raise ValueError(f"Unknown model: {model_id}")
            
            config = model_configs[model_id]
            model_name = config["model"]
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/{model_name}",
                    headers=self.headers,
                    json=config["params"]
                )
                
                if response.status_code == 503:
                    # Model is loading, retry after a few seconds
                    await asyncio.sleep(20)
                    response = await client.post(
                        f"{self.base_url}/{model_name}",
                        headers=self.headers,
                        json=config["params"]
                    )
                
                if response.status_code != 200:
                    error_text = response.text
                    return {
                        "success": False,
                        "error": f"HuggingFace API error: {error_text}",
                        "result_url": None,
                        "external_id": None
                    }
                
                # Save the generated image
                image_data = response.content
                image_id = str(uuid.uuid4())
                image_path = Path(f"app/static/generated/{image_id}.png")
                
                # Ensure directory exists
                image_path.parent.mkdir(parents=True, exist_ok=True)
                
                with open(image_path, "wb") as f:
                    f.write(image_data)
                
                # Return local path as URL (will be served by FastAPI)
                result_url = f"/static/generated/{image_id}.png"
                
                return {
                    "success": True,
                    "result_url": result_url,
                    "local_path": str(image_path),
                    "external_id": image_id,
                    "metadata": {
                        "model": model_name,
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
        """Generate video using HuggingFace model"""
        try:
            # Video model configurations
            model_configs = {
                "cineo-frameflow": {
                    "model": "ali-vilab/text-to-video-ms-1.7b",
                    "params": {
                        "inputs": prompt,
                        "parameters": {
                            "num_frames": kwargs.get("num_frames", 16),
                            "height": kwargs.get("height", 320),
                            "width": kwargs.get("width", 576),
                            "num_inference_steps": kwargs.get("steps", 25),
                            "guidance_scale": kwargs.get("guidance_scale", 9.0),
                            "seed": kwargs.get("seed"),
                        }
                    }
                }
            }
            
            if model_id not in model_configs:
                raise ValueError(f"Unknown video model: {model_id}")
            
            config = model_configs[model_id]
            model_name = config["model"]
            
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.base_url}/{model_name}",
                    headers=self.headers,
                    json=config["params"]
                )
                
                if response.status_code == 503:
                    # Model is loading
                    await asyncio.sleep(30)
                    response = await client.post(
                        f"{self.base_url}/{model_name}",
                        headers=self.headers,
                        json=config["params"]
                    )
                
                if response.status_code != 200:
                    error_text = response.text
                    return {
                        "success": False,
                        "error": f"HuggingFace API error: {error_text}",
                        "result_url": None,
                        "external_id": None
                    }
                
                # Save the generated video
                video_data = response.content
                video_id = str(uuid.uuid4())
                video_path = Path(f"app/static/generated/{video_id}.mp4")
                
                with open(video_path, "wb") as f:
                    f.write(video_data)
                
                result_url = f"/static/generated/{video_id}.mp4"
                
                return {
                    "success": True,
                    "result_url": result_url,
                    "local_path": str(video_path),
                    "external_id": video_id,
                    "metadata": {
                        "model": model_name,
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