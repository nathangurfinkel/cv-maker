# AWS Amplify Troubleshooting Guide

## 🚨 Current Issue: Spinner Keeps Spinning

**Root Cause:** Frontend is trying to call `http://localhost:8000` because:
1. No backend API is deployed
2. No environment variables are configured
3. `VITE_API_BASE_URL` is undefined

## 📊 Monitoring Logs in AWS Amplify

### 1. Build Logs
- Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
- Select your app
- Click **"Build history"** tab
- Click on any build to see detailed logs

### 2. Runtime Logs (Lambda Functions)
- Go to [AWS CloudWatch Console](https://console.aws.amazon.com/cloudwatch/)
- Click **"Logs"** → **"Log groups"**
- Look for: `/aws/lambda/amplify-[app-name]-[env]-[function-name]`

### 3. Real-time Log Monitoring
```bash
# Set your region first
aws configure set region us-east-1

# List your Amplify apps
aws amplify list-apps

# Get build logs
aws amplify get-app --app-id YOUR_APP_ID

# Monitor CloudWatch logs
aws logs tail /aws/lambda/your-function-name --follow
```

## 🔧 Configuring Environment Variables

### Method 1: Amplify Console (Recommended)
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app
3. Go to **"App settings"** → **"Environment variables"**
4. Click **"Manage variables"**
5. Add:
   ```
   VITE_API_BASE_URL = https://your-api-domain.com
   VITE_ENVIRONMENT = production
   ```

### Method 2: Using AWS CLI
```bash
# Add environment variable
aws amplify update-app --app-id YOUR_APP_ID --environment-variables VITE_API_BASE_URL=https://your-api-domain.com
```

## 🚀 Complete Solution: Deploy Full-Stack

### Step 1: Deploy Backend (Lambda + API Gateway)
```bash
# Deploy the Amplify backend
npx ampx sandbox

# Or if using Amplify CLI v1
amplify push
```

### Step 2: Get API Endpoint
After deployment, you'll get an API endpoint like:
```
https://abc123def4.execute-api.us-east-1.amazonaws.com/prod
```

### Step 3: Configure Frontend Environment Variables
In Amplify Console, add:
```
VITE_API_BASE_URL = https://abc123def4.execute-api.us-east-1.amazonaws.com/prod
```

### Step 4: Redeploy Frontend
The frontend will automatically rebuild with the new environment variables.

## 🔍 Debugging Steps

### 1. Check Current Environment Variables
```bash
# In your frontend build logs, look for:
echo "VITE_API_BASE_URL: $VITE_API_BASE_URL"
```

### 2. Test API Endpoint
```bash
# Test if your API is working
curl -X GET https://your-api-endpoint.com/health
```

### 3. Check Network Tab
- Open browser DevTools
- Go to Network tab
- Look for failed API calls
- Check the actual URL being called

## 🛠️ Alternative: Quick Fix for Testing

If you want to test quickly, you can temporarily hardcode the API URL:

```typescript
// In cv-app-ng-frontend/src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-actual-api-endpoint.com';
```

## 📋 Environment Variables Checklist

### Frontend Variables (VITE_*)
- `VITE_API_BASE_URL` - Your API endpoint
- `VITE_ENVIRONMENT` - production/development

### Backend Variables (Lambda)
- `OPENAI_API_KEY` - Your OpenAI API key
- `PINECONE_API_KEY` - Your Pinecone API key
- `ENVIRONMENT` - production
- `DEBUG` - false

## 🎯 Next Steps

1. **Deploy backend**: `npx ampx sandbox`
2. **Get API endpoint** from deployment output
3. **Set environment variables** in Amplify Console
4. **Redeploy frontend** (automatic)
5. **Test the application**

## 📞 Need Help?

If you're still having issues:
1. Check the build logs in Amplify Console
2. Check CloudWatch logs for Lambda errors
3. Verify environment variables are set correctly
4. Test API endpoint directly with curl
