import express from 'express';
import { body } from 'express-validator';
import {
  createRoadmap,
  getUserRoadmaps,
  getRoadmap,
  updateStepCompletion,
  generateAdditionalResources,
  deleteRoadmap,
  getRoadmapStats
} from '../controllers/roadmapController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateCreateRoadmap = [
  body('skill')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Skill must be between 2 and 50 characters'),
  body('currentLevel')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Current level must be between 2 and 100 characters'),
  body('targetOutcome')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Target outcome must be between 10 and 500 characters'),
  body('hoursPerWeek')
    .isInt({ min: 1, max: 168 })
    .withMessage('Hours per week must be between 1 and 168')
];

const validateStepUpdate = [
  body('completed')
    .isBoolean()
    .withMessage('Completed must be a boolean value')
];

// All routes are protected
router.use(protect);

// Roadmap routes
router.post('/', validateCreateRoadmap, createRoadmap);
router.get('/', getUserRoadmaps);
router.get('/stats', getRoadmapStats);
router.get('/:id', getRoadmap);
router.put('/:id/steps/:stepId', validateStepUpdate, updateStepCompletion);
router.post('/:id/steps/:stepId/resources', generateAdditionalResources);
router.delete('/:id', deleteRoadmap);

export default router;
