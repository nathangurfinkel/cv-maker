#!/bin/bash

# CV Maker Log Monitoring Script
echo "📊 CV Maker Log Monitoring"

# Get your Amplify app ID
echo "🔍 Finding your Amplify app..."
APP_ID=$(aws amplify list-apps --query 'apps[0].appId' --output text 2>/dev/null)

if [ "$APP_ID" = "None" ] || [ -z "$APP_ID" ]; then
    echo "❌ No Amplify apps found. Make sure you have deployed an app."
    exit 1
fi

echo "✅ Found Amplify app: $APP_ID"

# Get app details
echo "📋 App details:"
aws amplify get-app --app-id "$APP_ID" --query 'app.{Name:name,DefaultDomain:defaultDomain,Repository:repository}' --output table

echo ""
echo "🔍 To monitor logs:"
echo ""
echo "1. Build Logs:"
echo "   - Go to: https://console.aws.amazon.com/amplify/home?region=us-east-1#/$APP_ID"
echo "   - Click 'Build history' tab"
echo ""
echo "2. Runtime Logs (Lambda):"
echo "   - Go to: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups"
echo "   - Look for: /aws/lambda/amplify-$APP_ID-*"
echo ""
echo "3. Real-time log monitoring:"
echo "   aws logs tail /aws/lambda/amplify-$APP_ID-cvmakerapi --follow"
echo ""
echo "4. Check environment variables:"
echo "   aws amplify get-app --app-id $APP_ID --query 'app.environmentVariables'"
