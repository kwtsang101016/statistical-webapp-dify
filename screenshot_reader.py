#!/usr/bin/env python3
"""
Screenshot Reader and Analyzer
Reads PNG screenshots and extracts text content using OCR
"""

import os
import sys
from pathlib import Path
from PIL import Image
import pytesseract
import cv2
import numpy as np

def install_dependencies():
    """Install required dependencies if not already installed"""
    try:
        import pytesseract
        import cv2
        from PIL import Image
        print("✓ All dependencies are already installed")
        return True
    except ImportError as e:
        print(f"✗ Missing dependency: {e}")
        print("Installing required packages...")
        os.system("pip install pillow pytesseract opencv-python")
        print("Please restart the script after installation")
        return False

def preprocess_image(image_path):
    """Preprocess image for better OCR results"""
    try:
        # Load image
        image = cv2.imread(image_path)
        
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply noise reduction
        denoised = cv2.medianBlur(gray, 3)
        
        # Apply threshold to get binary image
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        return thresh
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

def extract_text_from_screenshot(image_path):
    """Extract text from screenshot using OCR"""
    try:
        print(f"\n📸 Analyzing: {os.path.basename(image_path)}")
        print("=" * 50)
        
        # Check if file exists
        if not os.path.exists(image_path):
            print(f"❌ File not found: {image_path}")
            return None
        
        # Set Tesseract path for Windows
        tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        if os.path.exists(tesseract_path):
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
        
        # Get image info
        with Image.open(image_path) as img:
            width, height = img.size
            print(f"📐 Image dimensions: {width}x{height}")
            print(f"🎨 Image mode: {img.mode}")
            print(f"💾 File size: {os.path.getsize(image_path)} bytes")
        
        # Try different OCR approaches
        results = {}
        
        # Method 1: Direct OCR on original image
        try:
            original_text = pytesseract.image_to_string(Image.open(image_path), lang='eng')
            results['original'] = original_text.strip()
            print(f"✅ Original image OCR completed")
        except Exception as e:
            print(f"❌ Original image OCR failed: {e}")
            results['original'] = None
        
        # Method 2: OCR on preprocessed image
        try:
            preprocessed = preprocess_image(image_path)
            if preprocessed is not None:
                preprocessed_text = pytesseract.image_to_string(preprocessed, lang='eng')
                results['preprocessed'] = preprocessed_text.strip()
                print(f"✅ Preprocessed image OCR completed")
            else:
                results['preprocessed'] = None
        except Exception as e:
            print(f"❌ Preprocessed image OCR failed: {e}")
            results['preprocessed'] = None
        
        # Method 3: OCR with different page segmentation modes
        try:
            # Try different PSM modes for better text detection
            psm_modes = [6, 7, 8, 13]  # Different page segmentation modes
            for psm in psm_modes:
                try:
                    config = f'--psm {psm}'
                    text = pytesseract.image_to_string(Image.open(image_path), config=config)
                    if text.strip() and len(text.strip()) > 10:  # Only save if substantial text found
                        results[f'psm_{psm}'] = text.strip()
                        print(f"✅ PSM mode {psm} OCR completed")
                except Exception as e:
                    continue
        except Exception as e:
            print(f"❌ PSM modes OCR failed: {e}")
        
        return results
        
    except Exception as e:
        print(f"❌ Error extracting text from {image_path}: {e}")
        return None

def analyze_screenshot_content(text_results):
    """Analyze the extracted text content"""
    if not text_results:
        return
    
    print("\n📊 CONTENT ANALYSIS")
    print("=" * 50)
    
    for method, text in text_results.items():
        if text and len(text.strip()) > 0:
            print(f"\n🔍 Method: {method}")
            print(f"📝 Text length: {len(text)} characters")
            print(f"📄 Number of lines: {len(text.splitlines())}")
            
            # Show first few lines
            lines = text.splitlines()
            print("📋 Content preview:")
            for i, line in enumerate(lines[:10]):  # Show first 10 lines
                if line.strip():
                    print(f"   {i+1:2d}: {line.strip()}")
            
            if len(lines) > 10:
                print(f"   ... and {len(lines) - 10} more lines")
            
            # Look for specific patterns
            keywords = ['error', 'warning', 'success', 'button', 'click', 'input', 'form', 'api', 'data']
            found_keywords = [kw for kw in keywords if kw.lower() in text.lower()]
            if found_keywords:
                print(f"🔑 Keywords found: {', '.join(found_keywords)}")
            
            print("-" * 30)

def main():
    """Main function to analyze screenshots"""
    print("🖼️  Screenshot Reader and Analyzer")
    print("=" * 50)
    
    # Check dependencies
    if not install_dependencies():
        return
    
    # Define screenshot directory
    screen_dir = Path("Screen")
    
    if not screen_dir.exists():
        print(f"❌ Directory not found: {screen_dir}")
        return
    
    # Find all PNG files
    png_files = list(screen_dir.glob("*.png"))
    
    if not png_files:
        print(f"❌ No PNG files found in {screen_dir}")
        return
    
    print(f"📁 Found {len(png_files)} screenshot(s):")
    for png_file in png_files:
        print(f"   • {png_file.name}")
    
    # Analyze each screenshot
    for png_file in png_files:
        text_results = extract_text_from_screenshot(str(png_file))
        if text_results:
            analyze_screenshot_content(text_results)
        
        print("\n" + "=" * 80)
    
    print("\n✅ Analysis complete!")

if __name__ == "__main__":
    main()
