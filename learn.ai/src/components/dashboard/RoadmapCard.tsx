import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Roadmap } from '../../utils/roadmapApi';

interface RoadmapCardProps {
  roadmap: Roadmap;
  onView: (roadmapId: string) => void;
}

export function RoadmapCard({ roadmap, onView }: RoadmapCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card hover className="group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {roadmap.title}
          </h3>
          <p className="text-gray-600 mt-1">{roadmap.skill}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(roadmap.difficulty)}`}>
          {roadmap.difficulty}
        </span>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-2">{roadmap.description}</p>
      
      <div className="space-y-4">
        <ProgressBar value={roadmap.progress} showLabel />
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>{roadmap.completedSteps}/{roadmap.totalSteps} steps</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{roadmap.estimatedHours}h total</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(roadmap.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full group-hover:border-blue-500 group-hover:text-blue-600"
          onClick={() => onView(roadmap._id)}
        >
          View Roadmap
        </Button>
      </div>
    </Card>
  );
}