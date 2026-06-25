import React from 'react';
import Icon from '@/components/ui/AppIcon';
import type { WizardStep } from './VerificationWizard';

interface StepProgressProps {
  currentStep: WizardStep;
}

const steps = [
  { id: 1, label: 'Upload ID', sublabel: 'Government document', icon: 'DocumentTextIcon' },
  { id: 2, label: 'Face Scan', sublabel: 'Liveness detection', icon: 'FaceSmileIcon' },
  { id: 3, label: 'Confirm', sublabel: 'Review & complete', icon: 'CheckBadgeIcon' },
];

export default function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="relative">
      <div className="flex items-start justify-between relative">
        {/* Connector lines */}
        <div className="absolute top-5 left-0 right-0 flex items-center px-10 pointer-events-none" aria-hidden="true">
          <div className="flex-1 h-0.5 mx-2">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                background: currentStep >= 2
                  ? 'linear-gradient(90deg, #92400e, #d97706)'
                  : 'rgba(255,248,235,0.07)',
              }}
            />
          </div>
          <div className="flex-1 h-0.5 mx-2">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                background: currentStep >= 3
                  ? 'linear-gradient(90deg, #92400e, #d97706)'
                  : 'rgba(255,248,235,0.07)',
              }}
            />
          </div>
        </div>

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <div key={`step-${step.id}`} className="flex flex-col items-center gap-2 flex-1 relative">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                  ${isCompleted
                    ? 'border-transparent text-white'
                    : isActive
                    ? 'border-amber-600 text-amber-400' :'border-stone-600/40 text-stone-600'
                  }
                `}
                style={isCompleted ? {
                  background: 'linear-gradient(135deg, #92400e, #d97706)',
                  boxShadow: '0 0 18px rgba(146,64,14,0.30)',
                } : isActive ? {
                  background: 'rgba(146,64,14,0.14)',
                  boxShadow: '0 0 16px rgba(146,64,14,0.18)',
                } : {
                  background: 'rgba(255,248,235,0.04)',
                }}
              >
                {isCompleted ? (
                  <Icon name="CheckIcon" size={18} variant="solid" className="text-white" />
                ) : (
                  <Icon name={step.icon as Parameters<typeof Icon>[0]['name']} size={18} variant="outline" />
                )}
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${isActive ? 'text-stone-100' : isCompleted ? 'text-stone-300' : 'text-stone-600'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-stone-500 hidden sm:block">{step.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}