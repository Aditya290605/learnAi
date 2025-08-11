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
  Position,
  MarkerType,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArrowLeft, CheckCircle, Circle, Play, ExternalLink, Loader2, BookOpen, Clock, Users, Star, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getRoadmap, updateStepCompletion, generateAdditionalResources, Roadmap, YoutubeVideo } from '../utils/roadmapApi';

// Custom node component for roadmap steps
const RoadmapNode = ({ data }: { data: any }) => {
  const { step, onToggleComplete, onGenerateResources, generatingResources, isActive } = data;
  
  return (
    <div className={`bg-white border-2 rounded-xl p-4 shadow-lg w-full max-w-none transition-all duration-300 relative ${
      step.completed 
        ? 'border-green-500 bg-green-50 shadow-green-200' 
        : isActive 
          ? 'border-blue-500 bg-blue-50 shadow-blue-200 shadow-xl' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
    }`}>
      {/* Flowchart connector points */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
      
      {/* Step Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
            step.completed 
              ? 'bg-green-500 text-white' 
              : isActive
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600'
          }`}>
            {step.id.replace('step_', '')}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${step.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {step.title}
            </h3>
            <p className={`text-sm text-gray-600 ${step.completed ? 'line-through' : ''}`}>
              {step.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{step.duration}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            step.completed 
              ? 'bg-green-100 text-green-700' 
              : isActive
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
          }`}>
            {step.completed ? '✓ Completed' : isActive ? '🔄 In Progress' : '⏳ Pending'}
          </span>
          {isActive && !step.completed && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-600 font-medium">Current</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prerequisites */}
        {step.prerequisites.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Prerequisites ({step.prerequisites.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {step.prerequisites.map((prereq: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                  {prereq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        {step.resources && step.resources.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Learning Resources ({step.resources.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {step.resources.slice(0, 4).map((resource: YoutubeVideo) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <img 
                    src={resource.thumbnail} 
                    alt={resource.title}
                    className="w-16 h-12 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/80x60/cccccc/666666?text=Video';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm line-clamp-2">{resource.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{resource.channel}</p>
                    <p className="text-gray-400 text-xs">{resource.duration} • {resource.views}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </a>
              ))}
              {step.resources.length > 4 && (
                <div className="col-span-full text-center py-2">
                  <span className="text-sm text-gray-500">+{step.resources.length - 4} more resources</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => onToggleComplete(step.id)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            step.completed
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
          }`}
        >
          {step.completed ? '✓ Mark Incomplete' : '✓ Mark Complete'}
        </button>

        <button
          onClick={() => onGenerateResources(step.id)}
          disabled={generatingResources === step.id}
          className="px-4 py-2 bg-purple-50 text-purple-600 text-sm rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50 border border-purple-200"
        >
          {generatingResources === step.id ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </div>
          ) : (
            '🔍 Generate More Resources'
          )}
        </button>
      </div>
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
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

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
    // Create a clean vertical layout with proper spacing
    const newNodes: Node[] = roadmapData.steps.map((step, index) => {
      const isActive = !step.completed && (index === 0 || roadmapData.steps[index - 1].completed);
      
      return {
        id: step.id,
        type: 'roadmapNode',
        position: { 
          x: 200, // Center horizontally
          y: index * 250 + 50 // Proper vertical spacing to prevent overlap
        },
        data: {
          step,
          onToggleComplete: handleToggleComplete,
          onGenerateResources: handleGenerateResources,
          generatingResources,
          isActive
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        style: {
          filter: step.completed ? 'grayscale(0.3)' : 'none',
          width: '500px',
          minWidth: '450px'
        }
      };
    });

    const newEdges: Edge[] = roadmapData.steps.slice(1).map((step, index) => {
      const sourceStep = roadmapData.steps[index];
      const isCompleted = sourceStep.completed;
      
      return {
        id: `edge-${index}`,
        source: sourceStep.id,
        target: step.id,
        type: 'straight', // Use straight lines for clean connections
        style: { 
          stroke: isCompleted ? '#10B981' : '#000000', 
          strokeWidth: isCompleted ? 3 : 2
        },
        animated: isCompleted,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: isCompleted ? '#10B981' : '#000000'
        },
        label: isCompleted ? '✓' : '',
        labelStyle: { 
          fill: isCompleted ? '#10B981' : '#000000', 
          fontWeight: 'bold',
          fontSize: '14px'
        },
        labelBgStyle: { 
          fill: '#ffffff', 
          fillOpacity: 0.9 
        },
        labelBgPadding: [4, 4],
        labelBgBorderRadius: 4
      };
    });

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
            },
            style: {
              filter: !step.completed ? 'grayscale(0.3)' : 'none'
            }
          };
        }
        return node;
      }));

      // Update edges to show completion
      setEdges(prev => prev.map(edge => {
        if (edge.source === stepId) {
          const isCompleted = !step.completed;
          const stepIndex = roadmap.steps.findIndex(s => s.id === stepId);
          return {
            ...edge,
            style: { 
              stroke: isCompleted ? '#10B981' : '#000000', 
              strokeWidth: isCompleted ? 3 : 2
            },
            animated: isCompleted,
            label: isCompleted ? '✓' : '',
            labelStyle: { 
              fill: isCompleted ? '#10B981' : '#000000', 
              fontWeight: 'bold',
              fontSize: '14px'
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: isCompleted ? '#10B981' : '#000000'
            }
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
        <div className="flex-1 bg-white relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            attributionPosition="bottom-left"
            onNodeClick={(event, node) => setSelectedStep(node.id)}
            onInit={setReactFlowInstance}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            minZoom={0.3}
            maxZoom={1.5}
            className="bg-transparent"
          >
            <Background 
              color="#e5e7eb" 
              gap={30} 
              size={1}
              className="opacity-30"
            />
            <Controls 
              className="bg-white rounded-lg shadow-lg border border-gray-200"
              showZoom={true}
              showFitView={true}
              showInteractive={false}
            />
            
            {/* Custom Panel for Flow Controls */}
            <Panel position="top-right" className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (reactFlowInstance) {
                      reactFlowInstance.fitView({ padding: 0.3 });
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Fit View"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (reactFlowInstance) {
                      reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </Panel>
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