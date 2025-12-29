'use client';

import React from 'react';
import { useMultiVideoWithMask } from '@/shared/ui/image-to-video';

interface VideoSource {
  src: string;
  preload?: boolean;
}

interface ResponsiveSize {
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
}

interface ResponsiveSizes {
  default: ResponsiveSize;
  sm?: ResponsiveSize;
  md?: ResponsiveSize;
  lg?: ResponsiveSize;
  xl?: ResponsiveSize;
  '2xl'?: ResponsiveSize;
}

interface ImageToVideoWithMaskProps {
  imageSrc: string;
  videos: VideoSource[];
  maskSrc: string;
  step: number;
  width?: number | string;
  height?: number | string;
  className?: string;
  onVideoStart?: (step: number) => void;
  onVideoEnd?: (step: number) => void;
  onError?: (error: Error) => void;
  preloadAll?: boolean;
  transitionDuration?: number;
  loadingElement?: React.ReactNode;
  responsive?: ResponsiveSizes;
  loop?: boolean;
}

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

const ImageToVideoWithMask: React.FC<ImageToVideoWithMaskProps> = ({
                                                                     videos,
                                                                     maskSrc,
                                                                     step,
                                                                     width = 640,
                                                                     height = 360,
                                                                     className = '',
                                                                     onVideoStart,
                                                                     onVideoEnd,
                                                                     onError,
                                                                     preloadAll = true,
                                                                     transitionDuration = 300,
                                                                     loadingElement,
                                                                     responsive,
                                                                     loop = false
                                                                   }) => {
  const [currentSize, setCurrentSize] = React.useState<ResponsiveSize | null>(null);

  const {
    videoRefs,
    maskUrl,
    loadState,
    videosLoaded,
    handleVideoLoaded
  } = useMultiVideoWithMask(
    videos,
    maskSrc,
    step,
    onVideoStart,
    onVideoEnd,
    onError,
    preloadAll,
    loop
  );

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

  const currentIndex = step - 1;
  const allRequiredVideosLoaded = currentIndex >= 0 &&
    currentIndex < videos.length &&
    videosLoaded[currentIndex];

  const activeSize = responsive && currentSize ? currentSize : { width, height };
  const containerStyle = getContainerStyle(activeSize);

  // Показываем loader пока не загружены маска и текущее видео
  const showLoading = !loadState.maskLoaded || !allRequiredVideosLoaded;

  if (loadState.error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={containerStyle}
      >
        <p className="text-red-500 text-sm">Error: {loadState.error}</p>
      </div>
    );
  }

  const maskStyle = maskUrl ? {
    WebkitMaskImage: `url(${maskUrl})`,
    maskImage: `url(${maskUrl})`,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center'
  } : {};

  const defaultLoader = (
    <div className="text-sm text-gray-600">
    </div>
  );

  return (
    <div className={`relative ${className}`} style={containerStyle}>
      {videos.map((video, index) => {
        const shouldPreload = preloadAll || video.preload || index === currentIndex;
        const isActive = index === currentIndex;
        const isLoaded = videosLoaded[index];

        // Видео показывается только если оно активно И загружено И маска загружена
        const shouldShow = isActive && isLoaded && loadState.maskLoaded;

        return (
          <video
            key={`${video.src}-${index}`}
            ref={el => videoRefs.current[index] = el}
            src={video.src}
            muted
            loop={false}
            preload={shouldPreload ? 'auto' : 'none'}
            onCanPlayThrough={() => handleVideoLoaded(index)}
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{
              ...maskStyle,
              opacity: shouldShow ? 1 : 0,
              transition: `opacity ${transitionDuration}ms ease-in-out`,
              pointerEvents: isActive ? 'auto' : 'none'
            }}
          />
        );
      })}

      {/* Loading элемент с плавным исчезновением - всегда в DOM */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity"
        style={{
          opacity: showLoading ? 1 : 0,
          pointerEvents: 'none',
          transitionDuration: `${transitionDuration}ms`
        }}
      >
        {loadingElement !== undefined ? loadingElement : defaultLoader}
      </div>
    </div>
  );
};

function getContainerStyle(size: ResponsiveSize): React.CSSProperties {
  const style: React.CSSProperties = {};

  if (size.width !== undefined) {
    style.width = typeof size.width === 'number' ? `${size.width}px` : size.width;
  }

  if (size.height !== undefined) {
    style.height = typeof size.height === 'number' ? `${size.height}px` : size.height;
  }

  if (size.aspectRatio) {
    style.aspectRatio = size.aspectRatio;
    if (!size.height) {
      style.height = 'auto';
    }
  }

  return style;
}

export default ImageToVideoWithMask;