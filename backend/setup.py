#!/usr/bin/env python3
"""
Cineo AI Backend Setup Script
This script helps you set up the backend with proper configuration.
"""

import os
import secrets
import sys
from pathlib import Path

def print_banner():
    """Print welcome banner"""
    print("=" * 60)
    print("🚀 CINEO AI BACKEND SETUP")
    print("=" * 60)
    print("This script will help you configure your Cineo AI backend!")
    print()

def generate_secret_key():
    """Generate a secure secret key"""
    return secrets.token_urlsafe(32)

def create_env_file():
    """Create .env file from template"""
    env_example = Path(".env.example")
    env_file = Path(".env")
    
    if env_file.exists():
        response = input("⚠️  .env file already exists. Overwrite? (y/N): ")
        if response.lower() != 'y':
            print("✅ Keeping existing .env file")
            return str(env_file)
    
    if not env_example.exists():
        print("❌ .env.example file not found!")
        print("Please make sure you're running this from the backend directory.")
        sys.exit(1)
    
    # Read template
    with open(env_example, 'r') as f:
        content = f.read()
    
    # Generate secret key
    secret_key = generate_secret_key()
    content = content.replace(
        "SECRET_KEY=your-super-secret-jwt-key-here-change-this-in-production",
        f"SECRET_KEY={secret_key}"
    )
    
    # Write .env file
    with open(env_file, 'w') as f:
        f.write(content)
    
    print(f"✅ Created {env_file} with secure secret key")
    return str(env_file)

def get_api_keys():
    """Get API keys from user"""
    print("\n📋 API KEYS SETUP")
    print("-" * 30)
    
    print("\n🔄 REPLICATE API KEY")
    print("1. Go to: https://replicate.com/account/api-tokens")
    print("2. Sign up and create a new token")
    print("3. Copy the token (starts with 'r8_')")
    
    replicate_key = input("\nEnter your Replicate API key (or press Enter to skip): ").strip()
    
    print("\n🤗 HUGGINGFACE API KEY") 
    print("1. Go to: https://huggingface.co/settings/tokens")
    print("2. Sign up and create a new token")
    print("3. Copy the token (starts with 'hf_')")
    
    hf_key = input("\nEnter your HuggingFace API key (or press Enter to skip): ").strip()
    
    return replicate_key, hf_key

def update_env_with_keys(env_file, replicate_key, hf_key):
    """Update .env file with API keys"""
    if not replicate_key and not hf_key:
        print("\n⚠️  No API keys provided. You can add them later to .env file.")
        return
    
    with open(env_file, 'r') as f:
        content = f.read()
    
    if replicate_key:
        content = content.replace(
            "REPLICATE_API_TOKEN=r8_your_replicate_api_token_here",
            f"REPLICATE_API_TOKEN={replicate_key}"
        )
        print("✅ Added Replicate API key")
    
    if hf_key:
        content = content.replace(
            "HUGGINGFACE_API_TOKEN=hf_your_huggingface_api_token_here", 
            f"HUGGINGFACE_API_TOKEN={hf_key}"
        )
        print("✅ Added HuggingFace API key")
    
    with open(env_file, 'w') as f:
        f.write(content)

def check_dependencies():
    """Check if dependencies are installed"""
    print("\n📦 CHECKING DEPENDENCIES")
    print("-" * 30)
    
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        print("✅ Core dependencies found")
        return True
    except ImportError:
        print("❌ Dependencies not installed")
        print("Run: pip install -r requirements.txt")
        return False

def print_next_steps():
    """Print next steps"""
    print("\n🎯 NEXT STEPS")
    print("-" * 30)
    print("1. Install dependencies (if not done):")
    print("   pip install -r requirements.txt")
    print()
    print("2. Start the backend:")
    print("   python app/main.py")
    print()
    print("3. Test the setup:")
    print("   Visit: http://localhost:8000/health")
    print()
    print("4. Start the frontend (in another terminal):")
    print("   cd ../frontend")
    print("   npm run dev") 
    print()
    print("5. Visit your app:")
    print("   http://localhost:3000")
    print()
    print("📚 Read API_SETUP_GUIDE.md for detailed instructions!")

def main():
    """Main setup function"""
    print_banner()
    
    # Create .env file
    env_file = create_env_file()
    
    # Get API keys
    replicate_key, hf_key = get_api_keys()
    
    # Update .env with keys
    update_env_with_keys(env_file, replicate_key, hf_key)
    
    # Check dependencies
    deps_ok = check_dependencies()
    
    # Print next steps
    print_next_steps()
    
    if not deps_ok:
        print("\n⚠️  Please install dependencies before continuing!")
    else:
        print("\n🎉 Setup complete! Your Cineo AI backend is ready!")

if __name__ == "__main__":
    main()