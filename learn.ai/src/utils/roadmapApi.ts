import { AUTH_TOKEN_KEY } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface CreateRoadmapForm {
  skill: string;
  currentLevel: string;
  targetOutcome: string;
  hoursPerWeek: number;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  prerequisites: string[];
  completed: boolean;
  resources: YoutubeVideo[];
}

export interface Roadmap {
  _id: string;
  user: string;
  title: string;
  skill: string;
  description: string;
  progress: number;
  totalSteps: number;
  completedSteps: number;
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: RoadmapStep[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  aiGenerated: boolean;
}

export interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  views: string;
  channel: string;
}

export interface RoadmapStats {
  totalRoadmaps: number;
  totalSteps: number;
  completedSteps: number;
  averageProgress: number;
  totalHours: number;
}

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error');
  }
};

// Create new roadmap using Gemini AI
export const createRoadmap = async (formData: CreateRoadmapForm): Promise<{ roadmap: Roadmap }> => {
  const response = await apiRequest('/roadmaps', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return response.data;
};

// Get all roadmaps for current user
export const getUserRoadmaps = async (): Promise<{ roadmaps: Roadmap[] }> => {
  const response = await apiRequest('/roadmaps');
  return response.data;
};

// Get single roadmap by ID
export const getRoadmap = async (id: string): Promise<{ roadmap: Roadmap }> => {
  const response = await apiRequest(`/roadmaps/${id}`);
  return response.data;
};

// Update step completion
export const updateStepCompletion = async (
  roadmapId: string, 
  stepId: string, 
  completed: boolean
): Promise<{ roadmap: Roadmap }> => {
  const response = await apiRequest(`/roadmaps/${roadmapId}/steps/${stepId}`, {
    method: 'PUT',
    body: JSON.stringify({ completed }),
  });
  return response.data;
};

// Generate additional resources for a step
export const generateAdditionalResources = async (
  roadmapId: string, 
  stepId: string
): Promise<{ resources: YoutubeVideo[] }> => {
  const response = await apiRequest(`/roadmaps/${roadmapId}/steps/${stepId}/resources`, {
    method: 'POST',
  });
  return response.data;
};

// Delete roadmap
export const deleteRoadmap = async (id: string): Promise<void> => {
  await apiRequest(`/roadmaps/${id}`, {
    method: 'DELETE',
  });
};

// Get roadmap statistics
export const getRoadmapStats = async (): Promise<{ stats: RoadmapStats }> => {
  const response = await apiRequest('/roadmaps/stats');
  return response.data;
};
