'use client';

import React from 'react';
import { useImageToVideoWithMask } from '@/shared/ui/image-to-video';

interface ImageToVideoWithMaskProps {
  imageSrc: string;
  videoSrc: string;
  maskSrc: string;
  width?: number;
  height?: number;
  className?: string;
  onVideoStart?: () => void;
  onError?: (error: Error) => void;
  preload?: 'auto' | 'metadata' | 'none';
}

const ImageToVideoWithMask: React.FC<ImageToVideoWithMaskProps> = ({
                                                                     imageSrc,
                                                                     videoSrc,
                                                                     maskSrc,
                                                                     width = 640,
                                                                     height = 360,
                                                                     className = '',
                                                                     onVideoStart,
                                                                     onError,
                                                                     preload = 'auto'
                                                                   }) => {
  const { canvasRef, loadState } = useImageToVideoWithMask(
    imageSrc,
    videoSrc,
    maskSrc,
    onVideoStart,
    onError,
    preload
  );

  if (loadState.error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width, height }}
      >
        <p className="text-red-500 text-sm">Error: {loadState.error}</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block w-full h-full object-cover"
        style={{
          maxWidth: '100%',
          height: 'auto',
          transform: 'translateZ(0)',
          willChange: 'transform'
      }}
      />

      {/* Loading indicator */}
      {(!loadState.imageLoaded || !loadState.maskLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-sm text-gray-600">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default ImageToVideoWithMask;