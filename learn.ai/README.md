# 🚀 SkillPath - AI-Powered Learning Roadmaps

A comprehensive learning platform that uses Gemini AI to create personalized learning roadmaps with interactive visualizations and progress tracking.

## ✨ Features

### 🎯 AI-Powered Roadmap Generation
- **Gemini AI Integration**: Creates personalized learning paths based on user input
- **Smart Step Generation**: Minimum 8-12 detailed steps with realistic durations
- **Real YouTube Resources**: Curated learning materials with actual video links
- **Progressive Learning**: Each step builds upon previous knowledge

### 🎨 Enhanced Visual Experience
- **Interactive React Flow**: Beautiful flowchart visualization of learning paths
- **Dynamic Progress Tracking**: Real-time progress updates with visual indicators
- **Smart Layout**: Optimized node positioning for better readability
- **Visual Status Indicators**: Clear completion states and current step highlighting

### 📚 Rich Resource Management
- **YouTube Integration**: Real video resources with thumbnails and metadata
- **Channel Information**: Display of video creators and view counts
- **Resource Generation**: AI-powered additional resource suggestions
- **Error Handling**: Fallback images for broken thumbnails

### 🔐 Secure Authentication
- **JWT Authentication**: Secure user sessions with token-based auth
- **User-Specific Data**: Each user sees only their own roadmaps
- **Persistent Sessions**: Automatic login state management
- **Protected Routes**: Secure access to user-specific content

### 📊 Progress Analytics
- **Real-time Statistics**: Dashboard with comprehensive learning metrics
- **Dynamic Progress Bars**: Visual progress indicators throughout the app
- **Step Completion Tracking**: MongoDB-based progress persistence
- **Learning Analytics**: Total hours, completed steps, and average progress

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **React Flow** - Interactive flowchart visualization
- **Tailwind CSS** - Modern, utility-first styling
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Google Generative AI** - Gemini AI integration

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Input Validation** - Data sanitization
- **Error Handling** - Comprehensive error management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Google AI API key (Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learn.ai
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Setup**

   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   **Backend (.env)**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/skillpath
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

5. **Start the application**

   **Terminal 1 - Backend**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - Frontend**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📖 Usage Guide

### Creating Your First Roadmap

1. **Sign Up/Login**: Create an account or sign in
2. **Navigate to Create Roadmap**: Click "Create New Roadmap"
3. **Fill in Details**:
   - **Skill**: What you want to learn (e.g., "React", "Python", "Digital Marketing")
   - **Current Level**: Your experience level
   - **Target Outcome**: What you want to achieve
   - **Hours per Week**: Available study time
4. **Generate Roadmap**: AI creates a personalized learning path
5. **Start Learning**: Click "Start Learning Journey" to begin

### Using the Roadmap Viewer

1. **Interactive Flowchart**: Click on nodes to view step details
2. **Resource Access**: Click on YouTube videos to open in new tab
3. **Progress Tracking**: Mark steps as complete to update progress
4. **Additional Resources**: Generate more learning materials for any step
5. **Visual Feedback**: See your progress with dynamic indicators

### Dashboard Features

- **Overview Statistics**: Total roadmaps, completed steps, average progress
- **Roadmap Management**: View, edit, and delete your learning paths
- **Progress Tracking**: Real-time updates on all your learning journeys
- **Quick Actions**: Easy access to create new roadmaps or continue learning

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Roadmaps
- `POST /api/roadmaps` - Create new roadmap
- `GET /api/roadmaps` - Get user's roadmaps
- `GET /api/roadmaps/:id` - Get specific roadmap
- `PUT /api/roadmaps/:id/steps/:stepId` - Update step completion
- `POST /api/roadmaps/:id/steps/:stepId/resources` - Generate additional resources
- `DELETE /api/roadmaps/:id` - Delete roadmap
- `GET /api/roadmaps/stats` - Get roadmap statistics

## 🎨 UI Components

### Enhanced Roadmap Visualization
- **Custom Nodes**: Rich step information with completion status
- **Dynamic Edges**: Visual connections with completion indicators
- **Responsive Layout**: Optimized for different screen sizes
- **Interactive Elements**: Click-to-select and hover effects

### Resource Display
- **YouTube Integration**: Real video thumbnails and metadata
- **Channel Information**: Creator details and view counts
- **Error Handling**: Fallback images for broken links
- **Responsive Design**: Mobile-friendly resource cards

### Progress Indicators
- **Dynamic Progress Bars**: Real-time progress visualization
- **Step Status**: Clear completion and pending states
- **Visual Feedback**: Color-coded status indicators
- **Smooth Animations**: Polished user experience

## 🔒 Security Features

- **JWT Authentication**: Secure token-based sessions
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive data sanitization
- **Rate Limiting**: API protection against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Helmet Security**: HTTP security headers

## 📈 Performance Optimizations

- **MongoDB Indexing**: Optimized database queries
- **React Flow Optimization**: Efficient flowchart rendering
- **Image Optimization**: Compressed thumbnails and fallbacks
- **Lazy Loading**: On-demand resource loading
- **Caching**: Browser-level caching for static assets

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
npm start
```

### Database (MongoDB Atlas)
- Create MongoDB Atlas cluster
- Update MONGODB_URI in environment variables
- Configure network access and security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- **Social Features**: Share roadmaps and progress
- **Advanced Analytics**: Detailed learning insights
- **Mobile App**: Native mobile application
- **Offline Support**: PWA capabilities
- **AI Chat**: Learning assistant integration
- **Gamification**: Achievements and rewards system

---

**Built with ❤️ using React, Node.js, MongoDB, and Gemini AI**
