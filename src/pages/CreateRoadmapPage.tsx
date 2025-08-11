import { useState } from 'react';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { StepIndicator } from '../components/ui/StepIndicator';
import { CreateRoadmapForm } from '../types';

const FORM_STEPS = [
  'Skill Selection',
  'Current Level',
  'Goals & Timeline',
  'Generate Roadmap'
];

interface CreateRoadmapPageProps {
  onNavigate: (page: string, roadmapId?: string) => void;
}

export function CreateRoadmapPage({ onNavigate }: CreateRoadmapPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateRoadmapForm>({
    skill: '',
    currentLevel: '',
    targetOutcome: '',
    hoursPerWeek: 5
  });
  const [errors, setErrors] = useState<Partial<CreateRoadmapForm>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<CreateRoadmapForm> = {};
    
    switch (step) {
      case 0:
        if (!formData.skill.trim()) {
          newErrors.skill = 'Please enter a skill to learn';
        }
        break;
      case 1:
        if (!formData.currentLevel.trim()) {
          newErrors.currentLevel = 'Please select your current level';
        }
        break;
      case 2:
        if (!formData.targetOutcome.trim()) {
          newErrors.targetOutcome = 'Please describe your target outcome';
        }
        if (formData.hoursPerWeek < 1 || formData.hoursPerWeek > 168) {
          newErrors.hoursPerWeek = 'Please enter a valid number of hours (1-168)';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === FORM_STEPS.length - 2) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setCurrentStep(FORM_STEPS.length - 1);
    
    // Simulate API call to generate roadmap
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate a mock roadmap ID
    const roadmapId = '1';
    
    // Redirect to the new roadmap
    onNavigate('roadmap', roadmapId);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What skill would you like to learn?
              </h2>
              <p className="text-gray-600">
                Tell us about the skill you want to master and we'll create a personalized roadmap for you.
              </p>
            </div>
            
            <Input
              label="Skill to Learn"
              value={formData.skill}
              onChange={(e) => setFormData(prev => ({ ...prev, skill: e.target.value }))}
              placeholder="e.g., Web Development, Data Science, Machine Learning..."
              error={errors.skill}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Web Development', 'Data Science', 'Machine Learning', 'Mobile Development', 'DevOps', 'UI/UX Design'].map((skill) => (
                <button
                  key={skill}
                  onClick={() => setFormData(prev => ({ ...prev, skill }))}
                  className={`p-3 rounded-lg border text-sm transition-colors ${
                    formData.skill === skill
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What's your current level?
              </h2>
              <p className="text-gray-600">
                Help us understand your starting point so we can create the perfect learning path.
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { value: 'Complete Beginner', description: 'I have no prior experience with this skill' },
                { value: 'Some Experience', description: 'I have basic knowledge or have dabbled in this area' },
                { value: 'Intermediate', description: 'I have solid fundamentals and some practical experience' },
                { value: 'Advanced', description: 'I\'m experienced but want to deepen my expertise' }
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => setFormData(prev => ({ ...prev, currentLevel: level.value }))}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    formData.currentLevel === level.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{level.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{level.description}</div>
                </button>
              ))}
            </div>
            
            {errors.currentLevel && (
              <p className="text-sm text-red-600">{errors.currentLevel}</p>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Goals & Timeline
              </h2>
              <p className="text-gray-600">
                Let us know what you want to achieve and how much time you can dedicate.
              </p>
            </div>
            
            <Input
              label="Target Outcome"
              value={formData.targetOutcome}
              onChange={(e) => setFormData(prev => ({ ...prev, targetOutcome: e.target.value }))}
              placeholder="e.g., Build full-stack applications, Get a job as a data scientist..."
              error={errors.targetOutcome}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours per week available for learning
              </label>
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  min="1"
                  max="168"
                  value={formData.hoursPerWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, hoursPerWeek: parseInt(e.target.value) || 5 }))}
                  error={errors.hoursPerWeek}
                  className="w-24"
                />
                <span className="text-gray-600">hours per week</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[5, 10, 15, 20].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setFormData(prev => ({ ...prev, hoursPerWeek: hours }))}
                    className={`p-2 rounded text-sm transition-colors ${
                      formData.hoursPerWeek === hours
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Generating Your Roadmap
              </h2>
              <p className="text-gray-600">
                Our AI is creating a personalized learning path based on your responses...
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex-1 text-left">Analyzing your skill level...</div>
                <div className="text-green-600">✓</div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                <div className="flex-1 text-left">Finding relevant resources...</div>
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400 mt-2">
                <div className="flex-1 text-left">Creating learning path...</div>
                <div>○</div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={FORM_STEPS.length}
          steps={FORM_STEPS}
        />
        
        <Card className="min-h-[500px] flex flex-col">
          <div className="flex-1">
            {renderStepContent()}
          </div>
          
          {currentStep < FORM_STEPS.length - 1 && (
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button onClick={handleNext} disabled={loading}>
                {currentStep === FORM_STEPS.length - 2 ? 'Generate Roadmap' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}