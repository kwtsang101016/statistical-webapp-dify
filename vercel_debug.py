#!/usr/bin/env python3
"""
Debug Vercel deployment issues
"""

import requests
import socket
import ssl
import time
from urllib.parse import urlparse

def test_connection(hostname, port=443):
    """Test basic TCP connection"""
    try:
        sock = socket.create_connection((hostname, port), timeout=10)
        sock.close()
        return True
    except Exception as e:
        print(f"❌ TCP connection failed: {e}")
        return False

def test_ssl_handshake(hostname):
    """Test SSL handshake"""
    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                print(f"✅ SSL handshake successful")
                print(f"   Subject: {cert.get('subject', 'Unknown')}")
                print(f"   Issuer: {cert.get('issuer', 'Unknown')}")
                return True
    except Exception as e:
        print(f"❌ SSL handshake failed: {e}")
        return False

def test_http_request(url):
    """Test HTTP request with different methods"""
    print(f"\n🧪 Testing HTTP request to: {url}")
    
    # Parse URL
    parsed = urlparse(url)
    hostname = parsed.hostname
    
    print(f"Hostname: {hostname}")
    print(f"Port: {parsed.port or (443 if parsed.scheme == 'https' else 80)}")
    
    # Test 1: Basic TCP connection
    print("\n1. Testing TCP connection...")
    if not test_connection(hostname, parsed.port or 443):
        return False
    
    # Test 2: SSL handshake
    print("\n2. Testing SSL handshake...")
    if not test_ssl_handshake(hostname):
        return False
    
    # Test 3: HTTP request
    print("\n3. Testing HTTP request...")
    try:
        response = requests.get(url, timeout=15, verify=True)
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(list(response.headers.items())[:5])}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError as e:
        print(f"   ❌ Connection error: {e}")
        return False
    except requests.exceptions.Timeout:
        print(f"   ❌ Request timeout")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def check_dns_resolution(hostname):
    """Check DNS resolution"""
    try:
        ip = socket.gethostbyname(hostname)
        print(f"✅ DNS resolution: {hostname} → {ip}")
        return True
    except socket.gaierror as e:
        print(f"❌ DNS resolution failed: {e}")
        return False

def main():
    url = "https://statistical-webapp-dify-bhvo73pl9-kwtsangs-projects.vercel.app"
    
    print("🔍 VERCEL DEPLOYMENT DEBUG")
    print("=" * 50)
    
    # Parse hostname
    parsed = urlparse(url)
    hostname = parsed.hostname
    
    # Test 1: DNS resolution
    print("1. DNS Resolution Test")
    print("-" * 30)
    if not check_dns_resolution(hostname):
        print("❌ DNS resolution failed - this is the root cause")
        return
    
    # Test 2: Connection tests
    print("\n2. Connection Tests")
    print("-" * 30)
    success = test_http_request(url)
    
    if not success:
        print("\n❌ Connection tests failed")
        print("\n🔧 POTENTIAL SOLUTIONS:")
        print("1. **Check Vercel Dashboard** - Is the deployment actually running?")
        print("2. **Verify Build Success** - Did the build complete without errors?")
        print("3. **Check Environment Variables** - Are they properly set?")
        print("4. **Try Different Network** - Test from mobile hotspot or different WiFi")
        print("5. **Check Vercel Status** - https://vercel-status.com")
        print("6. **Wait Longer** - Sometimes deployments take 10-15 minutes")
    else:
        print("\n✅ Connection successful!")

if __name__ == "__main__":
    main()
