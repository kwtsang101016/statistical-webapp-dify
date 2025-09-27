@echo off
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
