import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  EdgeTypes,
  NodeTypes,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArrowLeft, CheckCircle, Circle, Play, ExternalLink, Loader2, BookOpen, Clock, Users, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getRoadmap, updateStepCompletion, generateAdditionalResources, Roadmap, YoutubeVideo } from '../utils/roadmapApi';

// Custom node component for roadmap steps
const RoadmapNode = ({ data }: { data: any }) => {
  const { step, onToggleComplete, onGenerateResources, generatingResources, isActive } = data;
  
  return (
    <div className={`bg-white border-2 rounded-xl p-4 shadow-lg min-w-[280px] max-w-[320px] transition-all duration-300 ${
      step.completed 
        ? 'border-green-500 bg-green-50' 
        : isActive 
          ? 'border-blue-500 bg-blue-50 shadow-xl' 
          : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleComplete(step.id)}
            className={`p-1 rounded-full transition-colors ${
              step.completed 
                ? 'text-green-600 hover:text-green-700' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {step.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          </button>
          <h3 className={`font-semibold text-sm ${step.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {step.title}
          </h3>
        </div>
        {isActive && !step.completed && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-600 font-medium">Current</span>
          </div>
        )}
      </div>
      
      <p className={`text-xs text-gray-600 mb-3 ${step.completed ? 'line-through' : ''}`}>
        {step.description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{step.duration}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          step.completed 
            ? 'bg-green-100 text-green-700' 
            : isActive
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
        }`}>
          {step.completed ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
        </span>
      </div>

      {step.prerequisites.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-700 mb-1">Prerequisites:</p>
          <div className="flex flex-wrap gap-1">
            {step.prerequisites.map((prereq: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {prereq}
              </span>
            ))}
          </div>
        </div>
      )}

      {step.resources && step.resources.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-700 mb-2 flex items-center">
            <BookOpen className="w-3 h-3 mr-1" />
            Resources ({step.resources.length})
          </p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {step.resources.map((resource: YoutubeVideo) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-xs hover:bg-gray-100 transition-colors"
              >
                <img 
                  src={resource.thumbnail} 
                  alt={resource.title}
                  className="w-8 h-6 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/80x60/cccccc/666666?text=Video';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate font-medium">{resource.title}</p>
                  <p className="text-gray-500 text-xs">{resource.channel} • {resource.duration} • {resource.views}</p>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => onGenerateResources(step.id)}
        disabled={generatingResources === step.id}
        className="w-full mt-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
      >
        {generatingResources === step.id ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Generating...
          </div>
        ) : (
          'Generate More Resources'
        )}
      </button>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  roadmapNode: RoadmapNode
};

export function RoadmapViewerPage() {
  const { roadmapId } = useParams<{ roadmapId: string }>();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingResources, setGeneratingResources] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  useEffect(() => {
    if (roadmapId) {
      fetchRoadmap();
    }
  }, [roadmapId]);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const response = await getRoadmap(roadmapId!);
      setRoadmap(response.roadmap);
      createFlowElements(response.roadmap);
    } catch (error) {
      console.error('Error fetching roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFlowElements = (roadmapData: Roadmap) => {
    // Create a better layout - vertical flow with some horizontal spacing
    const newNodes: Node[] = roadmapData.steps.map((step, index) => {
      const isActive = !step.completed && (index === 0 || roadmapData.steps[index - 1].completed);
      
      return {
        id: step.id,
        type: 'roadmapNode',
        position: { 
          x: (index % 2) * 350, 
          y: Math.floor(index / 2) * 200 
        },
        data: {
          step,
          onToggleComplete: handleToggleComplete,
          onGenerateResources: handleGenerateResources,
          generatingResources,
          isActive
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top
      };
    });

    const newEdges: Edge[] = roadmapData.steps.slice(1).map((step, index) => ({
      id: `edge-${index}`,
      source: roadmapData.steps[index].id,
      target: step.id,
      type: 'smoothstep',
      style: { 
        stroke: roadmapData.steps[index].completed ? '#10B981' : '#3B82F6', 
        strokeWidth: 3 
      },
      animated: roadmapData.steps[index].completed,
      label: roadmapData.steps[index].completed ? '✓' : '',
      labelStyle: { fill: '#10B981', fontWeight: 'bold' }
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleToggleComplete = async (stepId: string) => {
    if (!roadmap) return;

    try {
      const step = roadmap.steps.find(s => s.id === stepId);
      if (!step) return;

      const response = await updateStepCompletion(roadmap._id, stepId, !step.completed);
      setRoadmap(response.roadmap);
      
      // Update nodes with new completion status
      setNodes(prev => prev.map(node => {
        if (node.id === stepId) {
          return {
            ...node,
            data: {
              ...node.data,
              step: response.roadmap.steps.find(s => s.id === stepId)
            }
          };
        }
        return node;
      }));

      // Update edges to show completion
      setEdges(prev => prev.map(edge => {
        if (edge.source === stepId) {
          return {
            ...edge,
            style: { 
              stroke: !step.completed ? '#10B981' : '#3B82F6', 
              strokeWidth: 3 
            },
            animated: !step.completed,
            label: !step.completed ? '✓' : '',
            labelStyle: { fill: '#10B981', fontWeight: 'bold' }
          };
        }
        return edge;
      }));
    } catch (error) {
      console.error('Error updating step completion:', error);
    }
  };

  const handleGenerateResources = async (stepId: string) => {
    if (!roadmap) return;

    try {
      setGeneratingResources(stepId);
      const response = await generateAdditionalResources(roadmap._id, stepId);
      
      // Update the roadmap with new resources
      const updatedRoadmap = {
        ...roadmap,
        steps: roadmap.steps.map(step => 
          step.id === stepId 
            ? { ...step, resources: [...step.resources, ...response.resources] }
            : step
        )
      };
      
      setRoadmap(updatedRoadmap);
      
      // Update the corresponding node
      setNodes(prev => prev.map(node => {
        if (node.id === stepId) {
          return {
            ...node,
            data: {
              ...node.data,
              step: updatedRoadmap.steps.find(s => s.id === stepId)
            }
          };
        }
        return node;
      }));
    } catch (error) {
      console.error('Error generating resources:', error);
    } finally {
      setGeneratingResources(null);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleStartLearning = () => {
    // Find the first incomplete step
    const firstIncompleteStep = roadmap?.steps.find(step => !step.completed);
    if (firstIncompleteStep) {
      setSelectedStep(firstIncompleteStep.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <p className="text-gray-600">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Roadmap not found</h2>
          <p className="text-gray-600 mb-4">The roadmap you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const selectedStepData = roadmap.steps.find(step => step.id === selectedStep);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{roadmap.title}</h1>
                <p className="text-gray-600">{roadmap.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-lg font-semibold text-gray-900">{roadmap.progress}%</p>
              </div>
              <div className="w-32">
                <ProgressBar value={roadmap.progress} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Info */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Steps</p>
                <p className="text-2xl font-bold text-gray-900">{roadmap.totalSteps}</p>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{roadmap.completedSteps}</p>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="text-2xl font-bold text-gray-900">{roadmap.difficulty}</p>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600">Est. Hours</p>
                <p className="text-2xl font-bold text-gray-900">{roadmap.estimatedHours}h</p>
              </div>
            </Card>
          </div>

          {/* Start Learning Button */}
          {roadmap.progress === 0 && (
            <div className="text-center mb-6">
              <Button 
                size="lg" 
                onClick={handleStartLearning}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning Journey
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* React Flow Canvas */}
        <div className="flex-1 bg-gray-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-left"
            onNodeClick={(event, node) => setSelectedStep(node.id)}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        {/* Selected Step Details */}
        {selectedStepData && (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Step Details</h3>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedStepData.title}</h4>
                  <p className="text-sm text-gray-600">{selectedStepData.description}</p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedStepData.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{selectedStepData.resources.length} resources</span>
                  </div>
                </div>

                {selectedStepData.prerequisites.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Prerequisites</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedStepData.prerequisites.map((prereq, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Learning Resources</h5>
                  <div className="space-y-3">
                    {selectedStepData.resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex space-x-3">
                          <img 
                            src={resource.thumbnail} 
                            alt={resource.title}
                            className="w-20 h-15 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/80x60/cccccc/666666?text=Video';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h6 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                              {resource.title}
                            </h6>
                            <p className="text-xs text-gray-500 mb-1">{resource.channel}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{resource.duration}</span>
                              <span>•</span>
                              <span>{resource.views}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => handleToggleComplete(selectedStepData.id)}
                  className={`w-full ${
                    selectedStepData.completed 
                      ? 'bg-gray-500 hover:bg-gray-600' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {selectedStepData.completed ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Incomplete
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Complete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}