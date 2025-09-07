#!/bin/bash

# CV Maker AWS Amplify Deployment Script
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
    
    # Check if Amplify CLI is installed
    if ! command -v amplify &> /dev/null; then
        log_warning "Amplify CLI not found. Installing..."
        npm install -g @aws-amplify/cli
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    log_success "All prerequisites met!"
}

# Initialize Amplify project
init_amplify() {
    log_info "Initializing AWS Amplify project..."
    
    # Check if amplify folder exists
    if [ ! -d "amplify" ]; then
        amplify init --yes
    else
        log_info "Amplify project already initialized"
    fi
    
    log_success "Amplify project initialized!"
}

# Add backend function
add_backend_function() {
    log_info "Adding Lambda function for backend API..."
    
    # Check if function already exists
    if [ ! -d "amplify/backend/function/cvmakerapi" ]; then
        amplify add function --yes
    else
        log_info "Backend function already exists"
    fi
    
    log_success "Backend function added!"
}

# Add storage
add_storage() {
    log_info "Adding S3 storage for file uploads..."
    
    # Check if storage already exists
    if [ ! -d "amplify/backend/storage/cvmakerstorage" ]; then
        amplify add storage --yes
    else
        log_info "Storage already exists"
    fi
    
    log_success "Storage added!"
}

# Add hosting
add_hosting() {
    log_info "Adding hosting for frontend..."
    
    # Check if hosting already exists
    if [ ! -d "amplify/backend/hosting" ]; then
        amplify add hosting --yes
    else
        log_info "Hosting already exists"
    fi
    
    log_success "Hosting added!"
}

# Configure environment variables
configure_env_vars() {
    log_info "Configuring environment variables..."
    
    # Prompt for API keys
    read -p "Enter your OpenAI API key: " OPENAI_KEY
    read -p "Enter your Pinecone API key: " PINECONE_KEY
    
    # Set environment variables in Amplify
    amplify env add --yes
    
    log_success "Environment variables configured!"
}

# Deploy to AWS
deploy_amplify() {
    log_info "Deploying to AWS Amplify..."
    
    # Push all changes to AWS
    amplify push --yes
    
    log_success "Deployment completed!"
}

# Get deployment info
get_deployment_info() {
    log_info "Getting deployment information..."
    
    # Get the API URL
    API_URL=$(amplify status | grep "cvmakerapi" | awk '{print $3}' || echo "Not found")
    
    # Get the hosting URL
    HOSTING_URL=$(amplify status | grep "hosting" | awk '{print $3}' || echo "Not found")
    
    log_success "Deployment Information:"
    log_info "API URL: $API_URL"
    log_info "Hosting URL: $HOSTING_URL"
    
    # Update frontend environment
    if [ "$API_URL" != "Not found" ]; then
        log_info "Updating frontend environment variables..."
        echo "VITE_API_BASE_URL=$API_URL" > cv-app-frontend/.env.production
        echo "VITE_ENVIRONMENT=production" >> cv-app-frontend/.env.production
    fi
}

# Main deployment function
main() {
    log_info "Starting CV Maker deployment to AWS Amplify..."
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --init-only)
                INIT_ONLY=true
                shift
                ;;
            --deploy-only)
                DEPLOY_ONLY=true
                shift
                ;;
            --info)
                get_deployment_info
                exit 0
                ;;
            -h|--help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --init-only     Initialize Amplify project only"
                echo "  --deploy-only   Deploy existing Amplify project"
                echo "  --info          Show deployment information"
                echo "  -h, --help      Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    check_prerequisites
    
    if [ "$DEPLOY_ONLY" = true ]; then
        deploy_amplify
        get_deployment_info
        exit 0
    fi
    
    if [ "$INIT_ONLY" = true ]; then
        init_amplify
        add_backend_function
        add_storage
        add_hosting
        configure_env_vars
        exit 0
    fi
    
    # Full deployment
    init_amplify
    add_backend_function
    add_storage
    add_hosting
    configure_env_vars
    deploy_amplify
    get_deployment_info
    
    log_success "CV Maker deployment to AWS Amplify completed successfully!"
    log_info "Your application is now live on AWS Amplify!"
}

# Run main function
main "$@"
