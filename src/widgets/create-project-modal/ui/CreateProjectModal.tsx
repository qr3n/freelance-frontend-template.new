'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@shared/ui/modal';
import { Snowfall } from 'react-snowfall';

// Типы
interface IModalProps {
  children: React.ReactNode;
  title: string;
  description: string;
  dialogStyle?: string;
}

interface ToggleGroupProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}

interface ToggleGroupItemProps {
  children: React.ReactNode;
  value: string;
  isSelected?: boolean;
  onSelect?: () => void;
  icon?: string;
  color?: string;
  description?: string;
}


interface WaveAnimationProps {
  isVisible: boolean;
  color?: string;
}

interface Project {
  value: string;
  label: string;
  color: string;
  snowColor: string;
  description: string;
  tags: string[];
  icon: string;
  gradient: string;
}

type IProps = Partial<Omit<IModalProps, 'title' | 'description' | 'children'>>;

// Улучшенный Toggle Group с красивым дизайном
const ToggleGroup: React.FC<ToggleGroupProps> = ({ children, value, onValueChange }) => (
  <div className="space-y-3 p-4 bg-gradient-to-b from-zinc-900/50 to-zinc-950/80 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
    <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      Choose Framework
    </div>
    {React.Children.map(children, (child) => {
      const childElement = child as React.ReactElement<ToggleGroupItemProps>;
      return React.cloneElement(childElement, {
        isSelected: value === childElement.props.value,
        onSelect: () => onValueChange(childElement.props.value)
      });
    })}
  </div>
);

const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({
                                                           children,
                                                           isSelected,
                                                           onSelect,
                                                           icon,
                                                           color,
                                                           description
                                                         }) => (
  <button
    onClick={onSelect}
    className={`w-full relative overflow-hidden rounded-xl transition-all duration-200 group ${
      isSelected
        ? 'border-2 shadow-lg'
        : 'bg-zinc-900/50 border border-zinc-700/50 hover:border-zinc-600/50 hover:bg-zinc-800/50'
    }`}
    style={{
      borderColor: isSelected ? color : undefined,
      backgroundColor: isSelected ? `${color}10` : undefined,
      boxShadow: isSelected ? `0 4px 20px ${color}30` : undefined
    }}
  >
    <div className="relative z-10 p-4 flex items-center gap-3">
      {/* Иконка */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold transition-all ${
          isSelected
            ? 'text-white shadow-lg'
            : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
        }`}
        style={{
          backgroundColor: isSelected ? color : undefined
        }}
      >
        {icon}
      </div>

      <div className="flex-1 text-left">
        <div className={`font-semibold transition-colors ${
          isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'
        }`}>
          {children}
        </div>
        {description && (
          <div className={`text-xs mt-1 transition-colors ${
            isSelected ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-400'
          }`}>
            {description}
          </div>
        )}
      </div>

      {/* Индикатор выбора */}
      <div
        className={`w-3 h-3 rounded-full transition-all ${
          isSelected ? 'shadow-lg' : 'bg-zinc-700'
        }`}
        style={{
          backgroundColor: isSelected ? color : undefined
        }}
      />
    </div>
  </button>
);

const getColorRGB = (colorClass: string): string => {
  const colorMap: { [key: string]: string } = {
    'bg-gray-800': '31, 41, 55',
    'bg-blue-500': '59, 130, 246',
    'bg-green-500': '34, 197, 94',
    'bg-red-500': '239, 68, 68',
    'bg-orange-500': '249, 115, 22'
  };
  return colorMap[colorClass] || '59, 130, 246';
};

// Компонент для анимации волн
const WaveAnimation: React.FC<WaveAnimationProps> = ({ isVisible, color = 'blue' }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute border-2 rounded-full`}
        initial={{ scale: 0, opacity: 1 }}
        animate={isVisible ? {
          scale: [0, 2, 3],
          opacity: [1, 0.5, 0]
        } : {}}
        transition={{
          duration: 1.5,
          delay: i * 0.3,
          ease: "easeOut"
        }}
        style={{
          width: 60,
          height: 60,
          borderColor: `rgb(${getColorRGB(color)})`,
        }}
      />
    ))}
  </div>
);

// Компонент для анимированных тегов
const AnimatedTags: React.FC<{ tags: string[]; animationKey: number }> = ({ tags, animationKey }) => (
  <motion.div
    key={`tags-${animationKey}`}
    className="flex flex-wrap gap-2 mt-3"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.7, duration: 0.5 }}
  >
    {tags.map((tag, index) => (
      <motion.span
        key={tag}
        className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-md border border-zinc-700"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.8 + index * 0.1,
          duration: 0.3,
          type: "spring",
          stiffness: 200
        }}
      >
        {tag}
      </motion.span>
    ))}
  </motion.div>
);

// Основной компонент модального окна
export const CreateProjectModal: React.FC<IProps> = (props) => {
  const [selectedProject, setSelectedProject] = useState<string>('nextjs');
  const [animationKey, setAnimationKey] = useState<number>(0);

  const projects: Project[] = [
    {
      value: 'nextjs',
      label: 'Next.js',
      color: '#42506a',
      snowColor: '#ffffff',
      description: 'React framework for production',
      tags: ['React', 'SSR', 'TypeScript', 'Full-stack'],
      icon: '▲',
      gradient: 'bg-gray-800'
    },
    {
      value: 'react',
      label: 'React',
      color: '#3b82f6',
      snowColor: '#61dafb',
      description: 'JavaScript library for UI',
      tags: ['JavaScript', 'SPA', 'Components', 'Virtual DOM'],
      icon: '⚛',
      gradient: 'bg-blue-500'
    },
    {
      value: 'vue',
      label: 'Vue.js',
      color: '#22c55e',
      snowColor: '#4fc08d',
      description: 'Progressive JavaScript framework',
      tags: ['Progressive', 'Reactive', 'Lightweight', 'Easy to learn'],
      icon: '🅥',
      gradient: 'bg-green-500'
    },
    {
      value: 'angular',
      label: 'Angular',
      color: '#ef4444',
      snowColor: '#dd0031',
      description: 'Platform for web applications',
      tags: ['TypeScript', 'Enterprise', 'CLI', 'Material Design'],
      icon: '🅰',
      gradient: 'bg-red-500'
    },
    {
      value: 'svelte',
      label: 'Svelte',
      color: '#f97316',
      snowColor: '#ff3e00',
      description: 'Compile-time optimized apps',
      tags: ['Compile-time', 'No runtime', 'Small bundle', 'Performance'],
      icon: '🔥',
      gradient: 'bg-orange-500'
    }
  ];

  const currentProject: Project | undefined = projects.find(p => p.value === selectedProject);

  const handleProjectChange = (value: string): void => {
    if (value && value !== selectedProject) {
      setSelectedProject(value);
      setAnimationKey(prev => prev + 1);
    }
  };

  return (
    <Modal
      {...props}
      title={''}
      description={''}
      dialogStyle={'max-w-4xl'}
    >
      <div className='flex gap-6 min-h-[500px]'>
        {/* Улучшенная левая панель */}
        <motion.div
          className='w-80 relative'
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Декоративный фон */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 via-transparent to-zinc-900/20 rounded-xl" />

          <ToggleGroup
            value={selectedProject}
            onValueChange={handleProjectChange}
          >
            {projects.map(project => (
              <ToggleGroupItem
                key={project.value}
                value={project.value}
                icon={project.icon}
                color={project.color}
                description={project.description}
              >
                {project.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </motion.div>

        {/* Правая панель остается без изменений */}
        <div className='relative flex-1 min-h-[450px] bg-zinc-950 rounded-lg overflow-hidden'>
          <AnimatePresence>
            <WaveAnimation key={`waves-${animationKey}`} isVisible={true} color={currentProject?.color || 'bg-blue-500'}/>
          </AnimatePresence>

          <Snowfall
            snowflakeCount={15}
            color={currentProject?.snowColor || '#ffffff'}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          <div className='w-full h-full absolute top-0 left-0 bg-gradient-to-b from-transparent to-black'/>

          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProject}
                className={`w-20 h-20 ${currentProject?.gradient} rounded-full flex items-center justify-center shadow-lg relative z-10`}
                initial={{
                  y: 100,
                  scale: 0,
                  opacity: 0,
                  rotate: -180
                }}
                animate={{
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  rotate: 0
                }}
                exit={{
                  y: -100,
                  scale: 0.8,
                  opacity: 0,
                  rotate: 180
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  duration: 0.6
                }}
              >
                <span className="text-white font-bold text-lg">
                  {currentProject?.icon || currentProject?.label.charAt(0)}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            key={`bg-${animationKey}`}
            className="absolute inset-0 opacity-20"
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              ease: "easeInOut"
            }}
            style={{
              background: `radial-gradient(circle, ${currentProject?.color}40 0%, transparent 70%)`
            }}
          />

          <motion.div
            key={`text-${animationKey}`}
            className="absolute bottom-6 left-6 right-6 z-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h4 className="text-xl font-semibold text-white mb-2">
              {currentProject?.label}
            </h4>
            <p className="text-gray-400 text-sm mb-3">
              {currentProject?.description}
            </p>

            {currentProject && (
              <AnimatedTags
                tags={currentProject.tags}
                animationKey={animationKey}
              />
            )}
          </motion.div>
        </div>
      </div>
    </Modal>
  );
};