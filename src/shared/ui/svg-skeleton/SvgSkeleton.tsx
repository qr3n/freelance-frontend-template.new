import * as React from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

type ResponsiveSize = {
  width?: number;
  height?: number;
};

type ResponsiveConfig = {
  default: ResponsiveSize;
  sm?: ResponsiveSize;
  md?: ResponsiveSize;
  lg?: ResponsiveSize;
  xl?: ResponsiveSize;
  '2xl'?: ResponsiveSize;
};

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export interface SvgSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  svg: React.ReactNode | string;
  size?: number;
  width?: number;
  height?: number;
  isLoading?: boolean;
  variant?: 'light' | 'dark';
  responsive?: ResponsiveConfig;
  color?: string;
}

export const SvgSkeleton = React.forwardRef<HTMLDivElement, SvgSkeletonProps>(
  ({
     className,
     svg,
     size,
     width,
     height,
     isLoading = true,
     variant = 'light',
     responsive,
     color,
     ...props
   }, ref) => {
    const maskId = React.useId();
    const gradientId = React.useId();
    const [currentSize, setCurrentSize] = React.useState<ResponsiveSize | null>(null);
    const [svgContent, setSvgContent] = React.useState<{
      paths: string[]
      viewBox: string
      originalWidth: number
      originalHeight: number
    } | null>(null);

    // Responsive размеры
    React.useEffect(() => {
      if (!responsive) return;

      const updateSize = () => {
        const windowWidth = window.innerWidth;
        let size = responsive.default;

        if (responsive['2xl'] && windowWidth >= BREAKPOINTS['2xl']) {
          size = { ...responsive.default, ...responsive['2xl'] };
        } else if (responsive.xl && windowWidth >= BREAKPOINTS.xl) {
          size = { ...responsive.default, ...responsive.xl };
        } else if (responsive.lg && windowWidth >= BREAKPOINTS.lg) {
          size = { ...responsive.default, ...responsive.lg };
        } else if (responsive.md && windowWidth >= BREAKPOINTS.md) {
          size = { ...responsive.default, ...responsive.md };
        } else if (responsive.sm && windowWidth >= BREAKPOINTS.sm) {
          size = { ...responsive.default, ...responsive.sm };
        }

        setCurrentSize(size);
      };

      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }, [responsive]);

    React.useEffect(() => {
      let svgString = '';

      if (typeof svg === 'string') {
        svgString = svg;
      } else if (React.isValidElement(svg)) {
        const svgElement = svg as React.ReactElement<any>;
        if (svgElement.type === 'svg') {
          const children = React.Children.toArray(svgElement.props.children);
          const paths: string[] = [];

          const extractPaths = (child: any) => {
            if (React.isValidElement(child)) {
              if (child.type === 'path' && child.props.d) {
                paths.push(child.props.d);
              }
              if (child.props.children) {
                React.Children.forEach(child.props.children, extractPaths);
              }
            }
          };

          children.forEach(extractPaths);

          setSvgContent({
            paths,
            viewBox: svgElement.props.viewBox || '0 0 24 24',
            originalWidth: parseFloat(svgElement.props.width) || 24,
            originalHeight: parseFloat(svgElement.props.height) || 24,
          });
          return;
        }
      }

      if (svgString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');

        if (svgEl) {
          const pathElements = svgEl.querySelectorAll('path');
          const paths = Array.from(pathElements)
            .map(p => p.getAttribute('d'))
            .filter((d): d is string => d !== null);

          setSvgContent({
            paths,
            viewBox: svgEl.getAttribute('viewBox') || '0 0 24 24',
            originalWidth: parseFloat(svgEl.getAttribute('width') || '24'),
            originalHeight: parseFloat(svgEl.getAttribute('height') || '24'),
          });
        }
      }
    }, [svg]);

    if (!svgContent || svgContent.paths.length === 0) {
      return null;
    }

    // Определяем финальные размеры
    const activeSize = responsive && currentSize
      ? currentSize
      : { width: width || size || svgContent.originalWidth, height: height || size || svgContent.originalHeight };

    const finalWidth = activeSize.width ?? svgContent.originalWidth;
    const finalHeight = activeSize.height ?? svgContent.originalHeight;

    // Цвета для градиента в зависимости от варианта
    const gradientColors = variant === 'light'
      ? ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']
      : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0)'];

    return (
      <div
        ref={ref}
        className={cn('inline-flex iatems-center justify-center', className)}
        style={{
          width: finalWidth,
          height: finalHeight,
          color: color || 'currentColor'
        }}
        {...props}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={svgContent.viewBox}
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Маска для формы SVG */}
            <mask id={maskId}>
              <rect width="100%" height="100%" fill="black" />
              {svgContent.paths.map((path, idx) => (
                <path key={idx} d={path} fill="white" />
              ))}
            </mask>

            {/* Анимированный градиент */}
            {isLoading && (
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradientColors[0]} />
                <stop offset="50%" stopColor={gradientColors[1]} />
                <stop offset="100%" stopColor={gradientColors[2]} />
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  from="-1 0"
                  to="1 0"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            )}
          </defs>

          {/* Базовая форма с текущим цветом */}
          <rect
            width="100%"
            height="100%"
            fill={color || 'currentColor'}
            mask={`url(#${maskId})`}
          />

          {/* Анимированный слой поверх */}
          {isLoading && (
            <rect
              width="100%"
              height="100%"
              fill={`url(#${gradientId})`}
              mask={`url(#${maskId})`}
            />
          )}
        </svg>
      </div>
    );
  },
);

SvgSkeleton.displayName = 'SvgSkeleton';
