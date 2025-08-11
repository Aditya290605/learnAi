import { useState, useCallback } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, CheckCircle, Clock, Users, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { mockRoadmaps } from '../mockData/roadmaps';
import { generateRoadmapNodes } from '../utils/roadmapUtils';

interface VideoResource {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  views: string;
  channel: string;
}

const mockVideos: VideoResource[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals - Complete Beginner Guide',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=300&h=200',
    url: '#',
    duration: '2:15:32',
    views: '2.1M',
    channel: 'FreeCodeCamp'
  },
  {
    id: '2',
    title: 'Advanced JavaScript Concepts You Need to Know',
    thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?w=300&h=200',
    url: '#',
    duration: '1:45:20',
    views: '890K',
    channel: 'JavaScript Mastery'
  },
  {
    id: '3',
    title: 'Building Your First React Application',
    thumbnail: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?w=300&h=200',
    url: '#',
    duration: '3:22:15',
    views: '1.2M',
    channel: 'React Tutorial'
  }
];

interface RoadmapViewerPageProps {
  roadmapId: string;
  onNavigate: (page: string) => void;
}

export function RoadmapViewerPage({ roadmapId, onNavigate }: RoadmapViewerPageProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set(['step-1', 'step-2']));
  
  // Find the roadmap (in a real app, this would be an API call)
  const roadmap = mockRoadmaps.find(r => r.id === roadmapId) || mockRoadmaps[0];
  
  // Generate React Flow nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = generateRoadmapNodes(roadmap.steps);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedStep(node.id);
  }, []);

  const handleStartStep = (stepId: string) => {
    // Mark step as completed
    setCompletedSteps(prev => new Set(prev).add(stepId));
    
    // Update node style
    setNodes(nodes => 
      nodes.map(node => 
        node.id === stepId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                completed: true 
              },
              style: {
                ...node.style,
                background: '#10B981',
                color: 'white'
              }
            }
          : node
      )
    );
  };

  const selectedStepData = roadmap.steps.find(step => step.id === selectedStep);
  const progress = (completedSteps.size / roadmap.steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('dashboard')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{roadmap.title}</h1>
              <p className="text-gray-600">{roadmap.skill} • {roadmap.difficulty}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Est. Time</p>
                  <p className="text-2xl font-bold text-gray-900">{roadmap.estimatedHours}h</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Steps</p>
                  <p className="text-2xl font-bold text-gray-900">{completedSteps.size}/{roadmap.steps.length}</p>
                </div>
              </div>
            </Card>
          </div>

          <ProgressBar value={progress} className="mb-8" />
        </div>

        {/* Roadmap Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="h-96 lg:h-[600px]">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  connectionMode={ConnectionMode.Strict}
                  fitView
                  fitViewOptions={{ padding: 0.1 }}
                  className="bg-gray-50"
                >
                  <Background />
                  <Controls />
                </ReactFlow>
              </div>
            </Card>
          </div>

          {/* Step Details */}
          <div className="space-y-6">
            {selectedStepData ? (
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedStepData.title}
                  </h3>
                  {completedSteps.has(selectedStepData.id) ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm">Completed</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleStartStep(selectedStepData.id)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4">{selectedStepData.description}</p>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{selectedStepData.duration}</span>
                </div>
                
                {selectedStepData.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Prerequisites:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStepData.prerequisites.map((prereq) => (
                        <span
                          key={prereq}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                        >
                          {roadmap.steps.find(s => s.id === prereq)?.title || prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a Step
                </h3>
                <p className="text-gray-600">
                  Click on any node in the roadmap to view details and resources.
                </p>
              </Card>
            )}

            {/* Learning Resources */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Learning Resources
              </h3>
              
              <div className="space-y-4">
                {mockVideos.map((video) => (
                  <div key={video.id} className="flex space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-20 h-14 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {video.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span>{video.channel}</span>
                        <span>•</span>
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}