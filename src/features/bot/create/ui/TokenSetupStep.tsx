'use client';

import { Input } from '@/shared/shadcn/ui/input';
import { ShimmerStar } from '@/app/ShimmerStar';
import { motion, AnimatePresence } from 'framer-motion';
import { TextBackgroundSvg } from '@/shared/ui/svg/ui/TextBackgroundSvg';
import { Button } from '@/shared/shadcn/ui/button';
import { useState } from 'react';
import { Clipboard, AlertCircle, Loader2 } from 'lucide-react';
import { useStepper } from '@/shared/hooks/use-stepper';
import { useBotCreationForm } from '@/widgets/bot-creation/model/hooks';
import {
  enterExitAnimation,
  starEnterExitAnimation,
  spinTransition1,
  spinTransition2
} from '@/shared/lib/animations';

const validateToken = (token: string): boolean => {
  const tokenRegex = /^\d+:[A-Za-z0-9_-]{35}$/;
  return tokenRegex.test(token);
};

const checkTelegramBot = async (token: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const data = await response.json();

    if (!data.ok) {
      return { success: false, error: 'Неверный токен' };
    }

    // Проверяем, установлен ли webhook
    if (data.result.url && data.result.url.trim() !== '') {
      return {
        success: false,
        error: `На этом токене уже настроен webhook`
      };
    }

    // Webhook не установлен - токен свободен
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: 'Ошибка при проверке токена'
    };
  }
};

export const TokenSetupStep = () => {
  const { formData, updateFormData } = useBotCreationForm();
  const [token, setToken] = useState(formData.token || '');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const { nextStep } = useStepper();

  const handleTokenChange = (value: string) => {
    setToken(value);
    setErrorMessage('');
    if (value.trim() === '') {
      setIsValid(true);
    } else {
      setIsValid(validateToken(value));
      if (!validateToken(value)) {
        setErrorMessage('Кажется, это не токен из BotFather');
      }
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

  const handleContinue = async () => {
    if (token.trim() === '') {
      setIsValid(false);
      setErrorMessage('Введите токен бота');
      return;
    }

    if (!validateToken(token)) {
      setIsValid(false);
      setErrorMessage('Кажется, это не токен из BotFather');
      return;
    }

    setIsChecking(true);
    setIsValid(true);
    setErrorMessage('');

    const result = await checkTelegramBot(token);

    setIsChecking(false);

    if (result.success) {
      updateFormData({ token });
      nextStep();
    } else {
      setIsValid(false);
      setErrorMessage(result.error || 'Ошибка проверки токена');
    }
  };

  return (
    <div className='max-w-2xl flex w-full flex-col items-center justify-center gap-10 sm:gap-12 md:gap-24'>
      <motion.h1
        className='text-emerald-950 text-center flex items-center justify-center flex-col text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold'
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
        <span className='relative flex mt-1 sm:mt-4 items-center justify-center flex-col'>
          <TextBackgroundSvg />
          <span className='z-10 relative text-emerald-950'>токен бота</span>
        </span>
      </motion.h1>

      <motion.div
        className='w-full sm:px-0 px-4'
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
        <div className='relative flex items-center'>
          <Input
            value={token}
            onChange={(e) => handleTokenChange(e.target.value)}
            placeholder={'7525832759:AAHwspl0r7FznMbkiLWJqtqUFMt91DYrwaA'}
            disabled={isChecking}
            className={`w-full text-sm bg-emerald-600/25 mt-2 hover:bg-emerald-600/30 text-forest-900 h-[48px] sm:h-[60px] rounded-full font-semibold !placeholder-emerald-800/70 pl-5 pr-16 transition-all duration-300 ${
              !isValid ? 'border-red-500 bg-red-500/30 hover:bg-red-500/40 text-red-800 border-2' : ''
            } ${isChecking ? 'opacity-70' : ''}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePaste}
            isLoading={isChecking}
            className="absolute right-2 -translate-y-1/2 mt-1 top-1/2 h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-full hover:bg-forest-200 transition-all duration-200 disabled:opacity-50"
          >
            <Clipboard className="h-5 w-5 sm:h-6 sm:w-6 text-forest-700" />
          </Button>
        </div>

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
                  <AlertCircle color={'white'} className="h-5 w-5 flex-shrink-0" />
                </div>
                <p className='text-red-500 font-semibold'>{errorMessage}</p>
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
            className='mt-4 sm:mt-8 w-full text-xl sm:text-3xl h-[48px] sm:h-[60px] hover:bg-forest-950/95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-white'
            disabled={!token.trim() || !isValid || isChecking}
          >
            {isChecking ? (
              <span className="flex items-center gap-2 text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
                Проверяем токен...
              </span>
            ) : (
              'Проверить токен'
            )}
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className='absolute hidden md:block top-[10%] left-[10%] w-[250px] h-[250px]'
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
          className="w-full h-full absolute left-[-100px] 2xl:left-0 top-[-100px] xl:top-0"
        >
          <ShimmerStar
            className="w-full h-full"
            starColor={'#92e4b3'}
            shimmerColor={'#ffffff'}
            size={30}
            responsiveSizes={{
              sm: 50,
              md: 100,
              lg: 150,
              xl: 150,
              '2xl': 200
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className='absolute hidden md:block bottom-[-80px] xl:bottom-[10%] right-[-100px] xl:right-0 2xl:right-[5%] w-[400px] h-[400px]'
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
          <ShimmerStar
            className="w-full h-full"
            starColor={'#92e4b3'}
            shimmerColor={'#ffffff'}
            size={50}
            responsiveSizes={{
              sm: 100,
              md: 150,
              lg: 200,
              xl: 250,
              '2xl': 300
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};