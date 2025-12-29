"use client";

import { useMemo } from "react";
import { motion, MotionValue } from "framer-motion";
import { ShimmerStar } from "./ShimmerStar";

interface ParallaxStarProps {
  y: MotionValue<number>;
  className: string;
  size?: string;
  delay?: number;
  shimmerColor?: string;
  starColor?: string;
  shimmerSize?: number;
  shimmerResponsiveSizes?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
}

export default function ParallaxStar({
                                       y,
                                       className,
                                       size = "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32",
                                       delay = 0,
                                       starColor,
                                       shimmerColor,
                                       shimmerSize = 50,
                                       shimmerResponsiveSizes,
                                     }: ParallaxStarProps) {
  const spinTransition = useMemo(
    () => ({
      duration: 0.8,
      ease: "easeOut" as const,
      repeat: Infinity,
      repeatDelay: 4 + delay,
      times: [0, 0.3, 0.6, 1],
    }),
    [delay],
  );

  return (
    <div className={className}>
      <motion.div
        style={{
          y,
          transform: "translateZ(0)",
          willChange: "transform",
        }}
        className={size}
        animate={{
          rotate: [0, 180],
        }}
        transition={spinTransition}
      >
        <ShimmerStar
          className="w-full h-full"
          shimmerColor={shimmerColor}
          starColor={starColor}
          size={shimmerSize}
          responsiveSizes={shimmerResponsiveSizes}
        />
      </motion.div>
    </div>
  );
}