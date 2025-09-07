#!/bin/bash

# CV Maker AWS Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="cv-maker"
AWS_REGION="us-east-1"
ECR_REPOSITORY=""
S3_BUCKET=""

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Terraform is installed
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    log_success "All prerequisites met!"
}

# Deploy infrastructure
deploy_infrastructure() {
    log_info "Deploying AWS infrastructure with Terraform..."
    
    cd terraform
    
    # Initialize Terraform
    terraform init
    
    # Plan deployment
    terraform plan -out=tfplan
    
    # Apply deployment
    terraform apply tfplan
    
    # Get outputs
    ECR_REPOSITORY=$(terraform output -raw ecr_repository_url)
    S3_BUCKET=$(terraform output -raw s3_bucket_name)
    
    log_success "Infrastructure deployed successfully!"
    log_info "ECR Repository: $ECR_REPOSITORY"
    log_info "S3 Bucket: $S3_BUCKET"
    
    cd ..
}

# Build and push Docker image
build_and_push_image() {
    log_info "Building and pushing Docker image..."
    
    # Get ECR login token
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY
    
    # Build image
    docker build -t $PROJECT_NAME-backend ../cv-app-ng-backend/
    
    # Tag image
    docker tag $PROJECT_NAME-backend:latest $ECR_REPOSITORY:latest
    
    # Push image
    docker push $ECR_REPOSITORY:latest
    
    log_success "Docker image built and pushed successfully!"
}

# Update ECS service
update_ecs_service() {
    log_info "Updating ECS service..."
    
    # Force new deployment
    aws ecs update-service \
        --cluster $PROJECT_NAME-cluster \
        --service $PROJECT_NAME-service \
        --force-new-deployment \
        --region $AWS_REGION
    
    log_success "ECS service update initiated!"
}

# Deploy frontend to Amplify
deploy_frontend() {
    log_info "Deploying frontend to AWS Amplify..."
    
    # Check if Amplify CLI is installed
    if ! command -v amplify &> /dev/null; then
        log_warning "Amplify CLI not found. Installing..."
        npm install -g @aws-amplify/cli
    fi
    
    cd ../cv-app-frontend
    
    # Initialize Amplify if not already done
    if [ ! -d "amplify" ]; then
        amplify init --yes
    fi
    
    # Add hosting
    amplify add hosting
    
    # Publish
    amplify publish --yes
    
    cd ../aws-deployment
    
    log_success "Frontend deployed to Amplify!"
}

# Set up secrets
setup_secrets() {
    log_info "Setting up AWS Secrets Manager..."
    
    # Prompt for OpenAI API key
    read -p "Enter your OpenAI API key: " OPENAI_KEY
    aws secretsmanager update-secret \
        --secret-id "$PROJECT_NAME/openai-api-key" \
        --secret-string "$OPENAI_KEY" \
        --region $AWS_REGION
    
    # Prompt for Pinecone API key
    read -p "Enter your Pinecone API key: " PINECONE_KEY
    aws secretsmanager update-secret \
        --secret-id "$PROJECT_NAME/pinecone-api-key" \
        --secret-string "$PINECONE_KEY" \
        --region $AWS_REGION
    
    log_success "Secrets configured successfully!"
}

# Main deployment function
main() {
    log_info "Starting CV Maker deployment to AWS..."
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --infrastructure-only)
                INFRASTRUCTURE_ONLY=true
                shift
                ;;
            --frontend-only)
                FRONTEND_ONLY=true
                shift
                ;;
            --backend-only)
                BACKEND_ONLY=true
                shift
                ;;
            --setup-secrets)
                SETUP_SECRETS=true
                shift
                ;;
            -h|--help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --infrastructure-only  Deploy only infrastructure"
                echo "  --frontend-only       Deploy only frontend"
                echo "  --backend-only        Deploy only backend"
                echo "  --setup-secrets       Set up secrets in AWS Secrets Manager"
                echo "  -h, --help           Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    check_prerequisites
    
    if [ "$SETUP_SECRETS" = true ]; then
        setup_secrets
        exit 0
    fi
    
    if [ "$INFRASTRUCTURE_ONLY" = true ]; then
        deploy_infrastructure
        exit 0
    fi
    
    if [ "$FRONTEND_ONLY" = true ]; then
        deploy_frontend
        exit 0
    fi
    
    if [ "$BACKEND_ONLY" = true ]; then
        build_and_push_image
        update_ecs_service
        exit 0
    fi
    
    # Full deployment
    deploy_infrastructure
    build_and_push_image
    update_ecs_service
    deploy_frontend
    
    log_success "CV Maker deployment completed successfully!"
    log_info "Your application should be available at the domain configured in terraform.tfvars"
}

# Run main function
main "$@"
