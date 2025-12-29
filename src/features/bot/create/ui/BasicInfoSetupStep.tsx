'use client';

import { Input } from '@/shared/shadcn/ui/input';
import { motion } from 'framer-motion';
import { TextBackgroundSvg } from '@/shared/ui/svg/ui/TextBackgroundSvg';
import { Button } from '@/shared/shadcn/ui/button';
import { useState } from 'react';
import { useStepper } from '@/shared/hooks/use-stepper';
import { useCurrentUser } from '@/entities/auth/model/hooks';
import { useLoginModal } from '@/features/auth/login/model/hooks';
import { LoginModal } from '@/features/auth/login/ui/LoginModal';
import { useBotCreationForm } from '@/widgets/bot-creation/model/hooks';
import { enterExitAnimation } from '@/shared/lib/animations';

interface BasicInfoSetupStepProps {
  onCreateBusiness: () => Promise<any>;
}

export const BasicInfoSetupStep = ({ onCreateBusiness }: BasicInfoSetupStepProps) => {
  const { formData, updateFormData } = useBotCreationForm();
  const [businessName, setBusinessName] = useState(formData.businessDescription || 'Мой бот');
  const [businessAddress, setBusinessAddress] = useState(formData.businessDescription || '');
  const [isExiting, setIsExiting] = useState(false);
  const { nextStep } = useStepper();
  const { data: user } = useCurrentUser();
  const loginModal = useLoginModal();

  const handleAddressChange = (value: string) => {
    setBusinessAddress(value);
  };

  const handleContinue = async () => {
    if (!user) {
      console.log('No user, opening login modal');
      loginModal.open();
      return;
    }

    console.log('Updating form data:', { businessName, businessAddress });
    updateFormData({
      businessName,
      businessAddress,
    });

    setIsExiting(true);
    nextStep();

    try {
      console.log('Calling onCreateBusiness...');
      await onCreateBusiness();
      console.log('Business created successfully');
    } catch (error) {
      console.error('Failed to create business:', error);
      setIsExiting(false);
    }
  };

  return (
    <div className='max-w-2xl flex w-full flex-col items-center justify-center gap-12 sm:gap-16 px-4'>
      <LoginModal
        open={loginModal.isOpen}
        onOpenChange={loginModal.setIsOpen}
        onSuccess={() => {
          console.log('Успешный вход!');
        }}
      />

      <motion.h1
        className='text-emerald-950 text-center flex items-center justify-center flex-col text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold'
        initial={enterExitAnimation.initial}
        animate={isExiting ? enterExitAnimation.exit : enterExitAnimation.animate}
        transition={
          isExiting
            ? enterExitAnimation.exitTransition
            : {
              ...enterExitAnimation.enterTransition,
              delay: 0.1
            }
        }
      >
        Настроим <br />
        <span className='relative flex mt-1 sm:mt-4 items-center justify-center flex-col'>
          <TextBackgroundSvg />
          <span className='z-10 relative text-emerald-950'>ваш бизнес</span>
        </span>
      </motion.h1>

      <motion.div
        className='w-full space-y-4 sm:space-y-6'
        initial={enterExitAnimation.initial}
        animate={isExiting ? enterExitAnimation.exit : enterExitAnimation.animate}
        transition={
          isExiting
            ? enterExitAnimation.exitTransition
            : {
              ...enterExitAnimation.enterTransition,
              delay: 0.3
            }
        }
      >
        <div>
          <label className='font-semibold text-emerald-900/70 text-xs sm:text-sm'>
            Название бизнеса <span className='text-red-500 text-base sm:text-lg'>*</span>
          </label>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder='Моя компания'
            className='w-full bg-emerald-600/25 mt-2 hover:bg-emerald-600/30 text-forest-900 h-[48px] sm:h-[60px] rounded-full text-sm sm:text-lg font-semibold !placeholder-emerald-800/70 pl-4 sm:pl-5 pr-4 sm:pr-5 transition-all duration-300'
          />
        </div>

        <div>
          <label className='font-semibold text-emerald-900/70 text-xs sm:text-sm'>
            Адрес офиса/магазина
          </label>
          <Input
            value={businessAddress}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder='Москва, ул. Тверская, д. 1'
            className='w-full bg-emerald-600/25 mt-2 hover:bg-emerald-600/30 text-forest-900 h-[48px] sm:h-[60px] rounded-full text-sm sm:text-lg font-semibold !placeholder-emerald-800/70 pl-4 sm:pl-5 pr-4 sm:pr-5 transition-all duration-300'
          />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={
            isExiting
              ? { y: 20, opacity: 0 }
              : { y: 0, opacity: 1 }
          }
          transition={
            isExiting
              ? {
                duration: 0.3,
                ease: "easeInOut"
              }
              : {
                type: "spring",
                damping: 15,
                stiffness: 300,
                delay: 0.5
              }
          }
        >
          <Button
            onClick={handleContinue}
            disabled={isExiting}
            className='w-full text-xl sm:text-3xl h-[48px] sm:h-[60px] hover:bg-forest-900 transition-all duration-300 mt-2 sm:mt-0'
          >
            Продолжить
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};