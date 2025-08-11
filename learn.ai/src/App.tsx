import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateRoadmapPage } from './pages/CreateRoadmapPage';
import { RoadmapViewerPage } from './pages/RoadmapViewerPage';
import { ProfilePage } from './pages/ProfilePage';
import { isAuthenticated, refreshUserData } from './utils/auth';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated on app load
        if (isAuthenticated()) {
          // Try to refresh user data to ensure token is still valid
          const user = await refreshUserData();
          if (user) {
            setIsAuth(true);
          } else {
            setIsAuth(false);
          }
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            isAuth ? <Navigate to="/dashboard" replace /> : <HomePage />
          } />
          <Route path="/signin" element={
            isAuth ? <Navigate to="/dashboard" replace /> : <SignInPage />
          } />
          <Route path="/signup" element={
            isAuth ? <Navigate to="/dashboard" replace /> : <SignUpPage />
          } />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            isAuth ? <DashboardPage /> : <Navigate to="/signin" replace />
          } />
          <Route path="/create-roadmap" element={
            isAuth ? <CreateRoadmapPage /> : <Navigate to="/signin" replace />
          } />
          <Route path="/roadmap/:roadmapId" element={
            isAuth ? <RoadmapViewerPage /> : <Navigate to="/signin" replace />
          } />
          <Route path="/profile" element={
            isAuth ? <ProfilePage /> : <Navigate to="/signin" replace />
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;