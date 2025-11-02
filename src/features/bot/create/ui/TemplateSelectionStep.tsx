'use client';

import { ShimmerSquare } from '@/app/ShimmerStar';
import { motion, AnimatePresence } from 'framer-motion';
import { TextBackgroundSvg } from '@/shared/ui/svg/ui/TextBackgroundSvg';
import { Button } from '@/shared/shadcn/ui/button';
import { useState } from 'react';
import { Car, ShoppingCart, Coffee } from 'lucide-react';
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

// Анимации для звезд - более синхронные с основным контентом + exit анимация
const starEnterExitAnimation = {
  initial: { y: 150, opacity: 0, scale: 0.5 },
  animate: { y: 0, opacity: 1, scale: 1 },
  exit: { y: -150, opacity: 0, scale: 0.5 },
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

const botTemplates = [
  {
    id: 'parking',
    name: 'Парковка',
    description: 'Управление парковочными местами',
    icon: Car,
    color: 'blue'
  },
  {
    id: 'shop',
    name: 'Магазин',
    description: 'Каталог товаров и прием заказов',
    icon: ShoppingCart,
    color: 'purple'
  },
  {
    id: 'cafe',
    name: 'Кафе',
    description: 'Меню и доставка кофе',
    icon: Coffee,
    color: 'orange'
  },
];

const TemplateCard = ({ template, isSelected, onSelect, index }: {
  template: typeof botTemplates[0];
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) => {
  const Icon = template.icon;

  return (
    <motion.div
      onClick={onSelect}
      className={`
        relative hover:scale-105 will-change-transform transform-gpu cursor-pointer rounded-3xl  w-48 h-64
        transition-all duration-300
        ${isSelected
        ? '   bg-emerald-100 border-emerald-400 ring-emerald-300/30'
        : 'bg-white border-zinc-150 hover:border-zinc-250'
      }
      `}
    >
      <div className="h-full flex flex-col items-center justify-center px-6 py-8 space-y-6 z-[1000] relative">
        <motion.div
          animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`
            min-w-16 min-h-16 rounded-2xl flex items-center justify-center transition-all duration-300
            ${isSelected
            ? 'bg-emerald-300 text-emerald-900'
            : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-100'
          }
          `}
        >
          <Icon size={28} className='transition-all' strokeWidth={1.5} color={isSelected ? '#14532d' : 'black'}/>
        </motion.div>

        <div className="text-center space-y-3 flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold text-zinc-900 leading-tight">
            {template.name}
          </h3>

        </div>
      </div>

      {/* Индикатор выбора */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              scale: 0,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeInOut"
              }
            }}
            transition={{ type: "spring", damping: 15, stiffness: 400 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const TemplateSelectionStep = () => {
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
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
    nextStep();
  };

  return (
    <div className='max-w-5xl flex w-full flex-col items-center justify-center gap-12'>
      <motion.h1
        className='text-white text-center flex items-center justify-center flex-col text-6xl font-bold'
        initial={enterExitAnimation.initial}
        animate={enterExitAnimation.animate}
        exit={{
          ...enterExitAnimation.exit,
          transition: enterExitAnimation.exitTransition
        }}
        transition={{
          ...enterExitAnimation.enterTransition,
          delay: 0.1
        }}
      >
        Выберите <br/>
        <span className='relative flex mt-4 items-center justify-center flex-col'>
          <TextBackgroundSvg />
          <span className='z-10 relative text-emerald-950'>шаблон бота</span>
        </span>
      </motion.h1>

      {/* Сетка карточек шаблонов */}
      <motion.div
        className="w-full flex gap-8 mt-12 items-center justify-center"
        initial={enterExitAnimation.initial}
        animate={enterExitAnimation.animate}
        exit={{
          ...enterExitAnimation.exit,
          transition: enterExitAnimation.exitTransition
        }}
        transition={{
          ...enterExitAnimation.enterTransition,
          delay: 0.15
        }}
      >
        <AnimatePresence>
          {botTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => setSelectedTemplate(template.id)}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className='w-full max-w-2xl'
        initial={enterExitAnimation.initial}
        animate={enterExitAnimation.animate}
        exit={{
          ...enterExitAnimation.exit,
          transition: enterExitAnimation.exitTransition
        }}
        transition={{
          ...enterExitAnimation.enterTransition,
          delay: 0.23
        }}
      >
        <motion.div
        >
          <Button
            onClick={handleContinue}
            className='mt-8 bg-emerald-400/50 hover:bg-emerald-600/80 text-emerald-50 w-full text-3xl h-[60px] transition-all duration-300 disabled:opacity-50'
          >
            Продолжить
          </Button>
        </motion.div>
      </motion.div>

      {/* Левая звезда с анимацией (уменьшенная) */}
      <motion.div
        className='absolute top-[15%] left-[8%] w-[180px] h-[180px]'
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
          delay: 0.6
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
            starColor={'#14532d'}
            shimmerColor={'#4ade80'}
          />
        </motion.div>
      </motion.div>

      {/* Правая звезда с анимацией (уменьшенная) */}
      <motion.div
        className='absolute bottom-[15%] right-[8%] w-[300px] h-[300px]'
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
          delay: 0.8
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
            starColor={'#14532d'}
            shimmerColor={'#4ade80'}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}