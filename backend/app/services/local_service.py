import torch
from diffusers import StableDiffusionPipeline, StableDiffusionXLPipeline
from typing import Dict, Any, Optional
import uuid
from pathlib import Path
import logging
from PIL import Image
import cv2
import numpy as np

logger = logging.getLogger(__name__)


class LocalStableDiffusionService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.pipelines = {}
        self._load_models()
    
    def _load_models(self):
        """Load Stable Diffusion models at startup"""
        try:
            # Load SDXL for high-quality image generation
            logger.info("Loading Stable Diffusion XL...")
            self.pipelines["sdxl"] = StableDiffusionXLPipeline.from_pretrained(
                "stabilityai/stable-diffusion-xl-base-1.0",
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                use_safetensors=True,
                variant="fp16" if self.device == "cuda" else None
            ).to(self.device)
            
            # Load SD 1.5 for faster generation
            logger.info("Loading Stable Diffusion 1.5...")
            self.pipelines["sd15"] = StableDiffusionPipeline.from_pretrained(
                "runwayml/stable-diffusion-v1-5",
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                use_safetensors=True
            ).to(self.device)
            
            # Enable memory efficient attention if available
            if hasattr(self.pipelines["sdxl"], "enable_xformers_memory_efficient_attention"):
                self.pipelines["sdxl"].enable_xformers_memory_efficient_attention()
                self.pipelines["sd15"].enable_xformers_memory_efficient_attention()
            
            logger.info("Local models loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load local models: {e}")
            self.pipelines = {}
    
    async def generate_image(
        self,
        model_id: str,
        prompt: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate image using local Stable Diffusion"""
        try:
            # Model configurations for local generation
            model_configs = {
                "cineo-localvision": {
                    "pipeline": "sdxl",
                    "params": {
                        "prompt": prompt,
                        "width": kwargs.get("width", 1024),
                        "height": kwargs.get("height", 1024),
                        "num_inference_steps": kwargs.get("steps", 30),
                        "guidance_scale": kwargs.get("guidance_scale", 7.5),
                        "num_images_per_prompt": 1,
                    }
                },
                "cineo-quickdraw": {
                    "pipeline": "sd15",
                    "params": {
                        "prompt": prompt,
                        "width": kwargs.get("width", 512),
                        "height": kwargs.get("height", 512),
                        "num_inference_steps": kwargs.get("steps", 20),
                        "guidance_scale": kwargs.get("guidance_scale", 7.0),
                        "num_images_per_prompt": 1,
                    }
                }
            }
            
            if model_id not in model_configs:
                raise ValueError(f"Unknown local model: {model_id}")
            
            config = model_configs[model_id]
            pipeline_name = config["pipeline"]
            
            if pipeline_name not in self.pipelines:
                raise RuntimeError(f"Pipeline {pipeline_name} not available")
            
            pipeline = self.pipelines[pipeline_name]
            params = config["params"].copy()
            
            # Add seed if provided
            if kwargs.get("seed"):
                generator = torch.Generator(device=self.device).manual_seed(kwargs["seed"])
                params["generator"] = generator
            
            # Generate image
            logger.info(f"Generating image with {pipeline_name}...")
            result = pipeline(**params)
            
            # Save the generated image
            image = result.images[0]
            image_id = str(uuid.uuid4())
            image_path = Path(f"app/static/generated/{image_id}.png")
            
            # Ensure directory exists
            image_path.parent.mkdir(parents=True, exist_ok=True)
            
            image.save(image_path)
            
            # Return local path as URL
            result_url = f"/static/generated/{image_id}.png"
            
            return {
                "success": True,
                "result_url": result_url,
                "local_path": str(image_path),
                "external_id": image_id,
                "metadata": {
                    "model": pipeline_name,
                    "parameters": params,
                    "device": self.device
                }
            }
            
        except Exception as e:
            logger.error(f"Local generation failed: {e}")
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
        """Generate video using local models (simplified approach)"""
        try:
            # For local video generation, we'll create a simple video from multiple images
            # This is a basic implementation - in production you'd use proper video models
            
            if model_id != "cineo-localvision-motion":
                raise ValueError(f"Unknown local video model: {model_id}")
            
            num_frames = kwargs.get("num_frames", 16)
            fps = kwargs.get("fps", 8)
            
            # Generate multiple images for video frames
            frames = []
            for i in range(num_frames):
                # Slightly modify prompt for each frame to create motion
                frame_prompt = f"{prompt}, frame {i+1}, slight motion variation"
                
                result = await self.generate_image(
                    "cineo-localvision",
                    frame_prompt,
                    **kwargs
                )
                
                if result["success"]:
                    # Load image and add to frames
                    image = Image.open(result["local_path"])
                    frames.append(np.array(image))
            
            if not frames:
                raise RuntimeError("Failed to generate any frames")
            
            # Create video from frames
            video_id = str(uuid.uuid4())
            video_path = Path(f"app/static/generated/{video_id}.mp4")
            
            height, width = frames[0].shape[:2]
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            video_writer = cv2.VideoWriter(str(video_path), fourcc, fps, (width, height))
            
            for frame in frames:
                # Convert RGB to BGR for OpenCV
                frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
                video_writer.write(frame_bgr)
            
            video_writer.release()
            
            result_url = f"/static/generated/{video_id}.mp4"
            
            return {
                "success": True,
                "result_url": result_url,
                "local_path": str(video_path),
                "external_id": video_id,
                "metadata": {
                    "num_frames": num_frames,
                    "fps": fps,
                    "device": self.device
                }
            }
            
        except Exception as e:
            logger.error(f"Local video generation failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "result_url": None,
                "external_id": None
            }
    
    def is_available(self) -> bool:
        """Check if local models are available"""
        return len(self.pipelines) > 0
    
    def get_device_info(self) -> Dict[str, Any]:
        """Get information about the compute device"""
        info = {
            "device": self.device,
            "available_models": list(self.pipelines.keys())
        }
        
        if self.device == "cuda":
            info.update({
                "gpu_name": torch.cuda.get_device_name(0),
                "gpu_memory": torch.cuda.get_device_properties(0).total_memory,
                "cuda_version": torch.version.cuda
            })
        
        return info