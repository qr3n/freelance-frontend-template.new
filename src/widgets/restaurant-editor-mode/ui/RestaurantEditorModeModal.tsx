'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Settings } from 'lucide-react';
import { Modal } from '@/shared/ui/modal';

import { Montserrat } from "next/font/google";
import { InteractiveHoverButton } from '@/shared/shadcn/abstract-glassy-shader';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const AdvancedAnimation = () => {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <div className="relative w-64 h-32 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full h-px bg-gray-300" style={{ top: `${(i + 1) * 16.66}%` }} />
          ))}
          {[...Array(6)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full w-px bg-gray-300" style={{ left: `${(i + 1) * 16.66}%` }} />
          ))}
        </div>

        {/* Table 1 */}
        <motion.div
          className="absolute w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg"
          style={{ left: '20%', top: '25%' }}
          animate={{
            opacity: [1, 0.85, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />

        {/* Table 2 */}
        <motion.div
          className="absolute w-14 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg"
          style={{ left: '58%', top: '35%' }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 2,
          }}
        />

        {/* Cursor */}
        <motion.div
          className="absolute w-5 h-5 pointer-events-none z-20"
          animate={{
            left: ['15%', '15%', '53%', '53%', '53%', '15%'],
            top: ['20%', '20%', '30%', '30%', '55%', '55%'],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            times: [0, 0.15, 0.35, 0.5, 0.65, 1],
            ease: "easeInOut"
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-md">
            <path d="M3 3L10.5 19.5L13 13L19.5 10.5L3 3Z" fill="white" stroke="black" strokeWidth="1.5"/>
          </svg>
        </motion.div>

        {/* Click indicator */}
        <motion.div
          className="absolute w-7 h-7 border-2 border-blue-400 rounded-full pointer-events-none"
          animate={{
            left: ['15%', '15%', '53%'],
            top: ['20%', '20%', '30%'],
            opacity: [0, 0.8, 0, 0, 0, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            times: [0, 0.15, 0.2, 0.35, 0.5, 1],
          }}
        />

        {/* Drag indicator */}
        <motion.div
          className="absolute w-14 h-9 border-2 border-dashed border-purple-400 rounded-xl pointer-events-none"
          style={{ left: '58%', top: '35%' }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0, 0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            times: [0, 0.3, 0.35, 0.5, 0.55, 1],
          }}
        />
      </div>
    </div>
  );
};

const SimpleAnimation = () => {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <div className="relative w-48 h-32">
        {/* Simplified restaurant layout */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border-2 border-emerald-200 p-4"
          animate={{
            opacity: [1, 0.95, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <div className="grid grid-cols-3 gap-2 h-full">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-emerald-500 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Checkmark overlay */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.8,
            duration: 0.4,
          }}
        >
          <Check className="w-7 h-7 text-white" strokeWidth={3} />
        </motion.div>
      </div>
    </div>
  );
};

interface ModeProps {
  isSelected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon: 'simple' | 'advanced';
}

const Mode = ({ isSelected, onClick, title, description, icon }: ModeProps) => {
  return (
    <motion.div
      onClick={onClick}
      className="cursor-pointer w-full relative"
    >
      <motion.div
        className={`relative rounded-3xl p-6 h-full transition-all duration-300 ${
          isSelected
            ? 'dotted-background bg-forest-50 border-2 border-forest-300 '
            : 'bg-white border-2 border-transparent '
        }`}
      >
        { isSelected && (
          <div className='absolute h-full w-full top-0 left-0 bg-gradient-to-b from-50% from-forest-50 to-transparent rounded-3xl'/>
        ) }
        <div className={'relative z-10'}>
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            isSelected ? 'bg-emerald-500' : 'bg-gray-100'
          }`}>
            {icon === 'simple' ? (
              <Sparkles className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
            ) : (
              <Settings className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
            )}
          </div>

          {/* Title and description */}
          <h3 className={`text-2xl font-bold mb-2 ${isSelected ? 'text-emerald-900' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className={`text-sm mb-6 ${isSelected ? 'text-emerald-700' : 'text-gray-600'}`}>
            {description}
          </p>

          {/* Animation preview */}
          <div className={`rounded-2xl overflow-hidden ${
            isSelected ? 'bg-forest-200' : 'bg-gray-50'
          }`}>
            {icon === 'simple' ? <SimpleAnimation /> : <AdvancedAnimation />}
          </div>

          {/* Selection indicator */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export function RestaurantEditorModeModal() {
  const [selected, setSelected] = useState(0);

  return (
    <Modal open={true} dialogStyle={`max-w-[800px] ${montserrat.className}`} title={''} description={''}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className='text-3xl md:text-4xl font-semibold text-gray-900 mb-3'>Выберите режим<br/>редактора</h1>
        </div>

        {/* Mode selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Mode
            isSelected={selected === 0}
            onClick={() => setSelected(0)}
            title="Простой"
            description="Базовое управление рестораном с основными функциями"
            icon="simple"
          />

          <Mode
            isSelected={selected === 1}
            onClick={() => setSelected(1)}
            title="Продвинутый"
            description="Интерактивный редактор с расширенными настройками"
            icon="advanced"
          />
        </div>

        {/* Action button */}
        <InteractiveHoverButton text={'Начать'} />
      </motion.div>
    </Modal>
  );
}