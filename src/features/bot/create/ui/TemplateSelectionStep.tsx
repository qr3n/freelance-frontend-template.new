'use client';

import { ShimmerStar } from '@/app/ShimmerStar';
import { motion, AnimatePresence } from 'framer-motion';
import { TextBackgroundSvg } from '@/shared/ui/svg/ui/TextBackgroundSvg';
import { Button } from '@/shared/shadcn/ui/button';
import { useState } from 'react';
import { Car, ShoppingCart, Coffee } from 'lucide-react';
import { useStepper } from '@/shared/hooks/use-stepper';
import { useBotCreationForm } from '@/widgets/bot-creation/model/hooks';
import {
  enterExitAnimation,
  starEnterExitAnimation,
  spinTransition1,
  spinTransition2
} from '@/shared/lib/animations';

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

const TemplateCard = ({ template, isSelected, onSelect }: {
  template: typeof botTemplates[0];
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const Icon = template.icon;

  return (
    <motion.div
      onClick={onSelect}
      className={`
        relative hover:scale-105 will-change-transform transform-gpu cursor-pointer rounded-3xl w-full h-24 sm:w-48 sm:h-64
        transition-all duration-300
        ${isSelected
        ? 'bg-emerald-100 border-emerald-400 ring-emerald-300/30'
        : 'bg-white border-zinc-150 hover:border-zinc-250'
      }
      `}
    >
      <div className="h-full flex sm:flex-col items-center justify-start gap-4 sm:gap-0 sm:justify-center px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6 z-[1000] relative">
        <motion.div
          animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`
            min-w-16 min-h-16 sm:min-w-16 sm:min-h-16 rounded-2xl flex items-center justify-center transition-all duration-300
            ${isSelected
            ? 'bg-emerald-300 text-emerald-900'
            : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-100'
          }
          `}
        >
          <Icon size={24} className='w-7 h-7 transition-all' strokeWidth={1.5} color={isSelected ? '#14532d' : 'black'}/>
        </motion.div>

        <div className="text-center space-y-2 sm:space-y-3 flex flex-col items-center justify-center">
          <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 leading-tight">
            {template.name}
          </h3>
        </div>
      </div>

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
            className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const TemplateSelectionStep = () => {
  const { formData, updateFormData } = useBotCreationForm();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(formData.templateId || '');
  const { nextStep } = useStepper();

  const handleContinue = () => {
    updateFormData({ templateId: selectedTemplate });
    nextStep();
  };

  return (
    <div className='max-w-5xl flex w-full flex-col items-center justify-center gap-8 sm:gap-12 px-4'>
      <motion.h1
        className='text-white text-center flex items-center justify-center flex-col text-4xl sm:text-5xl md:text-6xl font-bold'
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
        <span className='relative flex mt-1 sm:mt-4 items-center justify-center flex-col'>
          <TextBackgroundSvg />
          <span className='z-10 relative text-emerald-950'>шаблон бота</span>
        </span>
      </motion.h1>

      <motion.div
        className="w-full flex px-4 sm:px-0 flex-col sm:flex-row gap-4 sm:gap-8 mt-6 sm:mt-12 items-center justify-center"
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
          {botTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => setSelectedTemplate(template.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className='w-full max-w-2xl px-4 sm:px-0'
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
        <motion.div>
          <Button
            onClick={handleContinue}
            className='mt-4 sm:mt-8 bg-emerald-400/50 hover:bg-emerald-600/80 text-emerald-50 w-full text-xl sm:text-3xl h-[48px] sm:h-[60px] transition-all duration-300 disabled:opacity-50'
          >
            Продолжить
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
          delay: 0.6
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
            starColor={'#14532d'}
            shimmerColor={'#4ade80'}
            size={30}
            responsiveSizes={{
              sm: 50,
              md: 100,
              lg: 120,
              xl: 150,
              '2xl': 180
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
          <ShimmerStar
            className="w-full h-full"
            starColor={'#14532d'}
            shimmerColor={'#4ade80'}
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