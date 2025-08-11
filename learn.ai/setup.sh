#!/bin/bash

echo "🚀 Setting up SkillPath Learning Platform with JWT Authentication"
echo "================================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create environment files
echo "⚙️  Creating environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/skillpath
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/skillpath

# JWT Configuration
JWT_SECRET=skillpath-jwt-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    echo "✅ Created backend/.env"
else
    echo "⚠️  backend/.env already exists"
fi

# Frontend .env
if [ ! -f ".env" ]; then
    cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF
    echo "✅ Created .env"
else
    echo "⚠️  .env already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up MongoDB (local or MongoDB Atlas)"
echo "2. Update the MONGODB_URI in backend/.env if using MongoDB Atlas"
echo "3. Start the backend server: cd backend && npm run dev"
echo "4. Start the frontend server: npm run dev"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:5000"
echo "   Health check: http://localhost:5000/health"
echo ""
echo "📚 For more information, see README.md"
