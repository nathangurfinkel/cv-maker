#!/bin/bash

# Setup AWS Secrets Manager for CV Maker
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
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    log_success "All prerequisites met!"
}

# Create secrets
create_secrets() {
    log_info "Creating secrets in AWS Secrets Manager..."
    
    # Create OpenAI API key secret
    log_info "Setting up OpenAI API key..."
    read -p "Enter your OpenAI API key: " OPENAI_KEY
    if [ -z "$OPENAI_KEY" ]; then
        log_error "OpenAI API key cannot be empty"
        exit 1
    fi
    
    aws secretsmanager create-secret \
        --name "$PROJECT_NAME/openai-api-key" \
        --description "OpenAI API Key for CV Builder" \
        --secret-string "$OPENAI_KEY" \
        --region $AWS_REGION \
        --tags Key=Project,Value=$PROJECT_NAME Key=Environment,Value=production \
        2>/dev/null || \
    aws secretsmanager update-secret \
        --secret-id "$PROJECT_NAME/openai-api-key" \
        --secret-string "$OPENAI_KEY" \
        --region $AWS_REGION
    
    log_success "OpenAI API key configured!"
    
    # Create Pinecone API key secret
    log_info "Setting up Pinecone API key..."
    read -p "Enter your Pinecone API key: " PINECONE_KEY
    if [ -z "$PINECONE_KEY" ]; then
        log_error "Pinecone API key cannot be empty"
        exit 1
    fi
    
    aws secretsmanager create-secret \
        --name "$PROJECT_NAME/pinecone-api-key" \
        --description "Pinecone API Key for CV Builder" \
        --secret-string "$PINECONE_KEY" \
        --region $AWS_REGION \
        --tags Key=Project,Value=$PROJECT_NAME Key=Environment,Value=production \
        2>/dev/null || \
    aws secretsmanager update-secret \
        --secret-id "$PROJECT_NAME/pinecone-api-key" \
        --secret-string "$PINECONE_KEY" \
        --region $AWS_REGION
    
    log_success "Pinecone API key configured!"
}

# Verify secrets
verify_secrets() {
    log_info "Verifying secrets..."
    
    # Check OpenAI secret
    if aws secretsmanager get-secret-value \
        --secret-id "$PROJECT_NAME/openai-api-key" \
        --region $AWS_REGION \
        --query 'SecretString' \
        --output text &> /dev/null; then
        log_success "OpenAI API key secret verified!"
    else
        log_error "Failed to verify OpenAI API key secret"
        exit 1
    fi
    
    # Check Pinecone secret
    if aws secretsmanager get-secret-value \
        --secret-id "$PROJECT_NAME/pinecone-api-key" \
        --region $AWS_REGION \
        --query 'SecretString' \
        --output text &> /dev/null; then
        log_success "Pinecone API key secret verified!"
    else
        log_error "Failed to verify Pinecone API key secret"
        exit 1
    fi
}

# Main function
main() {
    log_info "Setting up AWS Secrets Manager for CV Maker..."
    
    check_prerequisites
    create_secrets
    verify_secrets
    
    log_success "All secrets configured successfully!"
    log_info "You can now proceed with the infrastructure deployment."
}

# Run main function
main "$@"
