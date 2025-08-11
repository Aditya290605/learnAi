import { Plus, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { RoadmapCard } from '../components/dashboard/RoadmapCard';
import { mockRoadmaps } from '../mockData/roadmaps';
import { getCurrentUser } from '../utils/auth';

interface DashboardPageProps {
  onNavigate: (page: string, roadmapId?: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const currentUser = getCurrentUser();
  const totalSteps = mockRoadmaps.reduce((acc, roadmap) => acc + roadmap.totalSteps, 0);
  const completedSteps = mockRoadmaps.reduce((acc, roadmap) => acc + roadmap.completedSteps, 0);
  const averageProgress = mockRoadmaps.length > 0 
    ? Math.round(mockRoadmaps.reduce((acc, roadmap) => acc + roadmap.progress, 0) / mockRoadmaps.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name || 'Learner'}! 👋
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and track your progress across all your roadmaps.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Roadmaps</p>
                <p className="text-2xl font-bold text-gray-900">{mockRoadmaps.length}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Steps</p>
                <p className="text-2xl font-bold text-gray-900">{completedSteps}/{totalSteps}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                <div className="w-6 h-6 text-white font-bold">{averageProgress}%</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Progress</p>
                <p className="text-2xl font-bold text-gray-900">{averageProgress}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Roadmaps Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Learning Roadmaps</h2>
          <Button onClick={() => onNavigate('create-roadmap')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Roadmap
          </Button>
        </div>

        {mockRoadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRoadmaps.map((roadmap) => (
              <RoadmapCard 
                key={roadmap.id} 
                roadmap={roadmap} 
                onView={(roadmapId) => onNavigate('roadmap', roadmapId)}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No roadmaps yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first learning roadmap to get started on your skill development journey.
            </p>
            <Button onClick={() => onNavigate('create-roadmap')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Roadmap
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}