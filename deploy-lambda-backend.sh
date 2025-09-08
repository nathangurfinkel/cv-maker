#!/bin/bash

# CV Maker Lambda Backend Deployment Script
echo "🚀 Starting CV Maker Lambda Backend Deployment..."

# Configuration
FUNCTION_NAME="CVGeneratorFunction"
ROLE_NAME="CVGeneratorLambdaRole"
API_NAME="CV Generator API"
REGION="us-east-1"

# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS Account ID: $ACCOUNT_ID"

# Step 1: Create IAM Role for Lambda
echo "📋 Step 1: Creating IAM Role for Lambda..."

# Create trust policy
cat > lambda-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "lambda.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create the IAM role (ignore if already exists)
aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document file://lambda-trust-policy.json \
  2>/dev/null || echo "Role already exists, continuing..."

# Attach basic execution policy
aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
echo "✅ IAM Role ARN: $ROLE_ARN"

# Step 2: Package Python Code
echo "📦 Step 2: Packaging Python code for Lambda..."

# Create deployment directory
mkdir -p lambda_deployment
cd lambda_deployment

# Copy your backend code
cp -r ../cv-app-ng-backend/* .

# Copy Lambda handler
cp ../lambda_handler.py .

# Install dependencies
pip install -r ../lambda_requirements.txt -t .

# Create deployment package
zip -r ../lambda-deployment.zip . -x "*.pyc" "__pycache__/*" "*.git*" "tests/*" "*.md"

cd ..
echo "✅ Lambda package created: lambda-deployment.zip"

# Step 3: Create Lambda Function
echo "🔧 Step 3: Creating Lambda Function..."

# Delete function if it exists
aws lambda delete-function --function-name $FUNCTION_NAME 2>/dev/null || echo "Function doesn't exist, creating new one..."

# Create the Lambda function
aws lambda create-function \
  --function-name $FUNCTION_NAME \
  --runtime python3.11 \
  --role $ROLE_ARN \
  --handler lambda_handler.handler \
  --zip-file fileb://lambda-deployment.zip \
  --region $REGION \
  --timeout 30 \
  --memory-size 1024 \
  --environment Variables='{
    "ENVIRONMENT":"production",
    "DEBUG":"false",
    "VERBOSE":"false"
  }'

echo "✅ Lambda function created: $FUNCTION_NAME"

# Step 4: Create API Gateway
echo "🌐 Step 4: Creating API Gateway..."

# Create the HTTP API
API_ID=$(aws apigatewayv2 create-api \
  --name "$API_NAME" \
  --protocol-type HTTP \
  --query 'ApiId' --output text)

echo "✅ API Gateway created with ID: $API_ID"

# Step 5: Connect API Gateway to Lambda
echo "🔗 Step 5: Connecting API Gateway to Lambda..."

# Get Lambda Function ARN
LAMBDA_ARN=$(aws lambda get-function \
  --function-name $FUNCTION_NAME \
  --query 'Configuration.FunctionArn' --output text)

# Create the integration
INTEGRATION_ID=$(aws apigatewayv2 create-integration \
  --api-id $API_ID \
  --integration-type AWS_PROXY \
  --integration-uri $LAMBDA_ARN \
  --payload-format-version 2.0 \
  --query 'IntegrationId' --output text)

echo "✅ Integration created with ID: $INTEGRATION_ID"

# Step 6: Create Routes
echo "🛣️ Step 6: Creating API Routes..."

# Create catch-all route for FastAPI
aws apigatewayv2 create-route \
  --api-id $API_ID \
  --route-key 'ANY /{proxy+}' \
  --target integrations/$INTEGRATION_ID

# Create root route
aws apigatewayv2 create-route \
  --api-id $API_ID \
  --route-key 'ANY /' \
  --target integrations/$INTEGRATION_ID

echo "✅ Routes created"

# Step 7: Grant API Gateway Permission
echo "🔐 Step 7: Granting API Gateway permission to invoke Lambda..."

aws lambda add-permission \
  --function-name $FUNCTION_NAME \
  --statement-id "ApiGatewayInvokePermission" \
  --action "lambda:InvokeFunction" \
  --principal "apigateway.amazonaws.com" \
  --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*"

echo "✅ Permissions granted"

# Step 8: Deploy the API
echo "🚀 Step 8: Deploying API Gateway..."

STAGE_NAME="prod"
aws apigatewayv2 create-stage \
  --api-id $API_ID \
  --stage-name $STAGE_NAME \
  --auto-deploy

echo "✅ API deployed to stage: $STAGE_NAME"

# Get the API URL
API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE_NAME"
echo ""
echo "🎉 Deployment Complete!"
echo "================================"
echo "API URL: $API_URL"
echo "Function Name: $FUNCTION_NAME"
echo "API ID: $API_ID"
echo ""
echo "📋 Next Steps:"
echo "1. Test your API: curl $API_URL/health"
echo "2. Update your frontend environment variable:"
echo "   VITE_API_BASE_URL = $API_URL"
echo "3. Go to AWS Amplify Console and add this environment variable"
echo "4. Your frontend will automatically rebuild"
echo ""
echo "🔍 To monitor logs:"
echo "aws logs tail /aws/lambda/$FUNCTION_NAME --follow"

# Clean up
rm -rf lambda_deployment
rm -f lambda-trust-policy.json
rm -f lambda-deployment.zip
