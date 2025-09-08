#!/bin/bash

# CV Maker API Test Script
echo "🧪 Testing CV Maker API..."

# Get API URL from environment or prompt user
if [ -z "$API_URL" ]; then
    echo "Please enter your API URL (e.g., https://abc123.execute-api.us-east-1.amazonaws.com/prod):"
    read API_URL
fi

echo "Testing API at: $API_URL"
echo ""

# Test 1: Health Check
echo "1. Testing health endpoint..."
curl -s -w "\nHTTP Status: %{http_code}\n" "$API_URL/health" || echo "❌ Health check failed"
echo ""

# Test 2: Root endpoint
echo "2. Testing root endpoint..."
curl -s -w "\nHTTP Status: %{http_code}\n" "$API_URL/" || echo "❌ Root endpoint failed"
echo ""

# Test 3: API docs
echo "3. Testing API documentation..."
curl -s -w "\nHTTP Status: %{http_code}\n" "$API_URL/docs" || echo "❌ API docs failed"
echo ""

# Test 4: CORS preflight
echo "4. Testing CORS preflight..."
curl -s -X OPTIONS -H "Origin: https://your-frontend-domain.com" -H "Access-Control-Request-Method: POST" -w "\nHTTP Status: %{http_code}\n" "$API_URL/cv/tailor" || echo "❌ CORS test failed"
echo ""

echo "✅ API testing complete!"
echo ""
echo "If all tests pass, your API is ready!"
echo "Next step: Update your frontend environment variable:"
echo "VITE_API_BASE_URL = $API_URL"
