import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { createRoadmap, CreateRoadmapForm } from '../utils/roadmapApi';

export function CreateRoadmapPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateRoadmapForm>({
    skill: '',
    currentLevel: '',
    targetOutcome: '',
    hoursPerWeek: 10
  });
  const [errors, setErrors] = useState<Partial<CreateRoadmapForm>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<CreateRoadmapForm> = {};
    
    if (!formData.skill.trim()) {
      newErrors.skill = 'Skill is required';
    }
    
    if (!formData.currentLevel.trim()) {
      newErrors.currentLevel = 'Current level is required';
    }
    
    if (!formData.targetOutcome.trim()) {
      newErrors.targetOutcome = 'Target outcome is required';
    } else if (formData.targetOutcome.length < 10) {
      newErrors.targetOutcome = 'Target outcome must be at least 10 characters';
    }
    
    if (!formData.hoursPerWeek || formData.hoursPerWeek < 1) {
      newErrors.hoursPerWeek = 'Hours per week must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const result = await createRoadmap(formData);
      
      if (result.roadmap) {
        navigate(`/roadmap/${result.roadmap._id}`);
      }
    } catch (error) {
      console.error('Error creating roadmap:', error);
      setErrors({ skill: 'Failed to create roadmap. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create AI-Powered Roadmap</h1>
              <p className="text-gray-600">Tell us about your learning goals and let AI create a personalized roadmap</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Input
                    label="What skill do you want to learn?"
                    type="text"
                    value={formData.skill}
                    onChange={(e) => setFormData(prev => ({ ...prev, skill: e.target.value }))}
                    error={errors.skill}
                    placeholder="e.g., React, Python, Digital Marketing"
                  />
                </div>

                <div>
                  <Input
                    label="What's your current level?"
                    type="text"
                    value={formData.currentLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentLevel: e.target.value }))}
                    error={errors.currentLevel}
                    placeholder="e.g., Complete beginner, Some experience, Intermediate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What do you want to achieve?
                  </label>
                  <textarea
                    value={formData.targetOutcome}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetOutcome: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.targetOutcome ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={4}
                    placeholder="Describe your learning goals and what you want to accomplish..."
                  />
                  {errors.targetOutcome && (
                    <p className="mt-1 text-sm text-red-600">{errors.targetOutcome}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many hours can you dedicate per week?
                  </label>
                  <select
                    value={formData.hoursPerWeek}
                    onChange={(e) => setFormData(prev => ({ ...prev, hoursPerWeek: parseInt(e.target.value) }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.hoursPerWeek ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value={5}>5 hours</option>
                    <option value={10}>10 hours</option>
                    <option value={15}>15 hours</option>
                    <option value={20}>20 hours</option>
                    <option value={25}>25 hours</option>
                    <option value={30}>30+ hours</option>
                  </select>
                  {errors.hoursPerWeek && (
                    <p className="mt-1 text-sm text-red-600">{errors.hoursPerWeek}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Your Roadmap...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Roadmap
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            <Card>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How it works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          Provide details about your learning goals and current level
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          Our AI analyzes your requirements and creates a personalized roadmap
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          Get a step-by-step learning path with curated resources
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">What you'll get</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Structured learning path with 8-15 steps
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Estimated time for each step
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Curated learning resources
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Progress tracking
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Interactive visualization
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}