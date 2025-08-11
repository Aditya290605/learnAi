@echo off
echo 🚀 Setting up SkillPath - AI-Powered Learning Roadmaps
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd /d "%~dp0"
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Create environment files
echo 🔧 Creating environment files...

REM Frontend .env
cd ..
if not exist .env (
    echo VITE_API_URL=http://localhost:5000/api > .env
    echo ✅ Created frontend .env file
) else (
    echo ℹ️  Frontend .env file already exists
)

REM Backend .env
cd backend
if not exist .env (
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo MONGODB_URI=mongodb://localhost:27017/skillpath
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo JWT_EXPIRES_IN=7d
        echo FRONTEND_URL=http://localhost:5173
        echo GEMINI_API_KEY=your-gemini-api-key-here
    ) > .env
    echo ✅ Created backend .env file
    echo ⚠️  Please update the backend .env file with your actual values:
    echo    - MONGODB_URI: Your MongoDB connection string
    echo    - JWT_SECRET: A secure random string
    echo    - GEMINI_API_KEY: Your Google AI API key
) else (
    echo ℹ️  Backend .env file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Update the backend .env file with your actual values
echo 2. Start MongoDB (local or cloud)
echo 3. Start the backend: cd backend ^&^& npm run dev
echo 4. Start the frontend: npm run dev
echo 5. Open http://localhost:5173 in your browser
echo.
echo For more information, see the README.md file.
pause
