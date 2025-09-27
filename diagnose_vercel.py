#!/usr/bin/env python3
"""
Comprehensive Vercel Deployment Diagnosis
Checks multiple potential issues causing connection timeouts
"""

import os
import sys
import json
import requests
import time
from pathlib import Path

def check_vercel_status():
    """Check Vercel service status"""
    try:
        response = requests.get("https://vercel-status.com/api/v2/status.json", timeout=10)
        if response.status_code == 200:
            data = response.json()
            status = data.get("status", {}).get("indicator", "unknown")
            print(f"✅ Vercel Status: {status}")
            return status == "none"  # "none" means no issues
        else:
            print(f"⚠️  Could not check Vercel status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error checking Vercel status: {e}")
        return False

def test_domain_resolution():
    """Test if the domain resolves correctly"""
    import socket
    
    domain = "statistical-webapp-dify.vercel.app"
    try:
        ip = socket.gethostbyname(domain)
        print(f"✅ Domain resolves to: {ip}")
        return True
    except socket.gaierror as e:
        print(f"❌ Domain resolution failed: {e}")
        return False

def check_api_function():
    """Test the API function directly"""
    api_url = "https://statistical-webapp-dify.vercel.app/api/dashscope"
    
    print(f"\n🧪 Testing API Function: {api_url}")
    print("-" * 50)
    
    try:
        # Test with OPTIONS request first (CORS preflight)
        print("1. Testing OPTIONS request...")
        response = requests.options(api_url, timeout=10)
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        # Test with POST request
        print("\n2. Testing POST request...")
        test_payload = {
            "model": "qwen-turbo",
            "input": {
                "messages": [{"role": "user", "content": "test"}]
            },
            "parameters": {"temperature": 0.7}
        }
        
        response = requests.post(
            api_url, 
            json=test_payload, 
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"   Status: {response.status_code}")
        if response.status_code != 200:
            print(f"   Response: {response.text[:200]}...")
        
        return response.status_code == 200
        
    except requests.exceptions.Timeout:
        print("   ❌ Request timed out")
        return False
    except requests.exceptions.ConnectionError as e:
        print(f"   ❌ Connection error: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def check_main_site():
    """Test the main site"""
    main_url = "https://statistical-webapp-dify.vercel.app"
    
    print(f"\n🌐 Testing Main Site: {main_url}")
    print("-" * 50)
    
    try:
        response = requests.get(main_url, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('Content-Type', 'Unknown')}")
        print(f"Content-Length: {len(response.content)} bytes")
        
        if response.status_code == 200:
            print("✅ Main site loads successfully")
            return True
        else:
            print(f"❌ Main site returned status {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Main site request timed out")
        return False
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Main site connection error: {e}")
        return False
    except Exception as e:
        print(f"❌ Main site error: {e}")
        return False

def check_environment_variables():
    """Check if environment variables are properly configured"""
    print(f"\n🔐 Environment Variables Check")
    print("-" * 40)
    
    # Check if .env file exists locally
    env_file = Path(".env")
    if env_file.exists():
        print("✅ Local .env file exists")
        try:
            with open(env_file, 'r') as f:
                content = f.read()
                if "DASHSCOPE_API_KEY" in content:
                    print("✅ DASHSCOPE_API_KEY found in local .env")
                else:
                    print("⚠️  DASHSCOPE_API_KEY not found in local .env")
        except Exception as e:
            print(f"❌ Error reading .env file: {e}")
    else:
        print("⚠️  No local .env file found")
    
    print("\n💡 IMPORTANT: Check Vercel Dashboard for environment variables:")
    print("   • Go to: https://vercel.com/dashboard")
    print("   • Select your project: statistical-webapp-dify")
    print("   • Go to Settings → Environment Variables")
    print("   • Ensure DASHSCOPE_API_KEY is set")

def check_build_output():
    """Check if the build output is correct"""
    print(f"\n🏗️  Build Output Check")
    print("-" * 30)
    
    dist_dir = Path("dist")
    if dist_dir.exists():
        print("✅ Build output directory exists")
        
        index_file = dist_dir / "index.html"
        if index_file.exists():
            print("✅ index.html exists in build output")
            with open(index_file, 'r') as f:
                content = f.read()
                if "statistical-webapp-dify.vercel.app" in content:
                    print("✅ Correct API URL found in build")
                else:
                    print("⚠️  API URL not found or incorrect in build")
        else:
            print("❌ index.html missing from build output")
    else:
        print("❌ Build output directory missing - run 'npm run build'")

def suggest_solutions():
    """Suggest potential solutions based on findings"""
    print(f"\n🔧 POTENTIAL SOLUTIONS")
    print("=" * 40)
    
    print("1. **Environment Variables Issue**")
    print("   • Most likely cause: Missing DASHSCOPE_API_KEY in Vercel")
    print("   • Solution: Set environment variable in Vercel Dashboard")
    print("   • Steps:")
    print("     - Go to Vercel Dashboard → Project → Settings")
    print("     - Add: DASHSCOPE_API_KEY = your-api-key")
    print("     - Redeploy the project")
    
    print("\n2. **Domain/DNS Issues**")
    print("   • Possible cause: DNS propagation or domain configuration")
    print("   • Solution: Wait 10-15 minutes for DNS propagation")
    print("   • Alternative: Try accessing via different network")
    
    print("\n3. **Vercel Service Issues**")
    print("   • Check: https://vercel-status.com")
    print("   • If service is down, wait for Vercel to resolve")
    
    print("\n4. **Function Configuration**")
    print("   • Check: Vercel Dashboard → Functions")
    print("   • Ensure api/dashscope.js is properly deployed")
    print("   • Check function logs for errors")
    
    print("\n5. **Regional Issues**")
    print("   • Try accessing from different location/network")
    print("   • Use VPN if necessary")

def main():
    """Main diagnostic function"""
    print("🔍 COMPREHENSIVE VERCEL DEPLOYMENT DIAGNOSIS")
    print("=" * 60)
    
    # Run all diagnostic checks
    checks = [
        ("Vercel Service Status", check_vercel_status),
        ("Domain Resolution", test_domain_resolution),
        ("Main Site Access", check_main_site),
        ("API Function", check_api_function),
        ("Environment Variables", check_environment_variables),
        ("Build Output", check_build_output)
    ]
    
    results = {}
    for name, check_func in checks:
        try:
            results[name] = check_func()
        except Exception as e:
            print(f"❌ {name} check failed: {e}")
            results[name] = False
    
    # Summary
    print(f"\n📊 DIAGNOSIS SUMMARY")
    print("=" * 30)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    print(f"Checks passed: {passed}/{total}")
    
    for name, result in results.items():
        status = "✅" if result else "❌"
        print(f"{status} {name}")
    
    if passed < total:
        suggest_solutions()
    else:
        print("\n✅ All checks passed! The issue might be temporary.")
        print("Try accessing the site again in a few minutes.")

if __name__ == "__main__":
    main()
