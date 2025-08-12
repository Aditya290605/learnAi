import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, BookOpen, TrendingUp, Clock, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { RoadmapCard } from '../components/dashboard/RoadmapCard';
import { getCurrentUser } from '../utils/auth';
import { getUserRoadmaps, getRoadmapStats, deleteRoadmap, Roadmap, RoadmapStats } from '../utils/roadmapApi';

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [stats, setStats] = useState<RoadmapStats>({
    totalRoadmaps: 0,
    totalSteps: 0,
    completedSteps: 0,
    averageProgress: 0,
    totalHours: 0
  });
  const [loading, setLoading] = useState(true);
  const [deletingRoadmap, setDeletingRoadmap] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Show success toast if navigated here from sign in/up
  useEffect(() => {
    const state = (location.state || {}) as { successMessage?: string };
    if (state.successMessage) {
      setSuccessMessage(state.successMessage);
      // Clear the navigation state so the message doesn't persist on refresh/back
      navigate(location.pathname, { replace: true });
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state, location.pathname, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [roadmapsResponse, statsResponse] = await Promise.all([
        getUserRoadmaps(),
        getRoadmapStats()
      ]);
      
      setRoadmaps(roadmapsResponse.roadmaps);
      setStats(statsResponse.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoadmap = async (roadmapId: string) => {
    if (!confirm('Are you sure you want to delete this roadmap? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingRoadmap(roadmapId);
      await deleteRoadmap(roadmapId);
      
      // Remove from local state
      setRoadmaps(prev => prev.filter(roadmap => roadmap._id !== roadmapId));
      
      // Refresh stats
      const statsResponse = await getRoadmapStats();
      setStats(statsResponse.stats);
    } catch (error) {
      console.error('Error deleting roadmap:', error);
      alert('Failed to delete roadmap. Please try again.');
    } finally {
      setDeletingRoadmap(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="flex items-start space-x-3 bg-white border border-green-200 shadow-xl rounded-xl p-4 w-80">
            <div className="mt-0.5">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Success</p>
              <p className="text-sm text-gray-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Roadmaps</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRoadmaps}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.completedSteps}/{stats.totalSteps}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                <div className="w-6 h-6 text-white font-bold">{stats.averageProgress}%</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHours}h</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Roadmaps Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Learning Roadmaps</h2>
          <Button onClick={() => navigate('/create-roadmap')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Roadmap
          </Button>
        </div>

        {roadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap) => (
              <div key={roadmap._id} className="relative group">
                <RoadmapCard 
                  roadmap={roadmap} 
                  onView={(roadmapId) => navigate(`/roadmap/${roadmapId}`)}
                />
                
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteRoadmap(roadmap._id)}
                  disabled={deletingRoadmap === roadmap._id}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                  title="Delete roadmap"
                >
                  {deletingRoadmap === roadmap._id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
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
            <Button onClick={() => navigate('/create-roadmap')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Roadmap
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}