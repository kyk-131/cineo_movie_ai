from typing import List, Optional
from pydantic import BaseSettings, validator
import os
from pathlib import Path


class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./cineo_ai.db"
    database_url_dev: str = "sqlite:///./cineo_ai.db"
    
    # Security
    secret_key: str = "your-secret-key-here-make-it-very-long-and-random"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # AI APIs
    replicate_api_token: Optional[str] = None
    huggingface_api_token: Optional[str] = None
    
    # Application
    environment: str = "development"
    debug: bool = True
    app_name: str = "Cineo AI"
    app_version: str = "1.0.0"
    
    # CORS
    allowed_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Pagination
    default_page_size: int = 20
    max_page_size: int = 100
    
    # Credits
    default_free_credits: int = 100
    monthly_credit_reset: int = 500
    
    @validator("allowed_origins", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    @property
    def database_url_actual(self) -> str:
        """Get the appropriate database URL based on environment"""
        if self.environment == "development":
            return self.database_url_dev
        return self.database_url
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Create global settings instance
settings = Settings()

# Ensure static directories exist
STATIC_DIR = Path("app/static")
GENERATED_DIR = STATIC_DIR / "generated"

STATIC_DIR.mkdir(parents=True, exist_ok=True)
GENERATED_DIR.mkdir(parents=True, exist_ok=True)