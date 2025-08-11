import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1 relative">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors mb-2 relative z-10",
                index < currentStep 
                  ? "bg-green-500 text-white" 
                  : index === currentStep
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <span className={cn(
              "text-sm text-center",
              index <= currentStep ? "text-gray-900" : "text-gray-500"
            )}>
              {step}
            </span>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0">
                <div 
                  className={cn(
                    "h-full transition-all duration-500 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600",
                    index < currentStep ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}