import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateRoadmapPage } from './pages/CreateRoadmapPage';
import { RoadmapViewerPage } from './pages/RoadmapViewerPage';
import { ProfilePage } from './pages/ProfilePage';
import { isAuthenticated, refreshUserData } from './utils/auth';

type Page = 'home' | 'signin' | 'signup' | 'dashboard' | 'create-roadmap' | 'roadmap' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated on app load
        if (isAuthenticated()) {
          // Try to refresh user data to ensure token is still valid
          const user = await refreshUserData();
          if (user) {
            setCurrentPage('dashboard');
          } else {
            // Token is invalid, stay on home page
            setCurrentPage('home');
          }
        } else {
          setCurrentPage('home');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setCurrentPage('home');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleNavigate = (page: string, roadmapId?: string) => {
    setCurrentPage(page as Page);
    if (roadmapId) {
      setSelectedRoadmapId(roadmapId);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'signin':
        return <SignInPage onNavigate={handleNavigate} />;
      case 'signup':
        return <SignUpPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'create-roadmap':
        return <CreateRoadmapPage onNavigate={handleNavigate} />;
      case 'roadmap':
        return <RoadmapViewerPage roadmapId={selectedRoadmapId} onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const showNavbar = currentPage !== 'home' && currentPage !== 'signin' && currentPage !== 'signup';

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
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar onNavigate={handleNavigate} currentPage={currentPage} />}
      {renderPage()}
    </div>
  );
}

export default App;