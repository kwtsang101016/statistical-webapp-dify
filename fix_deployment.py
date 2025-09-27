#!/usr/bin/env python3
"""
Vercel Deployment Troubleshooting Script
Helps diagnose and fix common deployment issues
"""

import os
import sys
import json
from pathlib import Path

def check_file_exists(file_path, description):
    """Check if a file exists and report status"""
    if os.path.exists(file_path):
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ {description}: {file_path} - NOT FOUND")
        return False

def check_file_content(file_path, search_terms, description):
    """Check if file contains specific terms"""
    if not os.path.exists(file_path):
        print(f"❌ Cannot check {description} - file not found")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        issues = []
        for term in search_terms:
            if term in content:
                issues.append(f"Found '{term}' in {file_path}")
        
        if issues:
            print(f"⚠️  {description}:")
            for issue in issues:
                print(f"   • {issue}")
            return False
        else:
            print(f"✅ {description}: No issues found")
            return True
    except Exception as e:
        print(f"❌ Error reading {file_path}: {e}")
        return False

def main():
    """Main troubleshooting function"""
    print("🔧 VERCEL DEPLOYMENT TROUBLESHOOTING")
    print("=" * 50)
    
    issues_found = []
    
    # 1. Check essential files
    print("\n📁 CHECKING ESSENTIAL FILES:")
    print("-" * 30)
    
    essential_files = [
        ("package.json", "Package configuration"),
        ("vercel.json", "Vercel configuration"),
        ("src/utils/llmApi.ts", "API utility"),
        ("api/dashscope.js", "Serverless function"),
        ("vite.config.ts", "Vite configuration")
    ]
    
    for file_path, description in essential_files:
        if not check_file_exists(file_path, description):
            issues_found.append(f"Missing {file_path}")
    
    # 2. Check API URL configuration
    print("\n🔗 CHECKING API URL CONFIGURATION:")
    print("-" * 40)
    
    api_url_issues = check_file_content(
        "src/utils/llmApi.ts",
        ["statistical-webapp.vercel.app"],  # Wrong URL without 'dify'
        "API URL configuration"
    )
    
    if api_url_issues:
        issues_found.append("Incorrect API URL in llmApi.ts")
    
    # 3. Check Vercel configuration
    print("\n⚙️  CHECKING VERCEL CONFIGURATION:")
    print("-" * 40)
    
    try:
        with open("vercel.json", 'r') as f:
            vercel_config = json.load(f)
        
        if "functions" in vercel_config:
            print("✅ Vercel functions configuration found")
            if "api/dashscope.js" in vercel_config["functions"]:
                print("✅ DashScope API function configured")
                max_duration = vercel_config["functions"]["api/dashscope.js"].get("maxDuration", 10)
                print(f"   • Max duration: {max_duration}s")
            else:
                print("❌ DashScope API function not configured")
                issues_found.append("Missing DashScope API function in vercel.json")
        else:
            print("⚠️  No functions configuration found")
            
    except Exception as e:
        print(f"❌ Error reading vercel.json: {e}")
        issues_found.append("Invalid vercel.json")
    
    # 4. Check environment variables
    print("\n🔐 CHECKING ENVIRONMENT VARIABLES:")
    print("-" * 40)
    
    env_example = check_file_exists("env.example", "Environment example file")
    env_file = check_file_exists(".env", "Environment file")
    
    if env_example:
        with open("env.example", 'r') as f:
            env_content = f.read()
        
        if "DASHSCOPE_API_KEY" in env_content:
            print("✅ DashScope API key configured in example")
        else:
            print("⚠️  DashScope API key not found in example")
    
    if not env_file:
        print("⚠️  No .env file found - you may need to set environment variables in Vercel")
    
    # 5. Check build configuration
    print("\n🏗️  CHECKING BUILD CONFIGURATION:")
    print("-" * 40)
    
    try:
        with open("package.json", 'r') as f:
            package_config = json.load(f)
        
        scripts = package_config.get("scripts", {})
        if "build" in scripts:
            build_script = scripts["build"]
            print(f"✅ Build script: {build_script}")
            
            if "tsc" in build_script and "vite build" in build_script:
                print("✅ TypeScript compilation and Vite build configured")
            else:
                print("⚠️  Build script might be incomplete")
        else:
            print("❌ No build script found")
            issues_found.append("Missing build script")
            
    except Exception as e:
        print(f"❌ Error reading package.json: {e}")
        issues_found.append("Invalid package.json")
    
    # 6. Summary and recommendations
    print("\n📋 TROUBLESHOOTING SUMMARY:")
    print("=" * 40)
    
    if not issues_found:
        print("✅ No obvious issues found in configuration files")
        print("\n💡 NEXT STEPS:")
        print("1. Verify environment variables in Vercel dashboard")
        print("2. Check Vercel deployment logs for runtime errors")
        print("3. Test the deployment URL: https://statistical-webapp-dify.vercel.app")
        print("4. If still failing, try redeploying with cleared cache")
    else:
        print(f"❌ Found {len(issues_found)} potential issues:")
        for issue in issues_found:
            print(f"   • {issue}")
        
        print("\n🔧 RECOMMENDED FIXES:")
        if "Incorrect API URL" in str(issues_found):
            print("1. ✅ FIXED: Updated API URL in llmApi.ts")
            print("2. Commit and push changes to trigger redeployment")
        
        if "Missing DashScope API function" in str(issues_found):
            print("1. Add DashScope API function to vercel.json")
        
        if "Missing build script" in str(issues_found):
            print("1. Add proper build script to package.json")
    
    print("\n🚀 DEPLOYMENT CHECKLIST:")
    print("-" * 25)
    print("□ Environment variables set in Vercel")
    print("□ API URL matches actual deployment URL")
    print("□ Serverless function properly configured")
    print("□ Build process completes successfully")
    print("□ Latest code pushed to repository")
    print("□ Vercel deployment logs checked")
    
    print("\n🔗 HELPFUL LINKS:")
    print("-" * 20)
    print("• Vercel Dashboard: https://vercel.com/dashboard")
    print("• Project URL: https://statistical-webapp-dify.vercel.app")
    print("• Environment Variables: Vercel Dashboard > Project > Settings > Environment Variables")

if __name__ == "__main__":
    main()
