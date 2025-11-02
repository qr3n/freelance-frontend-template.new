'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface StepperContextType {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

const StepperContext = createContext<StepperContextType | null>(null);

interface StepperProviderProps {
  children: ReactNode;
  totalSteps: number;
  initialStep?: number;
}

export const StepperProvider = ({
                                  children,
                                  totalSteps,
                                  initialStep = 0
                                }: StepperProviderProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  };

  const canGoNext = currentStep < totalSteps - 1;
  const canGoPrev = currentStep > 0;

  return (
    <StepperContext.Provider
      value={{
    currentStep,
      totalSteps,
      nextStep,
      prevStep,
      goToStep,
      canGoNext,
      canGoPrev
  }}
>
  {children}
  </StepperContext.Provider>
);
};

export const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within StepperProvider');
  }
  return context;
};