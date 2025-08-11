import Roadmap from '../models/Roadmap.js';
import { generateRoadmap, generateStepResources } from '../utils/gemini.js';

// Helper function to send success response
const sendSuccessResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Helper function to send error response
const sendErrorResponse = (res, message = 'Error occurred', statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    message
  });
};

// @desc    Create new roadmap using Gemini AI
// @route   POST /api/roadmaps
// @access  Private
export const createRoadmap = async (req, res) => {
  try {
    const { skill, currentLevel, targetOutcome, hoursPerWeek } = req.body;

    // Validate required fields
    if (!skill || !currentLevel || !targetOutcome || !hoursPerWeek) {
      return sendErrorResponse(res, 'All fields are required', 400);
    }

    // Generate roadmap using Gemini AI
    const aiRoadmap = await generateRoadmap({
      skill,
      currentLevel,
      targetOutcome,
      hoursPerWeek: parseInt(hoursPerWeek)
    });

    // Create roadmap in database
    const roadmap = await Roadmap.create({
      user: req.user.id,
      title: aiRoadmap.title,
      skill: aiRoadmap.skill,
      description: aiRoadmap.description,
      difficulty: aiRoadmap.difficulty,
      estimatedHours: aiRoadmap.estimatedHours,
      steps: aiRoadmap.steps,
      aiGenerated: true
    });

    sendSuccessResponse(res, {
      roadmap: roadmap.toObject()
    }, 'Roadmap created successfully', 201);

  } catch (error) {
    console.error('Create roadmap error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    sendErrorResponse(res, 'Failed to create roadmap', 500);
  }
};

// @desc    Get all roadmaps for current user
// @route   GET /api/roadmaps
// @access  Private
export const getUserRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.findByUser(req.user.id);

    sendSuccessResponse(res, {
      roadmaps: roadmaps.map(roadmap => roadmap.toObject())
    }, 'Roadmaps retrieved successfully');

  } catch (error) {
    console.error('Get roadmaps error:', error);
    sendErrorResponse(res, 'Failed to retrieve roadmaps', 500);
  }
};

// @desc    Get single roadmap by ID
// @route   GET /api/roadmaps/:id
// @access  Private
export const getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      user: req.user.id,
      isActive: true
    });

    if (!roadmap) {
      return sendErrorResponse(res, 'Roadmap not found', 404);
    }

    sendSuccessResponse(res, {
      roadmap: roadmap.toObject()
    }, 'Roadmap retrieved successfully');

  } catch (error) {
    console.error('Get roadmap error:', error);
    sendErrorResponse(res, 'Failed to retrieve roadmap', 500);
  }
};

// @desc    Update roadmap step completion
// @route   PUT /api/roadmaps/:id/steps/:stepId
// @access  Private
export const updateStepCompletion = async (req, res) => {
  try {
    const { completed } = req.body;
    const { id: roadmapId, stepId } = req.params;

    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      user: req.user.id,
      isActive: true
    });

    if (!roadmap) {
      return sendErrorResponse(res, 'Roadmap not found', 404);
    }

    // Update step completion
    if (completed) {
      await roadmap.markStepCompleted(stepId);
    } else {
      await roadmap.markStepIncomplete(stepId);
    }

    // Refresh roadmap data
    await roadmap.save();

    sendSuccessResponse(res, {
      roadmap: roadmap.toObject()
    }, 'Step updated successfully');

  } catch (error) {
    console.error('Update step error:', error);
    
    if (error.message === 'Step not found') {
      return sendErrorResponse(res, 'Step not found', 404);
    }
    
    sendErrorResponse(res, 'Failed to update step', 500);
  }
};

// @desc    Generate additional resources for a step
// @route   POST /api/roadmaps/:id/steps/:stepId/resources
// @access  Private
export const generateAdditionalResources = async (req, res) => {
  try {
    const { id: roadmapId, stepId } = req.params;

    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      user: req.user.id,
      isActive: true
    });

    if (!roadmap) {
      return sendErrorResponse(res, 'Roadmap not found', 404);
    }

    const step = roadmap.steps.find(s => s.id === stepId);
    if (!step) {
      return sendErrorResponse(res, 'Step not found', 404);
    }

    // Generate additional resources using Gemini AI
    const additionalResources = await generateStepResources(roadmap.skill, step.title);

    sendSuccessResponse(res, {
      resources: additionalResources
    }, 'Additional resources generated successfully');

  } catch (error) {
    console.error('Generate resources error:', error);
    sendErrorResponse(res, 'Failed to generate additional resources', 500);
  }
};

// @desc    Delete roadmap
// @route   DELETE /api/roadmaps/:id
// @access  Private
export const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      user: req.user.id,
      isActive: true
    });

    if (!roadmap) {
      return sendErrorResponse(res, 'Roadmap not found', 404);
    }

    // Soft delete by setting isActive to false
    roadmap.isActive = false;
    await roadmap.save();

    sendSuccessResponse(res, null, 'Roadmap deleted successfully');

  } catch (error) {
    console.error('Delete roadmap error:', error);
    sendErrorResponse(res, 'Failed to delete roadmap', 500);
  }
};

// @desc    Get roadmap statistics for dashboard
// @route   GET /api/roadmaps/stats
// @access  Private
export const getRoadmapStats = async (req, res) => {
  try {
    const roadmaps = await Roadmap.findByUser(req.user.id);

    const stats = {
      totalRoadmaps: roadmaps.length,
      totalSteps: roadmaps.reduce((acc, roadmap) => acc + roadmap.totalSteps, 0),
      completedSteps: roadmaps.reduce((acc, roadmap) => acc + roadmap.completedSteps, 0),
      averageProgress: roadmaps.length > 0 
        ? Math.round(roadmaps.reduce((acc, roadmap) => acc + roadmap.progress, 0) / roadmaps.length)
        : 0,
      totalHours: roadmaps.reduce((acc, roadmap) => acc + roadmap.estimatedHours, 0)
    };

    sendSuccessResponse(res, {
      stats
    }, 'Statistics retrieved successfully');

  } catch (error) {
    console.error('Get stats error:', error);
    sendErrorResponse(res, 'Failed to retrieve statistics', 500);
  }
};
