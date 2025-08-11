import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateRoadmapPage } from './pages/CreateRoadmapPage';
import { RoadmapViewerPage } from './pages/RoadmapViewerPage';
import { ProfilePage } from './pages/ProfilePage';
import { isAuthenticated } from './utils/auth';

type Page = 'home' | 'signin' | 'signup' | 'dashboard' | 'create-roadmap' | 'roadmap' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('');

  useEffect(() => {
    // Check if user is authenticated on app load
    if (isAuthenticated() && currentPage === 'home') {
      setCurrentPage('dashboard');
    }
  }, [currentPage]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar onNavigate={handleNavigate} currentPage={currentPage} />}
      {renderPage()}
    </div>
  );
}

export default App;