import { memo, useId, useMemo } from 'react';
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

const StarSVG = ({ starColor }: { starColor: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-full h-full">
    <path
      fill={starColor}
      d="M126.6,10.4c-0.4,0.2-1.2,4.8-2.4,13.4c-3.3,25.3-5.9,39-9.8,50.5c-6,17.9-14.9,28.6-29.9,36c-12.1,6-28.5,9.7-60.7,13.9C10.9,126,10,126.2,10,128c0,1.8,0.9,2.1,10.1,3.2c48.2,6.1,66.4,11.8,79.6,25c12.9,12.9,18.6,30.6,24.5,75.9c1.7,12.9,1.9,13.8,3.7,13.8s2.1-0.9,3.5-12.1c6-46.8,11.7-64.6,24.8-77.6c13.2-13.2,31.4-18.9,79.6-25c9.2-1.2,10.1-1.5,10.1-3.2c0-1.8-0.9-2-13.8-3.7c-25-3.2-38.4-5.9-49.6-9.5c-18.5-6-29.3-14.8-36.7-29.7c-6.3-12.7-9.9-28.5-14.4-62.9c-1-7.5-1.7-11.4-2.1-11.7C128.5,9.9,127.5,9.9,126.6,10.4z"
    />
  </svg>
);

export type SizeValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | number;

interface ShimmerSquareProps {
  className?: string;
  starColor?: string;
  shimmerColor?: string;
  // Базовый размер (без префикса) - можно использовать строку или число в пикселях
  size?: SizeValue;
  // Адаптивные размеры для всех брейкпоинтов Tailwind
  responsiveSizes?: {
    sm?: SizeValue;  // >= 640px
    md?: SizeValue;  // >= 768px
    lg?: SizeValue;  // >= 1024px
    xl?: SizeValue;  // >= 1280px
    '2xl'?: SizeValue; // >= 1536px
  };
}

export const ShimmerStar = memo(({
                                     className,
                                     starColor = "#14532d",
                                     shimmerColor = "emerald-400",
                                     size = "md",
                                     responsiveSizes
                                   }: ShimmerSquareProps) => {
  const reactId = useId();
  const uniqueId = useMemo(() => `star-${reactId.replace(/:/g, '')}`, [reactId]);


  const responsiveClassName = useMemo(() => {
    const hasCustomSizes = responsiveSizes && Object.values(responsiveSizes).some(v => typeof v === 'number');
    return hasCustomSizes ? uniqueId : '';
  }, [responsiveSizes, uniqueId]);

  const sizeClasses = useMemo(() => {
    // Полная карта всех возможных комбинаций размеров и брейкпоинтов
    const responsiveMap: Record<string, string> = {
      // Базовые размеры
      'base-xs': 'w-6 h-6',
      'base-sm': 'w-8 h-8',
      'base-md': 'w-12 h-12',
      'base-lg': 'w-16 h-16',
      'base-xl': 'w-24 h-24',
      'base-2xl': 'w-32 h-32',
      'base-3xl': 'w-40 h-40',
      'base-4xl': 'w-48 h-48',

      // SM брейкпоинт
      'sm-xs': 'sm:w-6 sm:h-6',
      'sm-sm': 'sm:w-8 sm:h-8',
      'sm-md': 'sm:w-12 sm:h-12',
      'sm-lg': 'sm:w-16 sm:h-16',
      'sm-xl': 'sm:w-24 sm:h-24',
      'sm-2xl': 'sm:w-32 sm:h-32',
      'sm-3xl': 'sm:w-40 sm:h-40',
      'sm-4xl': 'sm:w-48 sm:h-48',

      // MD брейкпоинт
      'md-xs': 'md:w-6 md:h-6',
      'md-sm': 'md:w-8 md:h-8',
      'md-md': 'md:w-12 md:h-12',
      'md-lg': 'md:w-16 md:h-16',
      'md-xl': 'md:w-24 md:h-24',
      'md-2xl': 'md:w-32 md:h-32',
      'md-3xl': 'md:w-40 md:h-40',
      'md-4xl': 'md:w-48 md:h-48',

      // LG брейкпоинт
      'lg-xs': 'lg:w-6 lg:h-6',
      'lg-sm': 'lg:w-8 lg:h-8',
      'lg-md': 'lg:w-12 lg:h-12',
      'lg-lg': 'lg:w-16 lg:h-16',
      'lg-xl': 'lg:w-24 lg:h-24',
      'lg-2xl': 'lg:w-32 lg:h-32',
      'lg-3xl': 'lg:w-40 lg:h-40',
      'lg-4xl': 'lg:w-48 lg:h-48',

      // XL брейкпоинт
      'xl-xs': 'xl:w-6 xl:h-6',
      'xl-sm': 'xl:w-8 xl:h-8',
      'xl-md': 'xl:w-12 xl:h-12',
      'xl-lg': 'xl:w-16 xl:h-16',
      'xl-xl': 'xl:w-24 xl:h-24',
      'xl-2xl': 'xl:w-32 xl:h-32',
      'xl-3xl': 'xl:w-40 xl:h-40',
      'xl-4xl': 'xl:w-48 xl:h-48',

      // 2XL брейкпоинт
      '2xl-xs': '2xl:w-6 2xl:h-6',
      '2xl-sm': '2xl:w-8 2xl:h-8',
      '2xl-md': '2xl:w-12 2xl:h-12',
      '2xl-lg': '2xl:w-16 2xl:h-16',
      '2xl-xl': '2xl:w-24 2xl:h-24',
      '2xl-2xl': '2xl:w-32 2xl:h-32',
      '2xl-3xl': '2xl:w-40 2xl:h-40',
      '2xl-4xl': '2xl:w-48 2xl:h-48',
    };

    const classes: string[] = [];

    // Базовый размер
    if (typeof size === 'number') {
      // Если размер число, не добавляем класс (используем inline стили)
      classes.push('');
    } else {
      classes.push(responsiveMap[`base-${size}`]);
    }

    // Добавляем адаптивные классы
    if (responsiveSizes) {
      if (responsiveSizes.sm && typeof responsiveSizes.sm !== 'number') {
        classes.push(responsiveMap[`sm-${responsiveSizes.sm}`]);
      }
      if (responsiveSizes.md && typeof responsiveSizes.md !== 'number') {
        classes.push(responsiveMap[`md-${responsiveSizes.md}`]);
      }
      if (responsiveSizes.lg && typeof responsiveSizes.lg !== 'number') {
        classes.push(responsiveMap[`lg-${responsiveSizes.lg}`]);
      }
      if (responsiveSizes.xl && typeof responsiveSizes.xl !== 'number') {
        classes.push(responsiveMap[`xl-${responsiveSizes.xl}`]);
      }
      if (responsiveSizes['2xl'] && typeof responsiveSizes['2xl'] !== 'number') {
        classes.push(responsiveMap[`2xl-${responsiveSizes['2xl']}`]);
      }
    }

    return classes.filter(Boolean).join(' ');
  }, [size, responsiveSizes]);

  const customSizeStyle = useMemo(() => {
    const style: React.CSSProperties = {};

    // Базовый размер в пикселях
    if (typeof size === 'number') {
      style.width = `${size}px`;
      style.height = `${size}px`;
    }

    return style;
  }, [size]);

  const responsiveStyles = useMemo(() => {
    if (!responsiveSizes) return '';

    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    };

    let styles = '';

    Object.entries(responsiveSizes).forEach(([breakpoint, value]) => {
      if (typeof value === 'number') {
        const bp = breakpoints[breakpoint as keyof typeof breakpoints];
        styles += `
          @media (min-width: ${bp}px) {
            .${uniqueId} {
              width: ${value}px !important;
              height: ${value}px !important;
            }
          }
        `;
      }
    });

    return styles;
  }, [responsiveSizes, uniqueId]);

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

  const shimmerGradient = useMemo(() => {
    if (shimmerColor.includes('-')) {
      return `bg-gradient-to-r from-transparent via-${shimmerColor}/30 to-transparent`;
    }
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
      {responsiveStyles && <style>{responsiveStyles}</style>}
      <div className={cn("relative", sizeClasses, responsiveClassName)} style={customSizeStyle}>
        <div
          className="w-full h-full"
          style={{
            transform: 'translateZ(0)',
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
          <div
            className={shimmerGradient || "absolute inset-0"}
            style={{
              width: '50%',
              height: '100%',
              transform: 'translateZ(0) skewX(-20deg)',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              ...shimmerStyle,
              animation: 'shimmer 2s ease-in-out 0.8s infinite'
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-60%) translateZ(0) skewX(-20deg); }
          100% { transform: translateX(160%) translateZ(0) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
});

ShimmerStar.displayName = 'ShimmerStar'