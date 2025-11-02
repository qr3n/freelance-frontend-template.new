import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  intersectionRatio?: number;
}

interface UseIntersectionObserverReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>({
                                                                                  threshold = 0.4,
                                                                                  rootMargin = '0px',
                                                                                  triggerOnce = true,
                                                                                  intersectionRatio = 0.3
                                                                                }: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn<T> => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((observerEntry) => {
          setEntry(observerEntry);

          if (observerEntry.isIntersecting && observerEntry.intersectionRatio >= intersectionRatio) {
            setIsIntersecting(true);

            if (triggerOnce && ref.current) {
              observer.unobserve(ref.current);
            }
          } else if (!triggerOnce) {
            setIsIntersecting(false);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Очистка observer при размонтировании компонента
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, intersectionRatio]);

  return { ref, isIntersecting, entry };
};