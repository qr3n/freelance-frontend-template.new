import { useRef, useEffect, useState, useCallback } from 'react';
import { MediaLoadState } from './types';

export const useImageToVideoWithMask = (
  imageSrc: string,
  videoSrc: string,
  svgMaskSrc: string, // SVG маска
  onVideoStart?: () => void,
  onError?: (error: Error) => void,
  preload: 'auto' | 'metadata' | 'none' = 'auto'
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(null);

  const [loadState, setLoadState] = useState<MediaLoadState & { maskLoaded: boolean }>({
    imageLoaded: false,
    videoLoaded: false,
    maskLoaded: false,
    isPlaying: false,
    error: null
  });

  // Создание маски из SVG
  const createSVGMask = useCallback(async (svgSrc: string, width: number, height: number) => {
    try {
      // Загружаем SVG
      const response = await fetch(svgSrc);
      const svgText = await response.text();

      // Создаем Blob из SVG
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Создаем изображение из SVG
      const img = new Image();
      img.crossOrigin = 'anonymous';

      return new Promise<HTMLCanvasElement>((resolve, reject) => {
        img.onload = () => {
          // Создаем canvas для маски
          const maskCanvas = document.createElement('canvas');
          maskCanvas.width = width;
          maskCanvas.height = height;
          const maskCtx = maskCanvas.getContext('2d');

          if (!maskCtx) {
            reject(new Error('Failed to get mask canvas context'));
            return;
          }

          // Рисуем SVG на canvas маски
          maskCtx.drawImage(img, 0, 0, width, height);

          // Освобождаем URL
          URL.revokeObjectURL(svgUrl);
          resolve(maskCanvas);
        };

        img.onerror = () => {
          URL.revokeObjectURL(svgUrl);
          reject(new Error('Failed to load SVG mask'));
        };

        img.src = svgUrl;
      });
    } catch (error) {
      throw new Error(`Failed to create SVG mask: ${error}`);
    }
  }, []);

  // Функция для применения маски и рисования изображения
  const drawImageWithMask = useCallback((
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    maskCanvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Метод 1: Использование globalCompositeOperation
    // Сначала рисуем маску
    ctx.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);

    // Устанавливаем режим композиции для применения маски
    ctx.globalCompositeOperation = 'source-in';

    // Рисуем изображение с применением маски
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Возвращаем обычный режим композиции
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  // Функция для применения маски и рисования видео
  const drawVideoWithMask = useCallback((
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement,
    maskCanvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Применяем маску
    ctx.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  // Загрузка и создание маски
  useEffect(() => {
    if (!svgMaskSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;

    createSVGMask(svgMaskSrc, canvas.width, canvas.height)
      .then((maskCanvas) => {
        maskCanvasRef.current = maskCanvas;
        setLoadState(prev => ({ ...prev, maskLoaded: true }));
      })
      .catch((error) => {
        setLoadState(prev => ({ ...prev, error: error.message }));
        onError?.(error);
      });
  }, [svgMaskSrc, createSVGMask, onError]);

  // Функция для рисования изображения на canvas с маской
  const drawImage = useCallback((canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    if (maskCanvasRef.current) {
      drawImageWithMask(canvas, image, maskCanvasRef.current);
    } else {
      // Fallback без маски
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
  }, [drawImageWithMask]);

  // Функция для рисования видео на canvas с маской
  const drawVideo = useCallback((canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
    if (maskCanvasRef.current) {
      drawVideoWithMask(canvas, video, maskCanvasRef.current);
    } else {
      // Fallback без маски
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  }, [drawVideoWithMask]);

  // Анимационный цикл для видео
  const renderVideoFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video || video.paused || video.ended) {
      return;
    }

    drawVideo(canvas, video);
    animationFrameRef.current = requestAnimationFrame(renderVideoFrame);
  }, [drawVideo]);

  // Загрузка изображения
  useEffect(() => {
    if (!imageSrc) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      imageRef.current = image;
      setLoadState(prev => ({ ...prev, imageLoaded: true }));

      // Рисуем изображение на canvas сразу после загрузки
      const canvas = canvasRef.current;
      if (canvas && image.complete) {
        drawImage(canvas, image);
      }
    };

    image.onerror = () => {
      const error = new Error(`Failed to load image: ${imageSrc}`);
      setLoadState(prev => ({ ...prev, error: error.message }));
      onError?.(error);
    };

    image.src = imageSrc;

    return () => {
      if (imageRef.current) {
        imageRef.current.onload = null;
        imageRef.current.onerror = null;
      }
    };
  }, [imageSrc, drawImage, onError]);

  // Загрузка видео
  useEffect(() => {
    if (!videoSrc) return;

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = preload;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const handleCanPlayThrough = () => {
      videoRef.current = video;
      setLoadState(prev => ({ ...prev, videoLoaded: true }));
    };

    const handleError = () => {
      const error = new Error(`Failed to load video: ${videoSrc}`);
      setLoadState(prev => ({ ...prev, error: error.message }));
      onError?.(error);
    };

    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('error', handleError);
    video.src = videoSrc;

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('error', handleError);
      if (videoRef.current === video) {
        video.pause();
        videoRef.current = null;
      }
    };
  }, [videoSrc, preload, onError]);

  // Запуск видео после полной загрузки
  useEffect(() => {
    if (!loadState.videoLoaded || loadState.isPlaying) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    video.play().then(() => {
      setLoadState(prev => ({ ...prev, isPlaying: true }));
      onVideoStart?.();
      renderVideoFrame();
    }).catch((error) => {
      const err = new Error(`Failed to play video: ${error.message}`);
      setLoadState(prev => ({ ...prev, error: err.message }));
      onError?.(err);
    });
  }, [loadState.videoLoaded, loadState.isPlaying, renderVideoFrame, onVideoStart, onError]);

  // Очистка анимации при размонтировании
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    canvasRef,
    loadState,
    imageRef,
    videoRef,
    maskCanvasRef
  };
};