export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
  id: string;
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
}

export interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  views: string;
}

export interface CreateRoadmapForm {
  skill: string;
  currentLevel: string;
  targetOutcome: string;
  hoursPerWeek: number;
}