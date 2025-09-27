#!/usr/bin/env python3
"""
Simple deployment test to check what's happening
"""

import requests
import time

def test_with_retries():
    """Test the deployment with retries and different methods"""
    url = "https://statistical-webapp-dify.vercel.app"
    
    print(f"🧪 Testing: {url}")
    print("=" * 50)
    
    # Test 1: Basic GET request
    print("1. Basic GET request...")
    try:
        response = requests.get(url, timeout=15)
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('Content-Type')}")
        print(f"   Content-Length: {len(response.content)}")
        
        if response.status_code == 200:
            print("   ✅ Success!")
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            
    except requests.exceptions.Timeout:
        print("   ❌ Request timed out after 15 seconds")
    except requests.exceptions.ConnectionError as e:
        print(f"   ❌ Connection error: {e}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: Try with different user agent
    print("\n2. Request with different user agent...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Success with different user agent!")
            return True
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Check if it's a DNS issue
    print("\n3. Testing with IP directly...")
    try:
        import socket
        ip = socket.gethostbyname("statistical-webapp-dify.vercel.app")
        print(f"   IP: {ip}")
        
        # Try accessing via IP with Host header
        ip_url = f"https://{ip}"
        headers = {'Host': 'statistical-webapp-dify.vercel.app'}
        
        response = requests.get(ip_url, headers=headers, timeout=15, verify=False)
        print(f"   Status via IP: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Success via IP!")
            return True
    except Exception as e:
        print(f"   ❌ IP test failed: {e}")
    
    return False

def main():
    print("🔍 DEPLOYMENT TEST")
    print("=" * 30)
    
    success = test_with_retries()
    
    if not success:
        print("\n❌ All tests failed")
        print("\n🔧 NEXT STEPS:")
        print("1. Check Vercel Dashboard for deployment status")
        print("2. Verify environment variables are set")
        print("3. Check function logs in Vercel")
        print("4. Try redeploying with cleared cache")
        print("5. Contact Vercel support if issue persists")
    else:
        print("\n✅ Deployment is working!")

if __name__ == "__main__":
    main()
