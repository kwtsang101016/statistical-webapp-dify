#!/usr/bin/env python3
"""
Image Analyzer without OCR
Analyzes screenshots for visual patterns, colors, and basic image characteristics
"""

import os
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageStat
import matplotlib.pyplot as plt
from collections import Counter

def analyze_image_colors(image_path):
    """Analyze color distribution in the image"""
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Get image statistics
            stat = ImageStat.Stat(img)
            
            # Get dominant colors
            colors = img.getcolors(maxcolors=256*256*256)
            if colors:
                # Sort by frequency
                colors.sort(key=lambda x: x[0], reverse=True)
                dominant_colors = colors[:10]  # Top 10 colors
            
            return {
                'mean_rgb': stat.mean,
                'stddev_rgb': stat.stddev,
                'dominant_colors': dominant_colors[:5] if colors else None,
                'total_colors': len(colors) if colors else 0
            }
    except Exception as e:
        return {'error': str(e)}

def detect_ui_elements(image_path):
    """Detect potential UI elements based on color patterns"""
    try:
        with Image.open(image_path) as img:
            # Convert to grayscale for edge detection
            gray = img.convert('L')
            width, height = img.size
            
            # Analyze brightness distribution
            pixels = list(gray.getdata())
            brightness_stats = {
                'mean': np.mean(pixels),
                'std': np.std(pixels),
                'min': min(pixels),
                'max': max(pixels)
            }
            
            # Detect potential text areas (high contrast regions)
            contrast_threshold = brightness_stats['std'] * 0.5
            high_contrast_pixels = [p for p in pixels if abs(p - brightness_stats['mean']) > contrast_threshold]
            contrast_ratio = len(high_contrast_pixels) / len(pixels)
            
            # Detect potential background color (most common color)
            color_counter = Counter(pixels)
            most_common_color = color_counter.most_common(1)[0]
            background_percentage = most_common_color[1] / len(pixels)
            
            return {
                'brightness_stats': brightness_stats,
                'contrast_ratio': contrast_ratio,
                'background_color': most_common_color[0],
                'background_percentage': background_percentage,
                'has_high_contrast': contrast_ratio > 0.3
            }
    except Exception as e:
        return {'error': str(e)}

def analyze_image_regions(image_path):
    """Analyze different regions of the image"""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            
            # Divide image into regions
            regions = {
                'top_left': img.crop((0, 0, width//2, height//2)),
                'top_right': img.crop((width//2, 0, width, height//2)),
                'bottom_left': img.crop((0, height//2, width//2, height)),
                'bottom_right': img.crop((width//2, height//2, width, height)),
                'center': img.crop((width//4, height//4, 3*width//4, 3*height//4))
            }
            
            region_stats = {}
            for region_name, region in regions.items():
                stat = ImageStat.Stat(region)
                region_stats[region_name] = {
                    'mean_brightness': np.mean(stat.mean),
                    'brightness_variance': np.var(stat.mean)
                }
            
            return region_stats
    except Exception as e:
        return {'error': str(e)}

def estimate_content_type(image_analysis):
    """Estimate what type of content the screenshot contains"""
    suggestions = []
    
    if 'brightness_stats' in image_analysis:
        brightness = image_analysis['brightness_stats']['mean']
        if brightness > 200:
            suggestions.append("Likely: Light theme/white background")
        elif brightness < 80:
            suggestions.append("Likely: Dark theme/dark background")
        else:
            suggestions.append("Likely: Mixed theme")
    
    if 'contrast_ratio' in image_analysis:
        if image_analysis['contrast_ratio'] > 0.4:
            suggestions.append("High contrast - likely contains text or UI elements")
        elif image_analysis['contrast_ratio'] < 0.2:
            suggestions.append("Low contrast - might be a simple interface or image")
    
    if 'background_percentage' in image_analysis:
        if image_analysis['background_percentage'] > 0.7:
            suggestions.append("Large uniform background - likely a clean interface")
    
    return suggestions

def analyze_screenshot(image_path):
    """Comprehensive analysis of a single screenshot"""
    print(f"\n📸 Analyzing: {os.path.basename(image_path)}")
    print("=" * 60)
    
    # Basic file info
    file_size = os.path.getsize(image_path)
    file_size_mb = file_size / (1024 * 1024)
    
    with Image.open(image_path) as img:
        width, height = img.size
        aspect_ratio = width / height
    
    print(f"📁 File: {os.path.basename(image_path)}")
    print(f"📐 Dimensions: {width} x {height} pixels")
    print(f"📊 Aspect ratio: {aspect_ratio:.2f}")
    print(f"💾 File size: {file_size_mb:.2f} MB")
    print(f"🎨 Color mode: {img.mode}")
    
    # Color analysis
    print(f"\n🎨 COLOR ANALYSIS")
    print("-" * 30)
    color_analysis = analyze_image_colors(image_path)
    if 'error' not in color_analysis:
        print(f"📊 Mean RGB values: {[round(x, 1) for x in color_analysis['mean_rgb']]}")
        print(f"📈 RGB standard deviation: {[round(x, 1) for x in color_analysis['stddev_rgb']]}")
        print(f"🌈 Total unique colors: {color_analysis['total_colors']}")
        
        if color_analysis['dominant_colors']:
            print("🎯 Top dominant colors:")
            for i, (count, color) in enumerate(color_analysis['dominant_colors'], 1):
                percentage = (count / (width * height)) * 100
                print(f"   {i}. RGB{color} - {percentage:.1f}% of image")
    else:
        print(f"❌ Color analysis failed: {color_analysis['error']}")
    
    # UI element detection
    print(f"\n🖥️  UI ELEMENT ANALYSIS")
    print("-" * 30)
    ui_analysis = detect_ui_elements(image_path)
    if 'error' not in ui_analysis:
        brightness = ui_analysis['brightness_stats']['mean']
        contrast = ui_analysis['contrast_ratio']
        background = ui_analysis['background_color']
        background_pct = ui_analysis['background_percentage']
        
        print(f"💡 Average brightness: {brightness:.1f}/255")
        print(f"🔍 Contrast ratio: {contrast:.2f}")
        print(f"🎨 Background color: {background}/255 ({background_pct:.1%} of image)")
        
        # Content type suggestions
        suggestions = estimate_content_type(ui_analysis)
        if suggestions:
            print("💭 Content suggestions:")
            for suggestion in suggestions:
                print(f"   • {suggestion}")
    else:
        print(f"❌ UI analysis failed: {ui_analysis['error']}")
    
    # Regional analysis
    print(f"\n🗺️  REGIONAL ANALYSIS")
    print("-" * 30)
    region_analysis = analyze_image_regions(image_path)
    if 'error' not in region_analysis:
        for region, stats in region_analysis.items():
            brightness = stats['mean_brightness']
            variance = stats['brightness_variance']
            print(f"📍 {region.replace('_', ' ').title()}: brightness={brightness:.1f}, variance={variance:.1f}")
    else:
        print(f"❌ Regional analysis failed: {region_analysis['error']}")

def main():
    """Main function"""
    print("🖼️  Screenshot Image Analyzer (No OCR)")
    print("=" * 60)
    
    screen_dir = Path("Screen")
    
    if not screen_dir.exists():
        print(f"❌ Directory not found: {screen_dir}")
        return
    
    png_files = list(screen_dir.glob("*.png"))
    
    if not png_files:
        print(f"❌ No PNG files found in {screen_dir}")
        return
    
    print(f"📁 Found {len(png_files)} screenshot(s)")
    
    for png_file in png_files:
        analyze_screenshot(str(png_file))
        print("\n" + "=" * 80)
    
    print("\n✅ Analysis complete!")
    print("\n💡 To extract text from screenshots:")
    print("   1. Install Tesseract OCR: https://github.com/tesseract-ocr/tesseract")
    print("   2. Then run: python screenshot_reader.py")

if __name__ == "__main__":
    main()
