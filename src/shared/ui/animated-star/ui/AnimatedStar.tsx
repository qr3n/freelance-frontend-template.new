import { motion } from 'framer-motion';
import { useMemo, CSSProperties } from 'react';
import { ShimmerStar } from '@/app/ShimmerStar';

interface AnimatedStarProps {
  /** Позиция по горизонтали (left, right, или CSS значение) */
  horizontalPosition?: 'left' | 'right' | string;
  /** Позиция по вертикали (top, bottom, или CSS значение) */
  verticalPosition?: 'top' | 'bottom' | string;
  /** Размер звезды в пикселях */
  size?: number;
  /** Цвет мерцания */
  shimmerColor?: string;
  /** Цвет звезды */
  starColor?: string;
  /** Длительность анимации в секундах */
  duration?: number;
  /** Задержка между повторениями в секундах */
  repeatDelay?: number;
  /** CSS класс для дополнительной стилизации */
  className?: string;
  /** Z-index элемента */
  zIndex?: number;
}

export const AnimatedStar: React.FC<AnimatedStarProps> = ({
                                                            horizontalPosition = 'left',
                                                            verticalPosition = 'top',
                                                            size = 80,
                                                            shimmerColor = '#e0ffe6',
                                                            starColor = '#b8d8c0',
                                                            duration = 0.8,
                                                            repeatDelay = 4,
                                                            className = '',
                                                            zIndex = 'auto',
                                                          }) => {
  const spinTransition = useMemo(
    () => ({
      duration,
      ease: "easeOut" as const,
      repeat: Infinity,
      repeatDelay,
      times: [0, 0.3, 0.6, 1],
    }),
    [duration, repeatDelay]
  );

  const positionStyles = useMemo((): CSSProperties => {
    const styles: CSSProperties = {
      position: 'absolute',
      zIndex,
    };

    // Горизонтальная позиция
    if (horizontalPosition === 'left') {
      styles.left = 0;
    } else if (horizontalPosition === 'right') {
      styles.right = 0;
    } else {
      styles.left = horizontalPosition;
    }

    // Вертикальная позиция
    if (verticalPosition === 'top') {
      styles.top = 0;
    } else if (verticalPosition === 'bottom') {
      styles.bottom = 0;
    } else {
      styles.top = verticalPosition;
    }

    return styles;
  }, [horizontalPosition, verticalPosition, zIndex]);

  return (
    <motion.div
      className={className}
      style={{
        ...positionStyles,
        width: `${size}px`,
        height: `${size}px`,
        transform: "translateZ(0)",
        willChange: "transform",
      }}
      animate={{
        rotate: [0, 180],
      }}
      transition={spinTransition}
    >
      <ShimmerStar
        className="w-full h-full"
        shimmerColor={shimmerColor}
        starColor={starColor}
        size={size}
        responsiveSizes={{
          sm: 100,         // >= 640px
          md: 150,         // >= 768px
          lg: 200,         // >= 1024px
          xl: 250,         // >= 1280px
          '2xl': 300
        }}
      />
    </motion.div>
  );
};

