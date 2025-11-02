'use client';

import { Input } from '@/shared/shadcn/ui/input';
import { motion } from 'framer-motion';
import { TextBackgroundSvg } from '@/shared/ui/svg/ui/TextBackgroundSvg';
import { Button } from '@/shared/shadcn/ui/button';
import { useState } from 'react';
import { useStepper } from '@/shared/hooks/use-stepper';
import { useRouter } from 'next/navigation';

const enterExitAnimation = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 },
  enterTransition: {
    type: "spring",
    damping: 15,
    stiffness: 300,
    mass: 1
  },
  exitTransition: {
    duration: 0.4,
    ease: "easeInOut"
  }
};


export const BasicInfoSetupStep = () => {
  const [businessName, setBusinessName] = useState('Мой бот');
  const [businessAddress, setBusinessAddress] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const { nextStep } = useStepper();
  const router = useRouter();

  const handleAddressChange = (value: string) => {
    setBusinessAddress(value);

    // Отменяем предыдущий таймаут поиска
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Устанавливаем новый таймаут для поиска (debounce)
    const timeout = setTimeout(() => {
      // Поиск будет выполнен через useEffect в компоненте карты
    }, 500);

    setSearchTimeout(timeout);
  };


  const handleContinue = () => {
    // Запускаем анимацию выхода
    setIsExiting(true);

    // Сначала вызываем nextStep для анимации
    nextStep();

    // Сразу начинаем загрузку следующей страницы
    router.prefetch('/bot/dashboard');

    // Ждем завершения анимации (400ms согласно exitTransition.duration), затем переходим
    setTimeout(() => {
      router.push('/bot/dashboard');
    }, 400);
  };


  return (
    <div className='max-w-2xl flex w-full flex-col items-center justify-center gap-16'>
      {/* Заголовок */}
      <motion.h1
        className='text-emerald-950 text-center flex items-center justify-center flex-col text-5xl sm:text-6xl md:text-7xl font-bold'
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
        <span className='relative flex mt-4 items-center justify-center flex-col'>
          <TextBackgroundSvg />
          <span className='z-10 relative text-emerald-950'>ваш бизнес</span>
        </span>
      </motion.h1>

      {/* Форма */}
      <motion.div
        className='w-full space-y-6'
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
        {/* Название бизнеса */}
        <div>
          <label className='font-semibold text-emerald-800/70 text-sm'>
            Название бизнеса <span className='text-red-500 text-lg'>*</span>
          </label>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder='Моя компания'
            className='w-full bg-emerald-600/25 mt-2 hover:bg-emerald-600/30 text-forest-900 h-[60px] rounded-full text-3xl font-semibold !placeholder-emerald-800/70 pl-5 pr-5 transition-all duration-300'
          />
        </div>

        {/* Адрес */}
        <div>
          <label className='font-semibold text-emerald-800/70 text-sm'>
            Адрес офиса/магазина
          </label>
          <Input
            value={businessAddress}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder='Москва, ул. Тверская, д. 1'
            className='w-full bg-emerald-600/25  mt-2 hover:bg-emerald-600/30 text-forest-900 h-[60px] rounded-full text-2xl font-semibold !placeholder-emerald-800/70 pl-5 pr-5 transition-all duration-300'
          />
          <p className='text-emerald-950/50 text-xs mt-2 ml-5'>
            Введите адрес или выберите точку на карте
          </p>
        </div>

        {/* Кнопка продолжить */}
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
            className='w-full text-3xl h-[60px] hover:bg-forest-900 transition-all duration-300'
          >
            Продолжить
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};