import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { getCurrentUser, signOut } from '../../utils/auth';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const currentUser = getCurrentUser();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              SkillPath
            </span>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'dashboard'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('create-roadmap')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'create-roadmap'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Create Roadmap
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigate('profile')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Profile"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}