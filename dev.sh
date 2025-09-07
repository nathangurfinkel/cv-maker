#!/bin/bash

# CV Maker Development Script
# This script runs both frontend and backend in development mode

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting CV Maker Development Environment${NC}"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down development servers...${NC}"
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}✅ Development servers stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [ ! -d "cv-app-frontend" ] || [ ! -d "cv-app-ng-backend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the cv-maker root directory${NC}"
    echo "Expected structure:"
    echo "  cv-maker/"
    echo "  ├── cv-app-frontend/"
    echo "  └── cv-app-ng-backend/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Error: Python 3 is not installed${NC}"
    echo "Please install Python 3"
    exit 1
fi

echo -e "${YELLOW}📋 Checking dependencies...${NC}"

# Check frontend dependencies
if [ ! -d "cv-app-frontend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    cd cv-app-frontend
    npm install
    cd ..
fi

# Check backend dependencies
if [ ! -d "cv-app-ng-backend/venv" ]; then
    echo -e "${YELLOW}🐍 Creating Python virtual environment...${NC}"
    cd cv-app-ng-backend
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    cd ..
else
    echo -e "${GREEN}✅ Backend virtual environment exists${NC}"
fi

echo -e "${GREEN}✅ Dependencies ready${NC}"
echo ""
echo -e "${YELLOW}💡 Note: For full functionality, create a .env file in cv-app-ng-backend/ with:${NC}"
echo -e "${YELLOW}   OPENAI_API_KEY=your_openai_api_key_here${NC}"
echo -e "${YELLOW}   (Optional: PINECONE_API_KEY, MOCK_PINECONE=true)${NC}"
echo ""

# Start backend server
echo -e "${BLUE}🔧 Starting backend server (FastAPI)...${NC}"
cd cv-app-ng-backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000 --loop asyncio &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo -e "${BLUE}⚛️  Starting frontend server (React + Vite)...${NC}"
cd cv-app-ng
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}🎉 Development servers started successfully!${NC}"
echo ""
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:5173"
echo -e "${BLUE}🔧 Backend:${NC}  http://localhost:8000"
echo -e "${BLUE}📚 API Docs:${NC} http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop both servers${NC}"
echo ""

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID
