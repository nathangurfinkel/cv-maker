#!/bin/bash

# CV Maker Backend Deployment Script
echo "🚀 Starting CV Maker Backend Deployment..."

# Check if required environment variables are set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY is not set. Please set it first:"
    echo "   export OPENAI_API_KEY='your-openai-key-here'"
    exit 1
fi

if [ -z "$PINECONE_API_KEY" ]; then
    echo "❌ PINECONE_API_KEY is not set. Please set it first:"
    echo "   export PINECONE_API_KEY='your-pinecone-key-here'"
    exit 1
fi

echo "✅ Environment variables are set"

# Deploy the Amplify backend
echo "📦 Deploying Amplify backend..."
npx ampx sandbox

echo "🎉 Backend deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the API endpoint URL from the deployment output"
echo "2. Go to AWS Amplify Console"
echo "3. Add environment variable: VITE_API_BASE_URL = [your-api-endpoint]"
echo "4. The frontend will automatically rebuild"
echo ""
echo "🔍 To monitor logs:"
echo "- Build logs: AWS Amplify Console → Build history"
echo "- Runtime logs: AWS CloudWatch → Log groups"
