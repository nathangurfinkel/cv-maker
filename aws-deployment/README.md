# CV Maker AWS Deployment

This directory contains all the necessary files and scripts to deploy the CV Maker application to AWS.

## Architecture Overview

The application is deployed using the following AWS services:

- **Frontend**: AWS Amplify (React + Vite)
- **Backend**: AWS ECS Fargate (FastAPI)
- **Load Balancer**: Application Load Balancer with SSL termination
- **Container Registry**: Amazon ECR
- **Secrets Management**: AWS Secrets Manager
- **File Storage**: Amazon S3
- **Networking**: VPC with public/private subnets
- **DNS**: Route 53
- **SSL**: AWS Certificate Manager

## Prerequisites

1. **AWS CLI** installed and configured
2. **Docker** installed
3. **Terraform** installed (>= 1.0)
4. **Node.js** and **npm** installed
5. **AWS Account** with appropriate permissions

## Quick Start

### 1. Configure AWS Credentials

```bash
aws configure
```

### 2. Set Up Secrets

```bash
./scripts/deploy.sh --setup-secrets
```

This will prompt you to enter your OpenAI and Pinecone API keys.

### 3. Configure Domain (Optional)

If you have a custom domain:

1. Copy `terraform/terraform.tfvars.example` to `terraform/terraform.tfvars`
2. Update the domain name and Route53 zone ID
3. Update the CORS origins in `cv-app-ng-backend/app/core/config.py`

### 4. Deploy Infrastructure

```bash
./scripts/deploy.sh --infrastructure-only
```

### 5. Deploy Application

```bash
./scripts/deploy.sh
```

## Manual Deployment Steps

### Backend Deployment

1. **Build and push Docker image**:
   ```bash
   cd cv-app-ng-backend
   docker build -t cv-maker-backend .
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
   docker tag cv-maker-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cv-maker-app:latest
   docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cv-maker-app:latest
   ```

2. **Update ECS service**:
   ```bash
   aws ecs update-service --cluster cv-maker-cluster --service cv-maker-service --force-new-deployment
   ```

### Frontend Deployment

1. **Install Amplify CLI**:
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Initialize Amplify**:
   ```bash
   cd cv-app-frontend
   amplify init
   amplify add hosting
   amplify publish
   ```

## Environment Variables

### Backend Environment Variables

The backend uses the following environment variables:

- `ENVIRONMENT`: Set to "production" for production deployment
- `DEBUG`: Set to "false" for production
- `VERBOSE`: Set to "false" for production
- `OPENAI_API_KEY`: Retrieved from AWS Secrets Manager
- `PINECONE_API_KEY`: Retrieved from AWS Secrets Manager
- `AWS_DEFAULT_REGION`: AWS region
- `S3_BUCKET_NAME`: S3 bucket for file storage

### Frontend Environment Variables

The frontend uses the following environment variables:

- `VITE_API_BASE_URL`: Backend API URL (e.g., https://your-domain.com)
- `VITE_ENVIRONMENT`: Set to "production"

## Monitoring and Logs

### CloudWatch Logs

Backend logs are available in CloudWatch under the log group `/ecs/cv-maker-app`.

### ECS Service Monitoring

Monitor your ECS service in the AWS Console:
- ECS → Clusters → cv-maker-cluster → Services → cv-maker-service

### Application Load Balancer

Monitor ALB metrics and health checks in the AWS Console:
- EC2 → Load Balancers → cv-maker-alb

## Scaling

### Horizontal Scaling

To scale the application horizontally:

1. Update the `app_count` variable in `terraform/variables.tf`
2. Run `terraform apply`

### Vertical Scaling

To scale the application vertically:

1. Update the `fargate_cpu` and `fargate_memory` variables
2. Update the ECS task definition
3. Run `terraform apply`

## Security

### Network Security

- Backend runs in private subnets
- Only the ALB is exposed to the internet
- Security groups restrict traffic appropriately

### Secrets Management

- API keys are stored in AWS Secrets Manager
- ECS tasks retrieve secrets at runtime
- No secrets are stored in code or configuration files

### SSL/TLS

- SSL certificates are managed by AWS Certificate Manager
- HTTPS is enforced with automatic HTTP to HTTPS redirect

## Troubleshooting

### Common Issues

1. **ECS tasks failing to start**:
   - Check CloudWatch logs
   - Verify secrets are properly configured
   - Check security group rules

2. **Frontend not connecting to backend**:
   - Verify CORS configuration
   - Check API_BASE_URL environment variable
   - Verify ALB health checks

3. **SSL certificate issues**:
   - Ensure domain is properly configured in Route53
   - Check certificate validation status

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster cv-maker-cluster --services cv-maker-service

# View CloudWatch logs
aws logs tail /ecs/cv-maker-app --follow

# Check ALB health
aws elbv2 describe-target-health --target-group-arn YOUR_TARGET_GROUP_ARN
```

## Cost Optimization

### Recommendations

1. **Use Spot Instances**: Consider using ECS with Spot capacity for non-critical workloads
2. **Right-size Resources**: Monitor CPU and memory usage and adjust accordingly
3. **S3 Lifecycle Policies**: Set up lifecycle policies for S3 storage
4. **CloudWatch Log Retention**: Set appropriate log retention periods

## Cleanup

To remove all AWS resources:

```bash
cd terraform
terraform destroy
```

**Warning**: This will permanently delete all resources and data.

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review AWS CloudWatch logs
3. Check the GitHub Actions workflow logs
4. Open an issue in the repository
