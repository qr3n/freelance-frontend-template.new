import { useRef, useEffect, useState, useCallback } from 'react';
import { MediaLoadState } from './types';

interface VideoSource {
  src: string;
  preload?: boolean;
}

// Hook
export const useMultiVideoWithMask = (
  videos: VideoSource[],
  svgMaskSrc: string,
  step: number,
  onVideoStart?: (step: number) => void,
  onVideoEnd?: (step: number) => void,
  onError?: (error: Error) => void,
  preloadAll: boolean = true,
  loop: boolean = false // Новый параметр для зацикливания
) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [maskUrl, setMaskUrl] = useState<string>('');
  const [loadState, setLoadState] = useState<MediaLoadState & { maskLoaded: boolean }>({
    imageLoaded: true,
    videoLoaded: false,
    maskLoaded: false,
    isPlaying: false,
    error: null
  });
  const [videosLoaded, setVideosLoaded] = useState<boolean[]>(new Array(videos.length).fill(false));
  const hasPlayedRef = useRef<number>(-1);

  // Load mask
  useEffect(() => {
    if (!svgMaskSrc) return;

    fetch(svgMaskSrc)
      .then(response => response.text())
      .then(svgText => {
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        setMaskUrl(url);
        setLoadState(prev => ({ ...prev, maskLoaded: true }));
      })
      .catch((error) => {
        const err = new Error(`Failed to load mask: ${error.message}`);
        setLoadState(prev => ({ ...prev, error: err.message }));
        onError?.(err);
      });

    return () => {
      if (maskUrl) {
        URL.revokeObjectURL(maskUrl);
      }
    };
  }, [svgMaskSrc]);

  // Track video load states
  const handleVideoLoaded = useCallback((index: number) => {
    setVideosLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  }, []);

  // Handle video end with loop support
  const handleVideoEnd = useCallback((currentIndex: number) => {
    onVideoEnd?.(currentIndex + 1);

    if (loop) {
      const currentVideo = videoRefs.current[currentIndex];
      if (currentVideo) {
        currentVideo.currentTime = 0;
        currentVideo.play()
          .catch((error) => {
            const err = new Error(`Failed to loop video: ${error.message}`);
            setLoadState(prev => ({ ...prev, error: err.message }));
            onError?.(err);
          });
      }
    }
  }, [loop, onVideoEnd, onError]);

  // Set up video ended event listeners
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        const handler = () => handleVideoEnd(index);
        video.addEventListener('ended', handler);
        return () => video.removeEventListener('ended', handler);
      }
    });
  }, [handleVideoEnd]);

  // Play video when step changes
  useEffect(() => {
    const currentIndex = step - 1;
    if (currentIndex < 0 || currentIndex >= videos.length) return;
    if (!loadState.maskLoaded || !videosLoaded[currentIndex]) return;
    if (hasPlayedRef.current === currentIndex) return;

    const currentVideo = videoRefs.current[currentIndex];
    if (!currentVideo) return;

    // Reset and hide all other videos
    videoRefs.current.forEach((video, idx) => {
      if (video && idx !== currentIndex) {
        video.pause();
        video.currentTime = 0;
        video.style.opacity = '0';
      }
    });

    // Show and play current video
    currentVideo.style.opacity = '1';
    currentVideo.currentTime = 0;

    hasPlayedRef.current = currentIndex;

    currentVideo.play()
      .then(() => {
        setLoadState(prev => ({ ...prev, isPlaying: true }));
        onVideoStart?.(step);
      })
      .catch((error) => {
        const err = new Error(`Failed to play video ${step}: ${error.message}`);
        setLoadState(prev => ({ ...prev, error: err.message }));
        onError?.(err);
      });
  }, [step, videos.length, loadState.maskLoaded, videosLoaded, onVideoStart, onError]);

  // Reset played flag when step changes
  useEffect(() => {
    hasPlayedRef.current = -1;
  }, [step]);

  return {
    videoRefs,
    maskUrl,
    loadState,
    videosLoaded,
    handleVideoLoaded
  };
};