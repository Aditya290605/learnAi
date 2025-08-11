import { Node, Edge, Position } from 'reactflow';
import { RoadmapStep } from '../types';

interface RoadmapNodeData {
  label: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
}

export const generateRoadmapNodes = (steps: RoadmapStep[]) => {
  const nodes: Node<RoadmapNodeData>[] = [];
  const edges: Edge[] = [];

  // Create a grid layout for better visualization
  const cols = Math.ceil(Math.sqrt(steps.length));
  
  const nodeWidth = 200;
  const nodeHeight = 100;
  const horizontalSpacing = 300;
  const verticalSpacing = 150;

  steps.forEach((step, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const x = col * horizontalSpacing;
    const y = row * verticalSpacing;

    const node: Node<RoadmapNodeData> = {
      id: step.id,
      type: 'default',
      position: { x, y },
      data: {
        label: step.title,
        title: step.title,
        description: step.description,
        duration: step.duration,
        completed: step.completed
      },
      style: {
        background: step.completed ? '#10B981' : '#F3F4F6',
        color: step.completed ? 'white' : '#374151',
        border: step.completed ? '2px solid #059669' : '2px solid #D1D5DB',
        borderRadius: '12px',
        padding: '12px',
        width: nodeWidth,
        height: nodeHeight,
        fontSize: '14px',
        fontWeight: '500'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    };

    nodes.push(node);

    // Create edges based on prerequisites
    step.prerequisites.forEach(prereqId => {
      const prereqIndex = steps.findIndex(s => s.id === prereqId);
      if (prereqIndex !== -1) {
        const edge: Edge = {
          id: `${prereqId}-${step.id}`,
          source: prereqId,
          target: step.id,
          type: 'default',
          animated: !step.completed,
          style: {
            stroke: step.completed ? '#10B981' : '#6B7280',
            strokeWidth: 2
          },
          markerEnd: {
            type: 'arrowclosed',
            color: step.completed ? '#10B981' : '#6B7280'
          }
        };
        edges.push(edge);
      }
    });
  });

  return { nodes, edges };
};