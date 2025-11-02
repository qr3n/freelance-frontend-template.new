"use client";

import { BellIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

interface UniversalToggleButtonProps {
  onClick?: (isToggled: boolean) => void;
  initialText?: string;
  toggledText?: string;
  showIcon?: boolean;
  iconComponent?: React.ReactNode;
  initialState?: boolean;
  animationDuration?: number;
  particleCount?: number;
  enableParticles?: boolean;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  id?: string;
  type?: "button" | "submit" | "reset";
  tabIndex?: number;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
  fixedWidth?: boolean;
  width?: string | number;
}

export const UniversalToggleButton: React.FC<UniversalToggleButtonProps> = ({
                                                                              onClick,
                                                                              initialText = "Subscribe",
                                                                              toggledText = "Subscribed",
                                                                              showIcon = true,
                                                                              iconComponent,
                                                                              initialState = false,
                                                                              animationDuration = 1200,
                                                                              particleCount = 20,
                                                                              enableParticles = true,
                                                                              className = "",
                                                                              style,
                                                                              disabled,
                                                                              id,
                                                                              type = "button",
                                                                              tabIndex,
                                                                              'aria-label': ariaLabel,
                                                                              'aria-describedby': ariaDescribedBy,
                                                                              'data-testid': dataTestId,
                                                                              fixedWidth = true,
                                                                              width,
                                                                            }) => {
  const [isToggled, setIsToggled] = useState(initialState);
  const [isAnimating, setIsAnimating] = useState(false);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, animationDuration]);

  const handleClick = () => {
    if (disabled) return;

    const newState = !isToggled;
    if (!isToggled) {
      setIsAnimating(true);
    }
    setIsToggled(newState);
    if (onClick) {
      onClick(newState);
    }
  };

  const createParticles = (count = particleCount) => {
    if (!enableParticles) return null;

    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 2 * Math.PI;
      const radius = Math.random() * 100 + 50;
      const endX = Math.cos(angle) * radius;
      const endY = Math.sin(angle) * radius;

      const shapes = ["circle", "star"];
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

      return (
        <motion.div
          key={i}
          className={`absolute ${
            randomShape === "circle" ? "rounded-full" : ""
          }`}
          initial={{
            opacity: 0,
            scale: 0,
            x: "-50%",
            y: "-50%",
            left: "50%",
            top: "50%",
            rotate: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, Math.random() * 0.5 + 0.7, 0],
            x: ["-50%", `calc(${endX}px - 50%)`],
            y: ["-50%", `calc(${endY}px - 50%)`],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: 1,
            delay: Math.random() * 0.1,
            ease: "easeInOut",
          }}
          style={{
            width: `${Math.random() * 2 + 10}px`,
            height: `${Math.random() * 2 + 10}px`,
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`,
            clipPath:
              randomShape === "star"
                ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                : "",
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
          }}
        />
      );
    });
  };

  const buttonBackgroundColor = {
    light: isToggled
      ? isAnimating
        ? [
          "rgb(255,255,255)",
          "rgba(240,255,240,0.8)",
          "rgba(220,255,220,0.8)",
          "rgba(200,255,200,0.8)",
          "rgba(180,255,180,0.8)",
          "rgba(160,255,160,0.8)",
          "rgba(140,255,140,0.8)",
          "rgba(120,255,120,0.8)",
          "rgba(100,255,100,0.8)",
          "rgba(80,255,80,0.8)",
          "rgba(60,255,60,0.8)",
          "rgba(40,255,40,0.8)",
          "rgba(20,255,20,0.8)",
          "rgba(0,255,0,0.8)",
          "rgba(0,220,0,0.9)", // Ярко-зеленый финальный цвет
        ]
        : "rgba(0,220,0,0.9)" // Ярко-зеленый для toggled состояния
      : "rgb(255,255,255)",
    dark: isToggled
      ? isAnimating
        ? [
          "rgb(255,255,255)",
          "rgba(240,255,240,0.9)",
          "rgba(220,255,220,0.9)",
          "rgba(200,255,200,0.9)",
          "rgba(180,255,180,0.9)",
          "rgba(160,255,160,0.9)",
          "rgba(140,255,140,0.9)",
          "rgba(120,255,120,0.9)",
          "rgba(100,255,100,0.9)",
          "rgba(80,255,80,0.9)",
          "rgba(60,255,60,0.9)",
          "rgba(40,255,40,0.9)",
          "rgba(20,255,20,0.9)",
          "rgba(0,255,0,0.9)",
          "rgba(0,220,0,0.9)", // Ярко-зеленый финальный цвет для dark темы
        ]
        : "rgba(0,220,0,0.9)" // Ярко-зеленый для toggled состояния в dark теме
      : "rgb(255,255,255)",
  };

  const buttonTextColor = {
    light: isToggled ? "white" : "black",
    dark: isToggled ? "white" : "white",
  };

  const currentTheme = theme === 'system' ? systemTheme : theme;

  // Calculate button width based on text length
  const getButtonWidth = () => {
    if (!fixedWidth) return undefined;
    if (width) return width;

    const baseWidth = 140;
    const extraWidth = Math.max(initialText.length, toggledText.length) * 8;
    return Math.max(baseWidth, extraWidth);
  };

  const buttonWidth = getButtonWidth();

  const buttonStyle: React.CSSProperties = {
    color: currentTheme === 'dark' ? buttonTextColor.dark : buttonTextColor.light,
    ...style,
  };

  if (buttonWidth !== undefined) {
    buttonStyle.width = typeof buttonWidth === 'number' ? `${buttonWidth}px` : buttonWidth;
  }

  return (
    <motion.div className="relative w-fit">
      {isToggled && enableParticles ? createParticles() : null}
      <motion.button
        onClick={handleClick}
        disabled={disabled}
        id={id}
        type={type}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        data-testid={dataTestId}
        layout
        // Используем framer-motion для active состояния
        whileTap={{ scale: 0.95 }}
        animate={{
          backgroundColor: currentTheme === "dark" ? buttonBackgroundColor.dark : buttonBackgroundColor.light,
        }}
        transition={{
          backgroundColor: {
            duration: isAnimating ? animationDuration / 1000 : 0.3,
            times: isAnimating
              ? [
                0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5,
                0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375, 1,
              ]
              : [0, 1],
          },
          // Быстрый переход для tap анимации
          scale: { duration: 0.1 }
        }}
        style={buttonStyle}
        className={`flex relative justify-center items-center py-2 rounded-full overflow-hidden
          font-semibold transition-opacity duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}`}
        data-toggled={isToggled}
      >
        <AnimatePresence mode="wait">
          {isToggled ? (
            <motion.div
              key="toggled"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex font-semibold items-center"
            >
              {showIcon && (
                <motion.div
                  animate={{
                    rotate: [0, -15, 15, -15, 15, -15, 15, 0],
                    transition: { duration: 0.7, delay: 0.2 },
                  }}
                  style={{ transformOrigin: "top center" }}
                  className="mr-2"
                >
                  {iconComponent || <BellIcon className="w-4 h-4" />}
                </motion.div>
              )}
              {toggledText}
            </motion.div>
          ) : (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='font-semibold'
            >
              {initialText}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};