import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target, Map, Trophy, Play } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: 'Personalized Learning Paths',
      description: 'Get customized roadmaps based on your current skill level, goals, and available time.'
    },
    {
      icon: Map,
      title: 'Interactive Roadmaps',
      description: 'Visualize your learning journey with interactive diagrams showing dependencies and progress.'
    },
    {
      icon: Trophy,
      title: 'Progress Tracking',
      description: 'Monitor your advancement with detailed progress bars and milestone achievements.'
    },
    {
      icon: Play,
      title: 'Curated Resources',
      description: 'Access handpicked YouTube playlists and resources for each learning step.'
    }
  ];

  const steps = [
    {
      step: '1',
      title: 'Answer Questions',
      description: 'Tell us about your skill, current level, and learning goals.'
    },
    {
      step: '2',
      title: 'Get Your Roadmap',
      description: 'Receive a personalized learning path with interactive visualization.'
    },
    {
      step: '3',
      title: 'Track Progress',
      description: 'Follow your roadmap, complete steps, and track your advancement.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-balance mb-6">
              Master Any Skill with{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Personalized Roadmaps
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 text-balance">
              Create customized learning paths, visualize your progress, and access curated resources 
              to accelerate your skill development journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-4" onClick={() => navigate('/signup')}>
                Start Learning Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4" onClick={() => navigate('/signin')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Learn Effectively
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools and resources you need to create 
              and follow personalized learning paths.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How SkillPath Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with your personalized learning journey in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.description}</p>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of learners who are already using SkillPath to master new skills 
            and advance their careers.
          </p>
          <Button variant="secondary" size="lg" className="text-lg px-8 py-4" onClick={() => navigate('/signup')}>
            Create Your First Roadmap
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}