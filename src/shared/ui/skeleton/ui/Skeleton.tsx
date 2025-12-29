import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'light' | 'light';
  animation?: 'wave' | 'pulse' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
                                             width = '100%',
                                             height = '20px',
                                             borderRadius = '8px',
                                             className = '',
                                             variant = 'light',
                                             animation = 'wave',
                                           }) => {
  const styles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
  };

  const variantClass = variant === 'light' ? 'bg-gray-200' : 'bg-neutral-800';
  const animationClass = animation === 'wave' ? `skeleton-wave skeleton-${variant}` : animation === 'pulse' ? 'skeleton-pulse' : '';

  return (
    <>
      <style>{`
        @keyframes skeleton-wave {
          0% {
            transform: translateX(-100%) rotate(10deg);
          }
          100% {
            transform: translateX(200%) rotate(10deg);
          }
        }

        @keyframes skeleton-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .skeleton-wave {
          position: relative;
          overflow: hidden;
        }

        .skeleton-wave::after {
          content: '';
          position: absolute;
          top: -50%;
          left: 0;
          width: 50%;
          height: 200%;
          animation: skeleton-wave 1.5s infinite ease-in-out;
          transform-origin: center;
        }

        .skeleton-wave.skeleton-light::after {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent
          );
        }

        .skeleton-wave.skeleton-dark::after {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.03),
            transparent
          );
        }

        .skeleton-pulse {
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
      <div
        className={`${variantClass} ${animationClass} ${className}`}
        style={styles}
        aria-hidden="true"
      >
        &nbsp;
      </div>
    </>
  );
};


export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
                                                                                 lines = 3,
                                                                                 className = ''
                                                                               }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height={16}
        width={i === lines - 1 ? '70%' : '100%'}
      />
    ))}
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
                                                                                  size = 40,
                                                                                  className = ''
                                                                                }) => (
  <Skeleton
    width={size}
    height={size}
    borderRadius="50%"
    className={className}
  />
);

export const DishCardSkeleton = () => {
  return (
    <div className='p-4'>
      <Skeleton height={168} borderRadius={24} className="mb-2" />

      <Skeleton height={22} width="70%" borderRadius={8} className="mb-2" />

      <Skeleton height={14} width="90%" borderRadius={6} className="mb-1" />
      <Skeleton height={14} width="60%" borderRadius={6} className="mb-2" />

      {/* Footer with badge and price */}
      <div className='flex justify-between mt-2 items-center'>
        <Skeleton height={24} width={60} borderRadius={999} />
        <Skeleton height={36} width={80} borderRadius={999} />
      </div>
    </div>
  );
};