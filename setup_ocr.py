#!/usr/bin/env python3
"""
OCR Setup Helper for Screenshot Analysis
Provides instructions and helps set up Tesseract OCR for text extraction
"""

import os
import sys
import platform
import subprocess
from pathlib import Path

def check_tesseract_installation():
    """Check if Tesseract is installed and accessible"""
    try:
        result = subprocess.run(['tesseract', '--version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            version_info = result.stdout.split('\n')[0]
            return True, version_info
        else:
            return False, "Tesseract not found in PATH"
    except FileNotFoundError:
        return False, "Tesseract executable not found"
    except subprocess.TimeoutExpired:
        return False, "Tesseract command timed out"
    except Exception as e:
        return False, f"Error checking Tesseract: {e}"

def get_installation_instructions():
    """Get platform-specific installation instructions"""
    system = platform.system().lower()
    
    instructions = {
        'windows': {
            'method1': {
                'title': 'Method 1: Using Chocolatey (Recommended)',
                'steps': [
                    '1. Install Chocolatey if not already installed:',
                    '   https://chocolatey.org/install',
                    '2. Run in PowerShell as Administrator:',
                    '   choco install tesseract',
                    '3. Add Tesseract to PATH (usually done automatically)'
                ]
            },
            'method2': {
                'title': 'Method 2: Manual Installation',
                'steps': [
                    '1. Download Tesseract from:',
                    '   https://github.com/UB-Mannheim/tesseract/wiki',
                    '2. Install the downloaded .exe file',
                    '3. Add installation directory to PATH:',
                    '   Usually: C:\\Program Files\\Tesseract-OCR',
                    '4. Restart your command prompt/PowerShell'
                ]
            }
        },
        'darwin': {  # macOS
            'method1': {
                'title': 'Using Homebrew (Recommended)',
                'steps': [
                    '1. Install Homebrew if not already installed:',
                    '2. Run: brew install tesseract',
                    '3. Tesseract will be available in PATH'
                ]
            },
            'method2': {
                'title': 'Using MacPorts',
                'steps': [
                    '1. Install MacPorts if not already installed',
                    '2. Run: sudo port install tesseract4',
                    '3. Add to PATH if needed'
                ]
            }
        },
        'linux': {
            'method1': {
                'title': 'Ubuntu/Debian',
                'steps': [
                    '1. sudo apt update',
                    '2. sudo apt install tesseract-ocr',
                    '3. sudo apt install libtesseract-dev  # Optional for development'
                ]
            },
            'method2': {
                'title': 'CentOS/RHEL/Fedora',
                'steps': [
                    '1. sudo yum install tesseract  # CentOS/RHEL',
                    '   OR',
                    '1. sudo dnf install tesseract  # Fedora',
                    '2. sudo yum install tesseract-devel  # Optional'
                ]
            }
        }
    }
    
    return instructions.get(system, {
        'method1': {
            'title': 'General Installation',
            'steps': [
                '1. Visit: https://tesseract-ocr.github.io/tessdoc/Installation.html',
                '2. Download for your operating system',
                '3. Follow platform-specific instructions'
            ]
        }
    })

def create_batch_file():
    """Create a Windows batch file for easy OCR setup"""
    if platform.system().lower() != 'windows':
        return False
    
    batch_content = '''@echo off
echo Installing Tesseract OCR for Screenshot Analysis
echo ================================================

echo Checking if Chocolatey is installed...
choco --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Chocolatey not found. Installing Chocolatey...
    echo Please run PowerShell as Administrator and execute:
    echo Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    pause
    exit /b 1
)

echo Installing Tesseract OCR...
choco install tesseract -y

echo.
echo Testing Tesseract installation...
tesseract --version
if %errorlevel% equ 0 (
    echo.
    echo ✅ Tesseract installed successfully!
    echo You can now run: python screenshot_reader.py
) else (
    echo.
    echo ❌ Tesseract installation failed or not in PATH
    echo Please check the installation and add Tesseract to your PATH
)

pause
'''
    
    try:
        with open('install_tesseract.bat', 'w', encoding='utf-8') as f:
            f.write(batch_content)
        return True
    except Exception as e:
        print(f"Error creating batch file: {e}")
        return False

def main():
    """Main setup function"""
    print("🔧 OCR Setup Helper for Screenshot Analysis")
    print("=" * 50)
    
    # Check current Tesseract status
    print("🔍 Checking Tesseract installation...")
    is_installed, message = check_tesseract_installation()
    
    if is_installed:
        print(f"✅ Tesseract is already installed!")
        print(f"📋 Version: {message}")
        print("\n🎉 You're ready to extract text from screenshots!")
        print("Run: python screenshot_reader.py")
        return
    
    print(f"❌ {message}")
    print("\n📋 Installation Instructions:")
    print("=" * 40)
    
    # Get platform-specific instructions
    instructions = get_installation_instructions()
    
    for method_name, method_info in instructions.items():
        print(f"\n{method_info['title']}:")
        for step in method_info['steps']:
            print(f"   {step}")
    
    # Create batch file for Windows
    if platform.system().lower() == 'windows':
        print(f"\n🪟 Windows Batch File:")
        if create_batch_file():
            print("   Created 'install_tesseract.bat' for easy installation")
            print("   Run this file as Administrator to install Tesseract")
        else:
            print("   Could not create batch file")
    
    print(f"\n🧪 After Installation:")
    print("   1. Restart your command prompt/PowerShell")
    print("   2. Run: tesseract --version (to verify installation)")
    print("   3. Run: python screenshot_reader.py (to analyze screenshots)")
    
    print(f"\n📚 Additional Resources:")
    print("   • Tesseract Documentation: https://tesseract-ocr.github.io/")
    print("   • Language Packs: https://github.com/tesseract-ocr/tessdata")

if __name__ == "__main__":
    main()
