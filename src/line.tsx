import React, { useEffect, useRef, useState } from 'react';

/**
 * Компонент анимированной линии, которая рисуется при скролле
 * @param strokeColor - цвет обводки (по умолчанию градиент)
 * @param strokeWidth - толщина линии (по умолчанию 500)
 * @param className - дополнительные классы для контейнера
 * @param zIndex - z-index для SVG (по умолчанию 10)
 * @param startOffset - начальный оффсет в vh (по умолчанию 0), когда линия начинает рисоваться
 * @param animationSpeed - множитель скорости анимации (по умолчанию 1.5) - чем больше, тем медленнее
 */
export default function ScrollAnimatedLine({
                                             strokeColor,
                                             strokeWidth = 500,
                                             className = '',
                                             zIndex = 10,
                                             startOffset = 0,
                                             animationSpeed = 0.5
                                           }) {
  const pathRef = useRef(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Вычисляем высоту контейнера на основе пропорций SVG
  useEffect(() => {
    const calculateHeight = () => {
      if (!svgRef.current) return;

      const viewBox = svgRef.current.viewBox.baseVal;
      const svgWidth = viewBox.width;
      const svgHeight = viewBox.height;
      const aspectRatio = svgHeight / svgWidth;

      // Высота в vh на основе ширины окна и пропорций SVG
      const windowWidth = window.innerWidth;
      const calculatedHeight = windowWidth * aspectRatio * animationSpeed;

      setContainerHeight(calculatedHeight);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, [animationSpeed]);

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;

    if (!path || !container) return;

    const pathLength = path.getTotalLength();

    // Устанавливаем начальное состояние
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    // Функция для обновления анимации при скролле
    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;

      // Вычисляем оффсет в пикселях
      const offsetPixels = (startOffset / 100) * windowHeight;

      // Вычисляем прогресс скролла через контейнер с учетом оффсета
      const adjustedTop = containerTop + offsetPixels;
      const rawProgress = (windowHeight - adjustedTop) / (containerHeight + windowHeight - offsetPixels);
      const scrollProgress = Math.max(0, Math.min(1, rawProgress));

      // Обновляем strokeDashoffset
      const drawLength = pathLength * scrollProgress;
      path.style.strokeDashoffset = `${pathLength - drawLength}`;
    };

    // Добавляем слушатель скролла
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Вызываем сразу для начального состояния

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [startOffset, containerHeight]);

  return (
    <div
      ref={containerRef}
      className={`absolute top-0 left-0 w-full pointer-events-none ${className}`}
      style={{
        width: '100dvw',
        height: `${containerHeight}px`
      }}
    >
      {/* SVG который скроллится вместе со страницей */}
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 w-full pointer-events-none"
        viewBox="0 0 1660 1166"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: '100dvw',
          zIndex,
        }}
      >
        {!strokeColor && (
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        )}

        {/* SVG линия */}
        <path
          ref={pathRef}
          d="M1.57971 29.9584C267.08 43.9584 448.58 202.958 418.58 503.958C388.58 804.958 190.08 847.458 143.08 816.958C96.0797 786.458 77.5552 678.958 219.58 559.958C361.604 440.958 516.08 493.958 835.58 932.958C1155.08 1371.96 1195.08 949.921 1319.58 1011.96C1444.08 1074 1371.58 877.958 1469.58 950.958C1567.58 1023.96 1637.58 950.958 1637.58 950.958"
          fill="none"
          stroke={strokeColor || "url(#lineGradient)"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={!strokeColor ? "url(#glow)" : undefined}
          style={{
            willChange: 'stroke-dashoffset',
          }}
        />
      </svg>
    </div>
  );
}