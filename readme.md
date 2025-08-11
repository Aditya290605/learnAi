# SkillPath - Learning Platform with JWT Authentication

A modern learning platform that provides personalized learning roadmaps with secure JWT authentication.

## Features

- 🔐 **Secure JWT Authentication** - Complete user registration and login system
- 📊 **Personalized Learning Roadmaps** - AI-powered learning paths
- 📈 **Progress Tracking** - Visual progress indicators and milestone tracking
- 🎯 **Interactive Roadmaps** - Visual learning journey with dependencies
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🛡️ **Security Features** - Password hashing, rate limiting, CORS protection

## Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

## Project Structure

```
learn.ai/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions (auth, etc.)
│   ├── types/             # TypeScript type definitions
│   └── mockData/          # Mock data for development
├── backend/               # Backend Node.js application
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd learn.ai

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/skillpath
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/skillpath

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment Variables

Create a `.env` file in the root directory:

```bash
# Create .env file in the root directory
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 3. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The database will be created automatically when you first run the application

#### Option B: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### 4. Start the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
# In a new terminal, from the root directory
npm run dev
```

The frontend will start on `http://localhost:5173`

### 5. Verify Installation

1. Backend health check: `http://localhost:5000/health`
2. Frontend: `http://localhost:5173`

## API Endpoints

### Authentication Routes

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Request/Response Examples

#### Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Sign In
```bash
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **Helmet**: Security headers protection

## Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
```

### Code Structure

The application follows a clean architecture pattern:

- **Controllers**: Handle HTTP requests and responses
- **Models**: Define data structure and business logic
- **Middleware**: Authentication, validation, and error handling
- **Routes**: Define API endpoints
- **Utils**: Helper functions and utilities

## Deployment

### Backend Deployment

1. Set up a MongoDB database (Atlas recommended)
2. Deploy to your preferred platform (Heroku, Vercel, Railway, etc.)
3. Set environment variables
4. Update CORS settings for your domain

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Update the API URL in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue in the repository.
