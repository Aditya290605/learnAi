#!/bin/bash

# SkillPath Setup Script
echo "🚀 Setting up SkillPath - AI-Powered Learning Roadmaps"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd "$(dirname "$0")"
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Create environment files
echo "🔧 Creating environment files..."

# Frontend .env
cd ..
if [ ! -f .env ]; then
    cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF
    echo "✅ Created frontend .env file"
else
    echo "ℹ️  Frontend .env file already exists"
fi

# Backend .env
cd backend
if [ ! -f .env ]; then
    cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillpath
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your-gemini-api-key-here
EOF
    echo "✅ Created backend .env file"
    echo "⚠️  Please update the backend .env file with your actual values:"
    echo "   - MONGODB_URI: Your MongoDB connection string"
    echo "   - JWT_SECRET: A secure random string"
    echo "   - GEMINI_API_KEY: Your Google AI API key"
else
    echo "ℹ️  Backend .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update the backend .env file with your actual values"
echo "2. Start MongoDB (local or cloud)"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: npm run dev"
echo "5. Open http://localhost:5173 in your browser"
echo ""
echo "For more information, see the README.md file."
