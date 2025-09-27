#!/usr/bin/env python3
"""
Simple Screenshot Information Extractor
Provides basic information about PNG screenshots without requiring OCR dependencies
"""

import os
import sys
from pathlib import Path

def get_image_info(image_path):
    """Get basic information about an image file"""
    try:
        if not os.path.exists(image_path):
            return None
        
        file_size = os.path.getsize(image_path)
        file_size_mb = file_size / (1024 * 1024)
        
        info = {
            'filename': os.path.basename(image_path),
            'file_size_bytes': file_size,
            'file_size_mb': round(file_size_mb, 2),
            'exists': True
        }
        
        # Try to get image dimensions using PIL if available
        try:
            from PIL import Image
            with Image.open(image_path) as img:
                info['width'] = img.width
                info['height'] = img.height
                info['mode'] = img.mode
                info['format'] = img.format
        except ImportError:
            info['pil_available'] = False
        except Exception as e:
            info['pil_error'] = str(e)
        
        return info
        
    except Exception as e:
        return {'error': str(e)}

def analyze_screenshot_directory(directory="Screen"):
    """Analyze all screenshots in a directory"""
    print("🖼️  Simple Screenshot Information Extractor")
    print("=" * 60)
    
    screen_path = Path(directory)
    
    if not screen_path.exists():
        print(f"❌ Directory not found: {directory}")
        return
    
    # Find all PNG files
    png_files = list(screen_path.glob("*.png"))
    
    if not png_files:
        print(f"❌ No PNG files found in {directory}")
        return
    
    print(f"📁 Found {len(png_files)} screenshot(s) in '{directory}' directory:\n")
    
    for i, png_file in enumerate(png_files, 1):
        print(f"📸 Screenshot #{i}: {png_file.name}")
        print("-" * 40)
        
        info = get_image_info(str(png_file))
        
        if info and 'error' not in info:
            print(f"📁 File: {info['filename']}")
            print(f"💾 Size: {info['file_size_mb']} MB ({info['file_size_bytes']:,} bytes)")
            
            if 'width' in info:
                print(f"📐 Dimensions: {info['width']} x {info['height']} pixels")
                print(f"🎨 Color mode: {info['mode']}")
                print(f"📄 Format: {info['format']}")
                
                # Calculate aspect ratio
                aspect_ratio = info['width'] / info['height']
                print(f"📊 Aspect ratio: {aspect_ratio:.2f}")
                
                # Estimate what type of content this might be
                if aspect_ratio > 1.5:
                    print("💡 Likely: Wide screen/landscape view")
                elif aspect_ratio < 0.8:
                    print("💡 Likely: Portrait/mobile view")
                else:
                    print("💡 Likely: Standard screen view")
            else:
                print("ℹ️  Install Pillow (PIL) for detailed image information:")
                print("   pip install Pillow")
            
            print()
        else:
            print(f"❌ Error reading file: {info.get('error', 'Unknown error')}")
            print()
    
    print("📋 Summary:")
    print(f"   • Total screenshots: {len(png_files)}")
    total_size = sum(get_image_info(str(f)).get('file_size_mb', 0) for f in png_files)
    print(f"   • Total size: {total_size:.2f} MB")
    
    # Provide suggestions for further analysis
    print("\n💡 Suggestions for further analysis:")
    print("   1. Install OCR tools to extract text from images:")
    print("      pip install pytesseract opencv-python")
    print("   2. Use the screenshot_reader.py script for detailed text extraction")
    print("   3. Open images in an image viewer to see the actual content")

def main():
    """Main function"""
    if len(sys.argv) > 1:
        directory = sys.argv[1]
    else:
        directory = "Screen"
    
    analyze_screenshot_directory(directory)

if __name__ == "__main__":
    main()
