'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { TokenSetupStep } from '@/features/bot/create/ui/TokenSetupStep';
import { TemplateSelectionStep } from '@/features/bot/create/ui/TemplateSelectionStep';
import { PlanSelectionStep } from '@/features/bot/create/ui/PlanSelectionStep';
import { useStepper } from '@/shared/hooks/use-stepper';
import { cn } from '@/shared/shadcn/lib/utils';
import { BasicInfoSetupStep } from '@/features/bot/create/ui/BasicInfoSetupStep';

export const CreateBotSteps = () => {
  const { currentStep } = useStepper();
  const [backgroundStep, setBackgroundStep] = useState(currentStep);

  const steps = useMemo(() => [
    TokenSetupStep,
    TemplateSelectionStep,
    BasicInfoSetupStep,
    PlanSelectionStep,
  ], []);

  // Обновляем backgroundStep с задержкой
  useEffect(() => {
    const timeout = setTimeout(() => {
      setBackgroundStep(currentStep);
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentStep]);

  const CurrentStep = steps[currentStep];

  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Базовый фон */}
      <div className={cn(
        'absolute inset-0 bg-white',
      )} />

      {/* Анимированный круг для второго шага (темный) */}
      <motion.div
        initial={false}
        animate={{
          clipPath: backgroundStep === 0
            ? 'circle(0% at 50% 50%)'
            : 'circle(150% at 50% 50%)'
        }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-0 bg-[#042612]"
      />

      {/* Анимированный круг для третьего шага (белый) */}
      <motion.div
        initial={false}
        animate={{
          clipPath: backgroundStep === 2
            ? 'circle(150% at 50% 50%)'
            : 'circle(0% at 50% 50%)'
        }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-0 bg-white"
      />

      {/* Контент */}
      <div className='flex flex-col z-50 items-center justify-center w-full max-w-screen-xl h-full'>
        <AnimatePresence mode={'wait'}>
          <CurrentStep key={currentStep} />
        </AnimatePresence>
      </div>
    </div>
  );
};