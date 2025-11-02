export interface ImageToVideoProps {
  imageSrc: string;
  videoSrc: string;
  width?: number;
  height?: number;
  className?: string;
  onVideoStart?: () => void;
  onError?: (error: Error) => void;
  preload?: 'auto' | 'metadata' | 'none';
}

export interface MediaLoadState {
  imageLoaded: boolean;
  videoLoaded: boolean;
  isPlaying: boolean;
  error: string | null;
}
