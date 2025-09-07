# 🚀 CV Maker - AWS Amplify Console Deployment

Since we're having some complexity with the CLI approach, let's use the **AWS Amplify Console** which is much easier and more reliable!

## 📋 **Step-by-Step Instructions**

### **Step 1: Go to AWS Amplify Console**
1. Open your browser and go to: **https://console.aws.amazon.com/amplify**
2. Make sure you're in the **us-east-1** region (top right corner)

### **Step 2: Create New App**
1. Click **"New app"** button
2. Select **"Host web app"**

### **Step 3: Connect Repository**
1. Choose **"GitHub"** as your source
2. **Authorize** GitHub if prompted
3. Select your **cv-maker** repository
4. Choose the **main** branch

### **Step 4: Configure Build Settings**
The console will auto-detect your React app, but let's make sure it's configured correctly:

**Build specification:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd cv-app-frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: cv-app-frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - cv-app-frontend/node_modules/**/*
```

### **Step 5: Environment Variables**
Add these environment variables in the Amplify console:
- `VITE_API_BASE_URL`: `https://your-api-gateway-url.amazonaws.com/prod` (we'll get this later)
- `VITE_ENVIRONMENT`: `production`

### **Step 6: Deploy**
1. Click **"Save and deploy"**
2. Wait for the build to complete (5-10 minutes)

## 🎯 **What This Will Give You**

✅ **Frontend URL**: Your React app will be live at `https://main.d1234567890.amplifyapp.com`  
✅ **Automatic SSL**: HTTPS enabled by default  
✅ **Global CDN**: Fast loading worldwide  
✅ **Auto-deployments**: Every push to main branch triggers a new deployment  

## 🔧 **Next Steps After Frontend Deployment**

Once your frontend is deployed, we'll need to:

1. **Deploy the backend** (FastAPI) as a Lambda function
2. **Get the API Gateway URL**
3. **Update the frontend environment variables**
4. **Test the full application**

## 🚨 **If You Get Stuck**

**Alternative: Use the existing amplify.yml**
The project already has an `amplify.yml` file that should work automatically. Just:
1. Go to Amplify Console
2. Connect your GitHub repo
3. The build settings should be auto-detected
4. Deploy!

## 📞 **Need Help?**

If you run into any issues:
1. Check the build logs in the Amplify Console
2. Make sure your GitHub repo is public (or you've granted access)
3. Verify the build commands are correct

**Ready to deploy?** Go to https://console.aws.amazon.com/amplify and let's get your CV maker live! 🚀
