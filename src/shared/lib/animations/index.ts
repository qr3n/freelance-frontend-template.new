/**
 * Переиспользуемые анимации для приложения
 */

export const enterExitAnimation = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 },
  enterTransition: {
    type: "spring" as const,
    damping: 15,
    stiffness: 300,
    mass: 1
  },
  exitTransition: {
    duration: 0.4,
    ease: "easeInOut" as const
  }
};

export const starEnterExitAnimation = {
  initial: { y: 150, opacity: 0, scale: 0.5 },
  animate: { y: 0, opacity: 1, scale: 1 },
  exit: { y: -150, opacity: 0, scale: 0.5 },
  enterTransition: {
    type: "spring" as const,
    damping: 12,
    stiffness: 200,
    mass: 1.2
  },
  exitTransition: {
    duration: 0.5,
    ease: "easeInOut" as const
  }
};

export const spinTransition1 = {
  duration: 0.8,
  ease: "easeOut" as const,
  repeat: Infinity,
  repeatDelay: 1,
  times: [0, 0.3, 0.6, 1],
};

export const spinTransition2 = {
  duration: 0.8,
  ease: "easeOut" as const,
  repeat: Infinity,
  repeatDelay: 2.5,
  times: [0, 0.3, 0.6, 1],
};