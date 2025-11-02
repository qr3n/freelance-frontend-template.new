import { memo, useMemo } from 'react';
import { cn } from '@/shared/shadcn/lib/utils';
import { StarSVG } from '@/shared/ui/svg/ui/StarSvg';
import { motion } from 'framer-motion';

export const ShimmerSquare = memo(({
                                     className,
                                     starColor = "#14532d",
                                     shimmerColor = "emerald-400"
                                   }: {
  className?: string;
  starColor?: string;
  shimmerColor?: string;
}) => {
  const starMaskStyle = useMemo(() => ({
    mask: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'><path fill='white' d='M126.6,10.4c-0.4,0.2-1.2,4.8-2.4,13.4c-3.3,25.3-5.9,39-9.8,50.5c-6,17.9-14.9,28.6-29.9,36c-12.1,6-28.5,9.7-60.7,13.9C10.9,126,10,126.2,10,128c0,1.8,0.9,2.1,10.1,3.2c48.2,6.1,66.4,11.8,79.6,25c12.9,12.9,18.6,30.6,24.5,75.9c1.7,12.9,1.9,13.8,3.7,13.8s2.1-0.9,3.5-12.1c6-46.8,11.7-64.6,24.8-77.6c13.2-13.2,31.4-18.9,79.6-25c9.2-1.2,10.1-1.5,10.1-3.2c0-1.8-0.9-2-13.8-3.7c-25-3.2-38.4-5.9-49.6-9.5c-18.5-6-29.3-14.8-36.7-29.7c-6.3-12.7-9.9-28.5-14.4-62.9c-1-7.5-1.7-11.4-2.1-11.7C128.5,9.9,127.5,9.9,126.6,10.4z'/></svg>")`,
    WebkitMask: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'><path fill='white' d='M126.6,10.4c-0.4,0.2-1.2,4.8-2.4,13.4c-3.3,25.3-5.9,39-9.8,50.5c-6,17.9-14.9,28.6-29.9,36c-12.1,6-28.5,9.7-60.7,13.9C10.9,126,10,126.2,10,128c0,1.8,0.9,2.1,10.1,3.2c48.2,6.1,66.4,11.8,79.6,25c12.9,12.9,18.6,30.6,24.5,75.9c1.7,12.9,1.9,13.8,3.7,13.8s2.1-0.9,3.5-12.1c6-46.8,11.7-64.6,24.8-77.6c13.2-13.2,31.4-18.9,79.6-25c9.2-1.2,10.1-1.5,10.1-3.2c0-1.8-0.9-2-13.8-3.7c-25-3.2-38.4-5.9-49.6-9.5c-18.5-6-29.3-14.8-36.7-29.7c-6.3-12.7-9.9-28.5-14.4-62.9c-1-7.5-1.7-11.4-2.1-11.7C128.5,9.9,127.5,9.9,126.6,10.4z'/></svg>")`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center'
  }), []);

  const shimmerTransition = useMemo(() => ({
    duration: 2,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatDelay: 0.8
  }), []);

  // Преобразуем Tailwind класс в CSS переменную для градиента
  const shimmerGradient = useMemo(() => {
    // Если это Tailwind класс, используем CSS переменную
    if (shimmerColor.includes('-')) {
      return `bg-gradient-to-r from-transparent via-${shimmerColor}/30 to-transparent`;
    }
    // Если это прямой цвет (hex, rgb и т.д.), создаем стиль
    return '';
  }, [shimmerColor]);

  const shimmerStyle = useMemo(() => {
    if (!shimmerColor.includes('-')) {
      return {
        background: `linear-gradient(to right, transparent, ${shimmerColor}30, transparent)`
      };
    }
    return {};
  }, [shimmerColor]);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative w-full h-full">
        {/* GPU-оптимизированная основа звезды */}
        <div
          className="w-full h-full"
          style={{
            transform: 'translateZ(0)', // Принудительно на GPU
            backfaceVisibility: 'hidden',
            perspective: 1000,
            willChange: 'auto'
          }}
        >
          <StarSVG starColor={starColor} />
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            ...starMaskStyle,
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          <motion.div
            className={shimmerGradient || "absolute inset-0"}
            initial={{ x: '-60%' }}
            animate={{ x: '160%' }}
            transition={shimmerTransition}
            style={{
              width: '50%',
              height: '100%',
              transform: 'translateZ(0) skewX(-20deg)',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              ...shimmerStyle
            }}
          />
        </div>
      </div>
    </div>
  );
});