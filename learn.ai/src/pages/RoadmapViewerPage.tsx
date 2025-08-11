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
import { ArrowLeft, CheckCircle, Circle, Play, ExternalLink, Loader2, BookOpen, Clock, Users, Star, ZoomIn, ZoomOut, RotateCcw, Sparkles, Target, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getRoadmap, updateStepCompletion, generateAdditionalResources, Roadmap, YoutubeVideo } from '../utils/roadmapApi';

// Custom node component for roadmap steps
const RoadmapNode = ({ data }: { data: any }) => {
  const { step, onToggleComplete, onGenerateResources, generatingResources, isActive } = data;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`bg-white border-2 rounded-2xl p-6 shadow-lg w-full max-w-none transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 ${
        step.completed 
          ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 shadow-emerald-200' 
          : isActive 
            ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-blue-200 shadow-2xl ring-2 ring-blue-200 ring-opacity-50' 
            : 'border-slate-200 hover:border-slate-300 hover:shadow-slate-300 bg-gradient-to-br from-white to-slate-50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-700 ${
        step.completed 
          ? 'bg-gradient-to-br from-emerald-100/40 to-green-100/40' 
          : isActive 
            ? 'bg-gradient-to-br from-blue-100/40 to-indigo-100/40'
            : 'bg-gradient-to-br from-slate-100/40 to-gray-100/40'
      } ${isHovered ? 'opacity-100' : ''}`}></div>

      {/* Sparkle Animation for Active Step */}
      {isActive && (
        <div className="absolute top-4 right-4">
          <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
        </div>
      )}

      {/* Completion Badge */}
      {step.completed && (
        <div className="absolute top-4 right-4">
          <Award className="w-6 h-6 text-emerald-500 animate-bounce" />
        </div>
      )}

      {/* Horizontal connector points with glow effect */}
      <div className={`absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full border-3 transition-all duration-300 ${
        step.completed 
          ? 'bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-300' 
          : isActive 
            ? 'bg-blue-500 border-blue-300 shadow-lg shadow-blue-300 animate-pulse'
            : 'bg-white border-slate-300'
      }`}></div>
      <div className={`absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full border-3 transition-all duration-300 ${
        step.completed 
          ? 'bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-300' 
          : isActive 
            ? 'bg-blue-500 border-blue-300 shadow-lg shadow-blue-300'
            : 'bg-white border-slate-300'
      }`}></div>
      
      {/* Step Header with Enhanced Design */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-300 ${
            step.completed 
              ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-300' 
              : isActive
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-300'
                : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600 group-hover:from-slate-300 group-hover:to-slate-400'
          }`}>
            {step.completed ? (
              <CheckCircle className="w-7 h-7 animate-scale-in" />
            ) : (
              step.id.replace('step_', '')
            )}
            
            {/* Progress Ring Animation */}
            {isActive && !step.completed && (
              <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-ping opacity-75"></div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-slate-500">
            <div className="flex items-center space-x-1 bg-slate-100 rounded-full px-3 py-1">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{step.duration}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className={`text-xl font-bold transition-all duration-300 ${
            step.completed ? 'text-slate-500 line-through' : 'text-slate-800 group-hover:text-slate-900'
          }`}>
            {step.title}
          </h3>
          <p className={`text-sm leading-relaxed transition-colors duration-300 ${
            step.completed ? 'text-slate-400 line-through' : 'text-slate-600'
          }`}>
            {step.description}
          </p>
        </div>

        {/* Enhanced Status Badge */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              step.completed 
                ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200' 
                : isActive
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200'
                  : 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200'
            }`}>
              {step.completed ? '✨ Completed' : isActive ? '🚀 In Progress' : '⏳ Pending'}
            </span>
          </div>
          
          {isActive && !step.completed && (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-xs text-blue-600 font-semibold">Current</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Prerequisites Section */}
      {step.prerequisites.length > 0 && (
        <div className="relative z-10 mb-5">
          <div className="flex items-center mb-3">
            <Target className="w-4 h-4 mr-2 text-blue-500" />
            <p className="text-sm font-semibold text-slate-700">
              Prerequisites ({step.prerequisites.length})
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {step.prerequisites.slice(0, 2).map((prereq: string, index: number) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200 transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {prereq}
              </span>
            ))}
            {step.prerequisites.length > 2 && (
              <span className="text-xs text-slate-500 font-medium px-2 py-1">
                +{step.prerequisites.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Resources Section */}
      {step.resources && step.resources.length > 0 && (
        <div className="relative z-10 mb-6">
          <div className="flex items-center mb-3">
            <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
            <p className="text-sm font-semibold text-slate-700">
              Resources ({step.resources.length})
            </p>
          </div>
          <div className="space-y-3">
            {step.resources.slice(0, 2).map((resource: YoutubeVideo, index: number) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/resource flex items-center space-x-3 p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 border border-slate-200 hover:border-purple-200 hover:shadow-md hover:scale-[1.02]"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative">
                  <img 
                    src={resource.thumbnail} 
                    alt={resource.title}
                    className="w-16 h-12 object-cover rounded-lg shadow-sm group-hover/resource:shadow-md transition-shadow duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/64x48/e2e8f0/64748b?text=Video';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 rounded-lg"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 font-medium text-sm line-clamp-2 group-hover/resource:text-purple-700 transition-colors duration-300">
                    {resource.title}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">{resource.channel}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover/resource:text-purple-500 transition-colors duration-300 flex-shrink-0" />
              </a>
            ))}
            {step.resources.length > 2 && (
              <div className="text-center py-2">
                <span className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                  +{step.resources.length - 2} more resources
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Action Buttons */}
      <div className="relative z-10 flex flex-col space-y-3 pt-5 border-t border-slate-200">
        <button
          onClick={() => onToggleComplete(step.id)}
          className={`group/btn w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            step.completed
              ? 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-600 hover:from-slate-200 hover:to-gray-200 border border-slate-200'
              : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-200 hover:shadow-emerald-300'
          }`}
        >
          <span className="flex items-center justify-center space-x-2">
            {step.completed ? (
              <>
                <Circle className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-300" />
                <span>Mark Incomplete</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                <span>Mark Complete</span>
              </>
            )}
          </span>
        </button>

        <button
          onClick={() => onGenerateResources(step.id)}
          disabled={generatingResources === step.id}
          className="group/btn w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-purple-200 hover:shadow-purple-300 transform hover:scale-105 active:scale-95"
        >
          {generatingResources === step.id ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
              <span>More Resources</span>
            </div>
          )}
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none ${
        step.completed 
          ? 'bg-gradient-to-br from-emerald-400/20 to-green-400/20' 
          : isActive 
            ? 'bg-gradient-to-br from-blue-400/20 to-indigo-400/20'
            : 'bg-gradient-to-br from-slate-400/20 to-gray-400/20'
      } ${isHovered ? 'opacity-100' : ''}`}></div>
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
    const cardWidth = 360;
    const horizontalSpacing = 420;
    
    const newNodes: Node[] = roadmapData.steps.map((step, index) => {
      const isActive = !step.completed && (index === 0 || roadmapData.steps[index - 1].completed);
      
      return {
        id: step.id,
        type: 'roadmapNode',
        position: { 
          x: index * horizontalSpacing + 60,
          y: 120
        },
        data: {
          step,
          onToggleComplete: handleToggleComplete,
          onGenerateResources: handleGenerateResources,
          generatingResources,
          isActive
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          width: `${cardWidth}px`,
          minWidth: `${cardWidth}px`
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
        type: 'smoothstep',
        style: { 
          stroke: isCompleted ? '#10B981' : '#64748B', 
          strokeWidth: isCompleted ? 4 : 3,
          filter: isCompleted ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))' : 'none'
        },
        animated: isCompleted,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 24,
          height: 24,
          color: isCompleted ? '#10B981' : '#64748B'
        },
        label: isCompleted ? '✨' : '',
        labelStyle: { 
          fill: isCompleted ? '#10B981' : '#64748B', 
          fontWeight: 'bold',
          fontSize: '16px'
        },
        labelBgStyle: { 
          fill: '#ffffff', 
          fillOpacity: 0.95,
          stroke: isCompleted ? '#10B981' : '#64748B',
          strokeWidth: 1
        },
        labelBgPadding: [6, 8],
        labelBgBorderRadius: 8
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
      
      setNodes(prev => prev.map(node => {
        if (node.id === stepId) {
          const updatedStep = response.roadmap.steps.find(s => s.id === stepId);
          const stepIndex = response.roadmap.steps.findIndex(s => s.id === stepId);
          const isActive = !updatedStep.completed && (stepIndex === 0 || response.roadmap.steps[stepIndex - 1].completed);
          
          return {
            ...node,
            data: {
              ...node.data,
              step: updatedStep,
              isActive
            }
          };
        }
        
        const nodeStep = response.roadmap.steps.find(s => s.id === node.id);
        const nodeIndex = response.roadmap.steps.findIndex(s => s.id === node.id);
        const nodeIsActive = !nodeStep.completed && (nodeIndex === 0 || response.roadmap.steps[nodeIndex - 1].completed);
        
        return {
          ...node,
          data: {
            ...node.data,
            isActive: nodeIsActive
          }
        };
      }));

      setEdges(prev => prev.map(edge => {
        if (edge.source === stepId) {
          const updatedSourceStep = response.roadmap.steps.find(s => s.id === stepId);
          const isCompleted = updatedSourceStep.completed;
          return {
            ...edge,
            style: { 
              stroke: isCompleted ? '#10B981' : '#64748B', 
              strokeWidth: isCompleted ? 4 : 3,
              filter: isCompleted ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))' : 'none'
            },
            animated: isCompleted,
            label: isCompleted ? '✨' : '',
            labelStyle: { 
              fill: isCompleted ? '#10B981' : '#64748B', 
              fontWeight: 'bold',
              fontSize: '16px'
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 24,
              height: 24,
              color: isCompleted ? '#10B981' : '#64748B'
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
      
      const updatedRoadmap = {
        ...roadmap,
        steps: roadmap.steps.map(step => 
          step.id === stepId 
            ? { ...step, resources: [...step.resources, ...response.resources] }
            : step
        )
      };
      
      setRoadmap(updatedRoadmap);
      
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
    const firstIncompleteStep = roadmap?.steps.find(step => !step.completed);
    if (firstIncompleteStep) {
      setSelectedStep(firstIncompleteStep.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-300 animate-pulse">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl mx-auto animate-ping opacity-20"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-300">
            <span className="text-white font-bold text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Roadmap not found</h2>
          <p className="text-slate-600 mb-6">The roadmap you're looking for doesn't exist or has been deleted.</p>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const selectedStepData = roadmap.steps.find(step => step.id === selectedStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => navigate('/dashboard')}
                className="group flex items-center text-slate-600 hover:text-slate-900 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {roadmap.title}
                </h1>
                <p className="text-slate-600 mt-1">{roadmap.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Progress</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {roadmap.progress}%
                </p>
              </div>
              <div className="w-32">
                <ProgressBar value={roadmap.progress} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Roadmap Info Cards */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 transform hover:scale-105">
              <div className="text-center p-6">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <p className="text-sm text-slate-600 font-medium">Total Steps</p>
                <p className="text-3xl font-bold text-blue-600">{roadmap.totalSteps}</p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 transform hover:scale-105">
              <div className="text-center p-6">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-sm text-slate-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-emerald-600">{roadmap.completedSteps}</p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 transform hover:scale-105">
              <div className="text-center p-6">
                <Star className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <p className="text-sm text-slate-600 font-medium">Difficulty</p>
                <p className="text-3xl font-bold text-purple-600">{roadmap.difficulty}</p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 transform hover:scale-105">
              <div className="text-center p-6">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-sm text-slate-600 font-medium">Est. Hours</p>
                <p className="text-3xl font-bold text-orange-600">{roadmap.estimatedHours}h</p>
              </div>
            </Card>
          </div>

          {/* Enhanced Start Learning Button */}
          {roadmap.progress === 0 && (
            <div className="text-center mb-8">
              <Button 
                size="lg" 
                onClick={handleStartLearning}
                className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 px-8 py-4 text-lg font-semibold shadow-2xl shadow-blue-300 hover:shadow-blue-400 transform hover:scale-110 transition-all duration-300"
              >
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span>Start Learning Journey</span>
                <Sparkles className="w-5 h-5 ml-3 group-hover:rotate-12 transition-transform duration-300" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-280px)]">
        {/* Enhanced React Flow Canvas */}
        <div className="flex-1 bg-gradient-to-br from-white/50 to-slate-100/30 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2, minZoom: 0.4, maxZoom: 1 }}
            attributionPosition="bottom-left"
            onNodeClick={(event, node) => setSelectedStep(node.id)}
            onInit={setReactFlowInstance}
            defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
            minZoom={0.2}
            maxZoom={1.2}
            className="bg-transparent"
          >
            <Background 
              color="#cbd5e1" 
              gap={40} 
              size={2}
              className="opacity-20"
              variant="dots"
            />
            <Controls 
              className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 [&>button]:hover:bg-slate-100 [&>button]:transition-colors [&>button]:duration-300"
              showZoom={true}
              showFitView={true}
              showInteractive={false}
            />
            
            {/* Enhanced Custom Panel for Flow Controls */}
            <Panel position="top-right" className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 p-3">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    if (reactFlowInstance) {
                      reactFlowInstance.fitView({ padding: 0.2 });
                    }
                  }}
                  className="group p-3 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110"
                  title="Fit View"
                >
                  <ZoomIn className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
                </button>
                <button
                  onClick={() => {
                    if (reactFlowInstance) {
                      reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 0.6 });
                    }
                  }}
                  className="group p-3 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110"
                  title="Reset View"
                >
                  <RotateCcw className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
                </button>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Enhanced Selected Step Details */}
        {selectedStepData && (
          <div className="w-96 bg-white/95 backdrop-blur-lg border-l border-slate-200 overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Step Details
                </h3>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="group p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-300"
                >
                  <span className="text-xl group-hover:rotate-90 transition-transform duration-300">×</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">{selectedStepData.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedStepData.description}</p>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 border border-blue-200">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-blue-700">{selectedStepData.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-purple-50 rounded-full px-4 py-2 border border-purple-200">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <span className="font-medium text-purple-700">{selectedStepData.resources.length} resources</span>
                  </div>
                </div>

                {selectedStepData.prerequisites.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
                    <h5 className="font-bold text-slate-900 mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-500" />
                      Prerequisites
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedStepData.prerequisites.map((prereq, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors duration-300"
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200">
                  <h5 className="font-bold text-slate-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                    Learning Resources
                  </h5>
                  <div className="space-y-3">
                    {selectedStepData.resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block p-4 border border-purple-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                      >
                        <div className="flex space-x-4">
                          <div className="relative">
                            <img 
                              src={resource.thumbnail} 
                              alt={resource.title}
                              className="w-20 h-15 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/80x60/e2e8f0/64748b?text=Video';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/30 rounded-lg"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-2 group-hover:text-purple-700 transition-colors duration-300">
                              {resource.title}
                            </h6>
                            <p className="text-xs text-slate-500 mb-2 font-medium">{resource.channel}</p>
                            <div className="flex items-center space-x-3 text-xs text-slate-400">
                              <span className="bg-slate-100 px-2 py-1 rounded-full">{resource.duration}</span>
                              <span className="bg-slate-100 px-2 py-1 rounded-full">{resource.views}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-purple-500 transition-colors duration-300 flex-shrink-0 mt-1" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => handleToggleComplete(selectedStepData.id)}
                  className={`w-full py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                    selectedStepData.completed 
                      ? 'bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 shadow-slate-300' 
                      : 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 shadow-emerald-300'
                  }`}
                >
                  {selectedStepData.completed ? (
                    <>
                      <Circle className="w-5 h-5 mr-3" />
                      Mark as Incomplete
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-3" />
                      Mark as Complete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}