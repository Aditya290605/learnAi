import { Roadmap, RoadmapStep, YoutubeVideo } from '../types';

const mockVideos: YoutubeVideo[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals - Variables and Data Types',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=300&h=200',
    url: 'https://youtube.com/watch?v=hdI2bqOjy3c',
    duration: '15:32',
    views: '2.1M'
  },
  {
    id: '2',
    title: 'Functions and Scope in JavaScript',
    thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?w=300&h=200',
    url: 'https://youtube.com/watch?v=iLWTnMzWtj4',
    duration: '22:45',
    views: '1.8M'
  },
  {
    id: '3',
    title: 'Async JavaScript - Promises and Async/Await',
    thumbnail: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?w=300&h=200',
    url: 'https://youtube.com/watch?v=PoRJizFvM7s',
    duration: '28:15',
    views: '3.2M'
  }
];

const mockSteps: RoadmapStep[] = [
  {
    id: 'step-1',
    title: 'JavaScript Fundamentals',
    description: 'Learn the core concepts of JavaScript including variables, data types, and basic syntax.',
    duration: '2 weeks',
    prerequisites: [],
    completed: true,
    resources: mockVideos.slice(0, 2)
  },
  {
    id: 'step-2',
    title: 'DOM Manipulation',
    description: 'Master DOM manipulation techniques and event handling.',
    duration: '1 week',
    prerequisites: ['step-1'],
    completed: true,
    resources: mockVideos.slice(1, 3)
  },
  {
    id: 'step-3',
    title: 'Async JavaScript',
    description: 'Understand promises, async/await, and handling asynchronous operations.',
    duration: '2 weeks',
    prerequisites: ['step-1', 'step-2'],
    completed: false,
    resources: mockVideos
  },
  {
    id: 'step-4',
    title: 'React Fundamentals',
    description: 'Build your first React applications with components, props, and state.',
    duration: '3 weeks',
    prerequisites: ['step-3'],
    completed: false,
    resources: mockVideos.slice(0, 2)
  },
  {
    id: 'step-5',
    title: 'Advanced React',
    description: 'Learn hooks, context, and advanced React patterns.',
    duration: '2 weeks',
    prerequisites: ['step-4'],
    completed: false,
    resources: mockVideos.slice(1)
  }
];

export const mockRoadmaps: Roadmap[] = [
  {
    id: '1',
    title: 'Full Stack Web Development',
    skill: 'Web Development',
    description: 'Complete roadmap to become a full stack web developer',
    progress: 40,
    totalSteps: 5,
    completedSteps: 2,
    estimatedHours: 120,
    difficulty: 'Intermediate',
    steps: mockSteps,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Data Science with Python',
    skill: 'Data Science',
    description: 'Learn data analysis, visualization, and machine learning',
    progress: 75,
    totalSteps: 4,
    completedSteps: 3,
    estimatedHours: 80,
    difficulty: 'Advanced',
    steps: mockSteps.slice(0, 4),
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Mobile App Development',
    skill: 'React Native',
    description: 'Build cross-platform mobile applications',
    progress: 20,
    totalSteps: 6,
    completedSteps: 1,
    estimatedHours: 150,
    difficulty: 'Beginner',
    steps: [...mockSteps, { ...mockSteps[0], id: 'step-6' }],
    createdAt: '2024-01-20'
  }
];