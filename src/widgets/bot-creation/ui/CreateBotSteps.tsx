'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { TokenSetupStep } from '@/features/bot/create/ui/TokenSetupStep';
import { TemplateSelectionStep } from '@/features/bot/create/ui/TemplateSelectionStep';
import { BasicInfoSetupStep } from '@/features/bot/create/ui/BasicInfoSetupStep';
import { useStepper } from '@/shared/hooks/use-stepper';
import { cn } from '@/shared/shadcn/lib/utils';
import { useCreateBusiness } from '@/features/business/create/model/hooks';
import { BusinessType } from '@/features/business/create/model/types';
import { useBotCreationForm } from '../model/hooks';

export const CreateBotSteps = () => {
  const { currentStep } = useStepper();
  const [backgroundStep, setBackgroundStep] = useState(currentStep);
  const router = useRouter();
  const { mutateAsync } = useCreateBusiness();
  const { formData, resetFormData } = useBotCreationForm();

  const steps = useMemo(() => [
    TokenSetupStep,
    TemplateSelectionStep,
    BasicInfoSetupStep,
  ], []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBackgroundStep(currentStep);
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentStep]);

  const handleCreateBusiness = useCallback(async () => {
    try {
      const result = await toast.promise(
        mutateAsync({
          name: formData.businessName || 'Без названия',
          description: formData.businessDescription || "Описание отсутствует",
          business_type: BusinessType.RESTAURANT,
          telegram_bot_token: formData.token || '7525832759:AAHwspl0r7FznMbkiLWJqtqUFMt91DYrwaA'
        }),
        {
          loading: 'Создание бизнеса...',
          success: 'Успешно!',
          error: 'Ошибка'
        }
      );

      router.prefetch(`/dashboard/business/${result.id}?setup=true`);

      setTimeout(() => {
        router.push(`/dashboard/business/${result.id}?setup=true`);
        resetFormData();
      }, 400);

      return result;
    } catch (error) {
      console.error('Failed to create business:', error);
      throw error;
    }
  }, [formData, mutateAsync, router, resetFormData]);

  const CurrentStep = steps[currentStep];

  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden">
      <div className={cn('absolute inset-0 bg-white')} />

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

      <div className='flex flex-col z-50 items-center justify-center w-full max-w-screen-xl h-full'>
        <AnimatePresence mode={'wait'}>
          <CurrentStep key={currentStep} onCreateBusiness={handleCreateBusiness} />
        </AnimatePresence>
      </div>
    </div>
  );
};