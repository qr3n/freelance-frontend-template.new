'use client';

import { Input } from '@/shared/shadcn/ui/input';
import { ShimmerSquare } from '@/app/ShimmerStar';
import { motion, AnimatePresence } from 'framer-motion';
import { TextBackgroundSvg } from '@/shared/ui/svg/ui/TextBackgroundSvg';
import { Button } from '@/shared/shadcn/ui/button';
import { useState } from 'react';
import { Clipboard, AlertCircle } from 'lucide-react';
import { useStepper } from '@/shared/hooks/use-stepper';

const spinTransition1 = {
  duration: 0.8,
  ease: "easeOut" as const,
  repeat: Infinity,
  repeatDelay: 1,
  times: [0, 0.3, 0.6, 1],
}

const spinTransition2 = {
  duration: 0.8,
  ease: "easeOut" as const,
  repeat: Infinity,
  repeatDelay: 2.5,
  times: [0, 0.3, 0.6, 1],
}

// Анимации появления снизу с bounce + exit анимация
const enterExitAnimation = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 }, // Выход вверх
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

// Анимации для звезд - более синхронные с основным контентом + exit анимация
const starEnterExitAnimation = {
  initial: { y: 150, opacity: 0, scale: 0.5 },
  animate: { y: 0, opacity: 1, scale: 1 },
  exit: { y: -150, opacity: 0, scale: 0.5 }, // Выход вверх с уменьшением
  enterTransition: {
    type: "spring",
    damping: 12,
    stiffness: 200,
    mass: 1.2
  },
  exitTransition: {
    duration: 0.5,
    ease: "easeInOut"
  }
};

const validateToken = (token: string): boolean => {
  const tokenRegex = /^\d+:[A-Za-z0-9_-]{35}$/;
  return tokenRegex.test(token);
};

export const TokenSetupStep = () => {
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState(true);
  const { nextStep } = useStepper();

  const handleTokenChange = (value: string) => {
    setToken(value);
    if (value.trim() === '') {
      setIsValid(true); // Don't show error for empty input
    } else {
      setIsValid(validateToken(value));
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleTokenChange(text.trim());
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleContinue = () => {
    if (token.trim() === '') {
      setIsValid(false);
      return;
    }

    if (validateToken(token)) {
      nextStep();
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className='max-w-2xl flex w-full flex-col items-center justify-center gap-24'>
      {/* Заголовок с анимацией */}
      <motion.h1
        className='text-emerald-950 text-center flex items-center justify-center flex-col text-5xl sm:text-6xl md:text-7xl font-bold'
        initial={enterExitAnimation.initial}
        animate={enterExitAnimation.animate}
        transition={{
          ...enterExitAnimation.enterTransition,
          delay: 0.1
        }}
        exit={{
          ...enterExitAnimation.exit,
          transition: enterExitAnimation.exitTransition
        }}
      >
        Установите <br/>
        <span className='relative flex mt-4 items-center justify-center flex-col'>
          <TextBackgroundSvg />
          <span className='z-10 relative text-emerald-950'>токен бота</span>
        </span>
      </motion.h1>

      <motion.div
        className='w-full'
        initial={enterExitAnimation.initial}
        animate={enterExitAnimation.animate}
        exit={{
          ...enterExitAnimation.exit,
          transition: enterExitAnimation.exitTransition
        }}
        transition={{
          ...enterExitAnimation.enterTransition,
          delay: 0.3
        }}
      >
        <div className='relative'>
          <Input
            value={token}
            onChange={(e) => handleTokenChange(e.target.value)}
            placeholder={'7525832759:AAHwspl0r7FznMbkiLWJqtqUFMt91DYrwaA'}
            className={`w-full bg-emerald-600/25 mt-2 hover:bg-emerald-600/30 text-forest-900 h-[60px] rounded-full text-3xl font-semibold !placeholder-emerald-800/70 pl-5 pr-16 transition-all duration-300 ${
              !isValid ? 'border-red-500 border-2' : ''
            }`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePaste}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-12 w-12 p-0 rounded-full hover:bg-forest-200 transition-all duration-200"
          >
            <Clipboard className="h-6 w-6 text-forest-700" />
          </Button>
        </div>

        {/* Контейнер с плавным изменением высоты */}
        <motion.div
          animate={{
            height: !isValid ? 'auto' : 0,
            marginTop: !isValid ? 12 : 0
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.4
          }}
          className="overflow-hidden"
        >
          <AnimatePresence>
            {!isValid && (
              <motion.div
                initial={{ y: -10, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{
                  y: -10,
                  opacity: 0,
                  scale: 0.98,
                  transition: {
                    duration: 0.2,
                    ease: "easeInOut"
                  }
                }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 400,
                  duration: 0.3
                }}
                className="px-4 py-3 bg-red-200/80 border border-red-200 rounded-3xl flex items-center gap-3"
              >
                <div className='bg-red-500/80 rounded-full p-1'>
                  <AlertCircle color={'white'} className="h-5 w-5  flex-shrink-0" />
                </div>
                <p className='text-red-500 font-semibold'>Кажется, это не токен из BotFather</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{
            y: 20,
            opacity: 0,
            transition: {
              duration: 0.3,
              ease: "easeInOut"
            }
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 300,
            delay: 0.4
          }}
        >
          <Button
            onClick={handleContinue}
            className='mt-8 w-full text-3xl h-[60px] hover:bg-forest-900 transition-all duration-300'
            disabled={!token.trim() || !isValid}
          >
            Продолжить
          </Button>
        </motion.div>
      </motion.div>

      {/* Левая звезда с анимацией */}
      <motion.div
        className='absolute top-[10%] left-[10%] w-[250px] h-[250px]'
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
        initial={starEnterExitAnimation.initial}
        animate={starEnterExitAnimation.animate}
        exit={{
          ...starEnterExitAnimation.exit,
          transition: starEnterExitAnimation.exitTransition
        }}
        transition={{
          ...starEnterExitAnimation.enterTransition,
          delay: 0.5
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 180]
          }}
          transition={spinTransition1}
          className="w-full h-full"
        >
          <ShimmerSquare
            className="w-full h-full"
            starColor={'#92e4b3'}
            shimmerColor={'#ffffff'}
          />
        </motion.div>
      </motion.div>

      {/* Правая звезда с анимацией */}
      <motion.div
        className='absolute bottom-[10%] right-[5%] w-[400px] h-[400px]'
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
        initial={starEnterExitAnimation.initial}
        animate={starEnterExitAnimation.animate}
        exit={{
          ...starEnterExitAnimation.exit,
          transition: starEnterExitAnimation.exitTransition
        }}
        transition={{
          ...starEnterExitAnimation.enterTransition,
          delay: 0.7
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 180]
          }}
          transition={spinTransition2}
          className="w-full h-full"
        >
          <ShimmerSquare
            className="w-full h-full"
            starColor={'#92e4b3'}
            shimmerColor={'#ffffff'}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}