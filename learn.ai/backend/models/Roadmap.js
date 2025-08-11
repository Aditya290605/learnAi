import mongoose from 'mongoose';

const roadmapStepSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true
  },
  prerequisites: [{
    type: String,
    trim: true
  }],
  completed: {
    type: Boolean,
    default: false
  },
  resources: [{
    id: String,
    title: String,
    thumbnail: String,
    url: String,
    duration: String,
    views: String
  }]
});

const roadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  skill: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  estimatedHours: {
    type: Number,
    required: true,
    min: [1, 'Estimated hours must be at least 1']
  },
  steps: [roadmapStepSchema],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedSteps: {
    type: Number,
    default: 0
  },
  totalSteps: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  aiGenerated: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating progress
roadmapSchema.virtual('calculatedProgress').get(function() {
  if (this.totalSteps === 0) return 0;
  return Math.round((this.completedSteps / this.totalSteps) * 100);
});

// Virtual for calculating completed steps
roadmapSchema.virtual('calculatedCompletedSteps').get(function() {
  return this.steps.filter(step => step.completed).length;
});

// Virtual for calculating total steps
roadmapSchema.virtual('calculatedTotalSteps').get(function() {
  return this.steps.length;
});

// Pre-save middleware to update calculated fields
roadmapSchema.pre('save', function(next) {
  this.completedSteps = this.calculatedCompletedSteps;
  this.totalSteps = this.calculatedTotalSteps;
  this.progress = this.calculatedProgress;
  next();
});

// Instance method to mark step as completed
roadmapSchema.methods.markStepCompleted = function(stepId) {
  const step = this.steps.find(s => s.id === stepId);
  if (step) {
    step.completed = true;
    return this.save();
  }
  throw new Error('Step not found');
};

// Instance method to mark step as incomplete
roadmapSchema.methods.markStepIncomplete = function(stepId) {
  const step = this.steps.find(s => s.id === stepId);
  if (step) {
    step.completed = false;
    return this.save();
  }
  throw new Error('Step not found');
};

// Static method to find roadmaps by user
roadmapSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId, isActive: true }).sort({ createdAt: -1 });
};

// Index for better query performance
roadmapSchema.index({ user: 1, createdAt: -1 });
roadmapSchema.index({ skill: 1 });
roadmapSchema.index({ difficulty: 1 });

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
