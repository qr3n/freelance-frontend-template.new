import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Регистрируем плагин (делается один раз в приложении)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

interface UseTextRevealAnimationOptions {
  /**
   * Длительность анимации одной буквы (в секундах)
   * @default 0.5
   */
  duration?: number;

  /**
   * Задержка между анимацией букв (в секундах)
   * @default 0.05
   */
  stagger?: number;

  /**
   * Easing функция
   * @default "power1.inOut"
   */
  ease?: string;

  /**
   * Задержка перед началом анимации (в секундах)
   * @default 0
   */
  delay?: number;

  /**
   * Цвет текста
   * @default undefined (использует CSS цвет)
   */
  color?: string;

  /**
   * Порог видимости элемента для запуска анимации (0-1)
   * 0 = как только хоть пиксель виден
   * 1 = когда элемент полностью виден
   * @default 0.2
   */
  threshold?: number;

  /**
   * Отступ для запуска анимации (в пикселях)
   * Положительное значение = анимация начнется раньше
   * Отрицательное значение = анимация начнется позже
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * Анимировать только один раз или при каждом появлении
   * @default true
   */
  once?: boolean;
}

/**
 * Хук для анимации появления текста с эффектом поднятия букв снизу вверх
 * Анимация запускается только когда элемент входит в область видимости
 *
 * @example
 * const textRef = useTextRevealAnimation({ duration: 0.6, stagger: 0.08 });
 *
 * return (
 *   <span ref={textRef} style={{ display: 'inline-block', overflow: 'hidden' }}>
 *     Ваш AI-агент
 *   </span>
 * );
 */
export function useTextRevealAnimation<T extends HTMLElement = HTMLSpanElement>(
  options: UseTextRevealAnimationOptions = {}
) {
  const {
    duration = 0.4,
    stagger = 0.04,
    ease = "power1.inOut",
    delay = 0,
    color = "white",
    threshold = 0.2,
    rootMargin = "0px",
    once = true
  } = options;

  const elementRef = useRef<T>(null);
  const splitRef = useRef<SplitText | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Создаем SplitText
    const split = new SplitText(element, {
      type: "chars"
    });
    splitRef.current = split;

    // Устанавливаем начальное состояние
    gsap.set(split.chars, {
      yPercent: 100,
      display: 'inline-block',
      ...(color && { color })
    });

    // Функция для запуска анимации
    const animate = () => {
      if (once && hasAnimated.current) return;

      gsap.to(split.chars, {
        yPercent: 0,
        duration,
        stagger,
        ease,
        delay,
        ...(color && { color })
      });

      hasAnimated.current = true;
    };

    // Создаем Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();

            // Если анимация одноразовая, отключаем observer
            if (once) {
              observer.disconnect();
            }
          } else if (!once && hasAnimated.current) {
            // Если анимация многоразовая и элемент ушел из вида,
            // сбрасываем состояние для повторной анимации
            gsap.set(split.chars, { yPercent: 100 });
            hasAnimated.current = false;
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    // Очистка
    return () => {
      observer.disconnect();
      split.revert();
      splitRef.current = null;
    };
  }, [duration, stagger, ease, delay, color, threshold, rootMargin, once]);

  return elementRef;
}

// Экспорт типов для удобства
export type { UseTextRevealAnimationOptions };