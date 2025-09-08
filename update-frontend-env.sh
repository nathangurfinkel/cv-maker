#!/bin/bash

# Update Frontend Environment Variables Script
echo "🔧 Updating Frontend Environment Variables..."

# Get API URL from user
if [ -z "$API_URL" ]; then
    echo "Please enter your API URL (e.g., https://abc123.execute-api.us-east-1.amazonaws.com/prod):"
    read API_URL
fi

echo "Setting VITE_API_BASE_URL to: $API_URL"
echo ""

# Method 1: Update Amplify Console (Manual)
echo "📋 Method 1: Update AWS Amplify Console (Recommended)"
echo "1. Go to: https://console.aws.amazon.com/amplify/"
echo "2. Select your app"
echo "3. Go to 'App settings' → 'Environment variables'"
echo "4. Add/Update: VITE_API_BASE_URL = $API_URL"
echo "5. Save changes (frontend will auto-rebuild)"
echo ""

# Method 2: Update via AWS CLI (if you have the app ID)
echo "📋 Method 2: Update via AWS CLI"
echo "First, get your app ID:"
echo "aws amplify list-apps --query 'apps[0].appId' --output text"
echo ""
echo "Then update environment variables:"
echo "aws amplify update-app --app-id YOUR_APP_ID --environment-variables VITE_API_BASE_URL=$API_URL"
echo ""

# Method 3: Update local .env file (for development)
echo "📋 Method 3: Update local .env file (for development)"
ENV_FILE="cv-app-ng-frontend/.env"
if [ -f "$ENV_FILE" ]; then
    # Update existing .env file
    if grep -q "VITE_API_BASE_URL" "$ENV_FILE"; then
        sed -i.bak "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=$API_URL|" "$ENV_FILE"
        echo "✅ Updated $ENV_FILE"
    else
        echo "VITE_API_BASE_URL=$API_URL" >> "$ENV_FILE"
        echo "✅ Added to $ENV_FILE"
    fi
else
    # Create new .env file
    echo "VITE_API_BASE_URL=$API_URL" > "$ENV_FILE"
    echo "✅ Created $ENV_FILE"
fi

echo ""
echo "🎉 Environment variable update complete!"
echo ""
echo "📋 Next Steps:"
echo "1. If using Amplify Console: The frontend will automatically rebuild"
echo "2. If using local development: Restart your dev server"
echo "3. Test your application - the spinner should stop spinning!"
echo ""
echo "🔍 To verify the change:"
echo "1. Check your app in the browser"
echo "2. Open DevTools → Network tab"
echo "3. Look for API calls to: $API_URL"
