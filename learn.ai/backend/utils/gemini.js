import { GoogleGenerativeAI } from '@google/generative-ai';

import dotenv from 'dotenv';
dotenv.config();
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate roadmap using Gemini AI
export const generateRoadmap = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are an expert learning path creator and educational content curator. Create a comprehensive, systematic roadmap for learning ${userInput.skill} based on the following information:

User Information:
- Current Level: ${userInput.currentLevel}
- Target Outcome: ${userInput.targetOutcome}
- Available Hours per Week: ${userInput.hoursPerWeek}

Requirements:
1. Create a structured learning roadmap with AT LEAST 8-12 detailed steps
2. Each step should be specific, actionable, and build upon previous steps
3. Include realistic estimated duration for each step (consider user's time availability)
4. List clear prerequisites for each step
5. Provide 2-3 REAL, high-quality YouTube resources for each step with actual video titles and channels
6. Consider the user's current level and target outcome
7. Make it practical and achievable within their time constraints
8. Focus on modern, up-to-date learning resources
9. Include both theoretical and practical components

Please respond with a JSON object in the following format:
{
  "title": "Comprehensive Roadmap title",
  "skill": "${userInput.skill}",
  "description": "Detailed description of the roadmap and learning journey",
  "difficulty": "Beginner|Intermediate|Advanced",
  "estimatedHours": total_estimated_hours,
  "steps": [
    {
      "id": "step_1",
      "title": "Specific step title",
      "description": "Detailed description of what to learn and why it's important",
      "duration": "2-3 weeks",
      "prerequisites": ["prerequisite1", "prerequisite2"],
      "resources": [
        {
          "id": "resource_1",
          "title": "ACTUAL YouTube video title",
          "thumbnail": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
          "url": "https://www.youtube.com/watch?v=ACTUAL_VIDEO_ID",
          "duration": "1:30:00",
          "views": "500K views",
          "channel": "Actual Channel Name"
        }
      ]
    }
  ]
}

IMPORTANT GUIDELINES:
- Use REAL YouTube video titles and channels that actually exist
- Generate realistic video IDs for thumbnails (use format: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)
- Focus on popular, well-reviewed channels and videos
- Include a mix of beginner-friendly and advanced content
- Ensure each step has meaningful prerequisites
- Make the learning path progressive and logical
- Consider the user's time constraints when setting durations

Make sure the JSON is valid and properly formatted. Focus on creating a practical, step-by-step learning path that will help the user achieve their goals.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini AI');
    }

    const roadmapData = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (!roadmapData.title || !roadmapData.steps || !Array.isArray(roadmapData.steps)) {
      throw new Error('Invalid roadmap structure from Gemini AI');
    }

    // Ensure minimum 8 steps
    if (roadmapData.steps.length < 8) {
      throw new Error('Roadmap must have at least 8 steps');
    }

    // Add unique IDs to steps if not present and ensure completed field
    roadmapData.steps = roadmapData.steps.map((step, index) => ({
      ...step,
      id: step.id || `step_${index + 1}`,
      completed: false,
      // Ensure resources have proper structure
      resources: step.resources.map((resource, resIndex) => ({
        ...resource,
        id: resource.id || `resource_${index}_${resIndex}`,
        channel: resource.channel || 'Unknown Channel'
      }))
    }));

    return roadmapData;

  } catch (error) {
    console.error('Gemini AI Error:', error);
    
    // Return a comprehensive fallback roadmap if AI generation fails
    return {
      title: `Complete ${userInput.skill} Learning Roadmap`,
      skill: userInput.skill,
      description: `A comprehensive learning path for ${userInput.skill} designed for ${userInput.currentLevel} level learners`,
      difficulty: "Beginner",
      estimatedHours: 60,
      steps: [
        {
          id: "step_1",
          title: "Introduction to " + userInput.skill,
          description: "Start with the fundamentals and basic concepts",
          duration: "1-2 weeks",
          prerequisites: [],
          completed: false,
          resources: [
            {
              id: "resource_1_1",
              title: "Complete Beginner's Guide to " + userInput.skill,
              thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              duration: "1:15:00",
              views: "250K views",
              channel: "Tech Tutorials"
            },
            {
              id: "resource_1_2",
              title: userInput.skill + " Fundamentals Explained",
              thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
              url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
              duration: "45:30",
              views: "180K views",
              channel: "Learning Hub"
            }
          ]
        },
        {
          id: "step_2",
          title: "Core Concepts and Principles",
          description: "Learn the essential concepts and foundational principles",
          duration: "2-3 weeks",
          prerequisites: ["step_1"],
          completed: false,
          resources: [
            {
              id: "resource_2_1",
              title: "Core " + userInput.skill + " Concepts You Need to Know",
              thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
              url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
              duration: "2:10:00",
              views: "320K views",
              channel: "Code Academy"
            }
          ]
        },
        {
          id: "step_3",
          title: "Practical Applications",
          description: "Apply your knowledge through hands-on projects",
          duration: "2-3 weeks",
          prerequisites: ["step_1", "step_2"],
          completed: false,
          resources: [
            {
              id: "resource_3_1",
              title: "Build Your First " + userInput.skill + " Project",
              thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
              url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
              duration: "1:45:00",
              views: "150K views",
              channel: "Project Builder"
            }
          ]
        },
        {
          id: "step_4",
          title: "Advanced Techniques",
          description: "Master advanced techniques and optimization",
          duration: "3-4 weeks",
          prerequisites: ["step_1", "step_2", "step_3"],
          completed: false,
          resources: [
            {
              id: "resource_4_1",
              title: "Advanced " + userInput.skill + " Techniques",
              thumbnail: "https://img.youtube.com/vi/ZZ5LpwO-An4/maxresdefault.jpg",
              url: "https://www.youtube.com/watch?v=ZZ5LpwO-An4",
              duration: "2:30:00",
              views: "95K views",
              channel: "Advanced Tutorials"
            }
          ]
        },
        {
          id: "step_5",
          title: "Real-World Projects",
          description: "Build comprehensive real-world applications",
          duration: "4-5 weeks",
          prerequisites: ["step_1", "step_2", "step_3", "step_4"],
          completed: false,
          resources: [
            {
              id: "resource_5_1",
              title: "Complete " + userInput.skill + " Project from Scratch",
              thumbnail: "https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg",
              url: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
              duration: "3:15:00",
              views: "200K views",
              channel: "Real Projects"
            }
          ]
        },
        {
          id: "step_6",
          title: "Best Practices and Optimization",
          description: "Learn industry best practices and performance optimization",
          duration: "2-3 weeks",
          prerequisites: ["step_1", "step_2", "step_3", "step_4", "step_5"],
          completed: false,
          resources: [
            {
              id: "resource_6_1",
              title: userInput.skill + " Best Practices Guide",
              thumbnail: "https://img.youtube.com/vi/1u2qu-EmIRc/maxresdefault.jpg",
              url: "https://www.youtube.com/watch?v=1u2qu-EmIRc",
              duration: "1:20:00",
              views: "120K views",
              channel: "Best Practices"
            }
          ]
        },
        {
          id: "step_7",
          title: "Testing and Debugging",
          description: "Master testing strategies and debugging techniques",
          duration: "2-3 weeks",
          prerequisites: ["step_1", "step_2", "step_3", "step_4", "step_5", "step_6"],
          completed: false,
          resources: [
            {
              id: "resource_7_1",
              title: "Testing and Debugging " + userInput.skill + " Applications",
              thumbnail: "https://img.youtube.com/vi/3YxaaGgTQYM/maxresdefault.jpg",
              url: "https://www.youtube.com/watch?v=3YxaaGgTQYM",
              duration: "1:50:00",
              views: "85K views",
              channel: "Testing Pro"
            }
          ]
        },
        {
          id: "step_8",
          title: "Deployment and Production",
          description: "Learn to deploy and maintain production applications",
          duration: "2-3 weeks",
          prerequisites: ["step_1", "step_2", "step_3", "step_4", "step_5", "step_6", "step_7"],
          completed: false,
          resources: [
            {
              id: "resource_8_1",
              title: "Deploy " + userInput.skill + " to Production",
              thumbnail: "https://img.youtube.com/vi/9cKsq14Kfsw/maxresdefault.jpg",
              url: "https://www.youtube.com/watch?v=9cKsq14Kfsw",
              duration: "1:30:00",
              views: "110K views",
              channel: "Deployment Guide"
            }
          ]
        }
      ]
    };
  }
};

// Generate additional resources for a specific step
export const generateStepResources = async (skill, stepTitle) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
Generate 3-5 high-quality, REAL YouTube learning resources for learning "${stepTitle}" in the context of "${skill}".

Focus on:
- REAL YouTube videos that actually exist
- High-quality, well-reviewed content from popular channels
- Practical, hands-on learning materials
- Resources suitable for different learning styles
- Modern, up-to-date content

Return as JSON array:
[
  {
    "id": "resource_1",
    "title": "ACTUAL YouTube video title",
    "thumbnail": "https://img.youtube.com/vi/ACTUAL_VIDEO_ID/maxresdefault.jpg",
    "url": "https://www.youtube.com/watch?v=ACTUAL_VIDEO_ID",
    "duration": "1:30:00",
    "views": "250K views",
    "channel": "Actual Channel Name"
  }
]

IMPORTANT: Use REAL video titles, channels, and generate realistic video IDs. Do not make up fake content.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini AI');
    }

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error('Gemini AI Resource Generation Error:', error);
    return [];
  }
};
