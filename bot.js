#!/usr/bin/env python3
"""
Dubai Lamborghini Scene Generator
Transforms your photo into a Dubai desert scene with a Lamborghini
"""

import anthropic
import base64
import sys
from pathlib import Path

def encode_image_to_base64(image_path: str) -> str:
    """Convert image file to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.standard_b64encode(image_file.read()).decode("utf-8")

def get_image_media_type(image_path: str) -> str:
    """Determine media type from file extension"""
    ext = Path(image_path).suffix.lower()
    media_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp"
    }
    return media_types.get(ext, "image/jpeg")

def generate_dubai_scene(image_path: str, output_path: str = "dubai_lamborghini.txt"):
    """
    Generate a detailed prompt to transform your photo into a Dubai luxury scene
    """
    
    client = anthropic.Anthropic()
    
    # Encode the image
    image_data = encode_image_to_base64(image_path)
    media_type = get_image_media_type(image_path)
    
    # Create the prompt for Claude to analyze and describe the transformation
    message = client.messages.create(
        model="claude-opus-4-20250805",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": """Analyze this photo and create a detailed, vivid prompt for an AI image generator 
                        to transform it into a luxury Dubai desert scene. 

                        The new scene should include:
                        - The person from this photo positioned in the center
                        - A stunning golden Lamborghini (Aventador or Huracán style)
                        - Vast golden desert dunes in the background
                        - Dubai skyline visible in the distant background
                        - Dramatic sunset lighting with warm golden/orange tones
                        - Luxury desert atmosphere with rich colors
                        - Professional photography quality
                        - Cinematic composition

                        Provide ONLY the detailed image generation prompt in English. 
                        Make it vivid, specific, and ready to use with DALL-E, Midjourney, or similar tools.
                        Start directly with the prompt, no preamble."""
                    }
                ],
            }
        ],
    )
    
    # Extract the generated prompt
    generated_prompt = message.content[0].text
    
    # Save to file
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("=== DUBAI LAMBORGHINI SCENE PROMPT ===\n\n")
        f.write(generated_prompt)
        f.write("\n\n=== HOW TO USE THIS PROMPT ===\n\n")
        f.write("1. MIDJOURNEY: /imagine prompt: " + generated_prompt[:100] + "...\n")
        f.write("2. DALL-E: Use the full prompt in ChatGPT or DALL-E API\n")
        f.write("3. LEONARDO.AI: Paste into the prompt field\n")
        f.write("4. ANTHROPIC CLAUDE: Use with vision capabilities\n")
    
    print(f"✓ Prompt generated successfully!")
    print(f"✓ Saved to: {output_path}\n")
    print("=" * 60)
    print("GENERATED PROMPT:")
    print("=" * 60)
    print(generated_prompt)
    print("=" * 60)
    
    return generated_prompt

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_your_photo>")
        print("Example: python script.py my_photo.jpg")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not Path(image_path).exists():
        print(f"Error: File '{image_path}' not found")
        sys.exit(1)
    
    generate_dubai_scene(image_path)
