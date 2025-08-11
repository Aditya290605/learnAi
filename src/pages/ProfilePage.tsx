import { User, Mail, Calendar, Award, BookOpen, TrendingUp, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { signOut } from '../utils/auth';
import { mockUser } from '../mockData/users';
import { mockRoadmaps } from '../mockData/roadmaps';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const handleSignOut = () => {
    signOut();
    onNavigate('home');
  };

  const totalSteps = mockRoadmaps.reduce((acc, roadmap) => acc + roadmap.totalSteps, 0);
  const completedSteps = mockRoadmaps.reduce((acc, roadmap) => acc + roadmap.completedSteps, 0);
  const totalHours = mockRoadmaps.reduce((acc, roadmap) => acc + roadmap.estimatedHours, 0);
  const averageProgress = mockRoadmaps.length > 0 
    ? Math.round(mockRoadmaps.reduce((acc, roadmap) => acc + roadmap.progress, 0) / mockRoadmaps.length)
    : 0;

  const achievements = [
    { title: 'First Roadmap', description: 'Created your first learning roadmap', earned: true },
    { title: 'Consistent Learner', description: 'Completed steps for 7 days in a row', earned: true },
    { title: 'Step Master', description: 'Completed 10 learning steps', earned: completedSteps >= 10 },
    { title: 'Multi-Skilled', description: 'Active roadmaps in 3+ skills', earned: mockRoadmaps.length >= 3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              {mockUser.avatar ? (
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockUser.name}</h1>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                <Mail className="w-4 h-4 mr-2" />
                <span>{mockUser.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Member since January 2024</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button variant="outline">
                Edit Profile
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{mockRoadmaps.length}</p>
              <p className="text-sm text-gray-600">Active Roadmaps</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{completedSteps}</p>
              <p className="text-sm text-gray-600">Steps Completed</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">{averageProgress}%</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{averageProgress}%</p>
              <p className="text-sm text-gray-600">Avg Progress</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
              <p className="text-sm text-gray-600">Learning Hours</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learning Progress */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Progress</h3>
            
            <div className="space-y-6">
              {mockRoadmaps.map((roadmap) => (
                <div key={roadmap.id}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{roadmap.skill}</h4>
                    <span className="text-sm text-gray-600">{roadmap.progress}%</span>
                  </div>
                  <ProgressBar value={roadmap.progress} showLabel={false} />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{roadmap.completedSteps}/{roadmap.totalSteps} steps</span>
                    <span>{roadmap.estimatedHours}h total</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Achievements</h3>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-3 rounded-lg ${
                    achievement.earned ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <Award className={`w-5 h-5 ${achievement.earned ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.earned ? 'text-green-900' : 'text-gray-700'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${achievement.earned ? 'text-green-700' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="text-green-600">✓</div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}