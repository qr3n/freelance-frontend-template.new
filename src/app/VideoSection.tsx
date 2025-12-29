"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from 'next/dynamic';
import { useIntersectionObserver } from "@/shared/hooks";
import ParallaxStar from './ParallaxStar';
import { SvgSkeleton } from '@/shared/ui/svg-skeleton/SvgSkeleton';

const ImageToVideo = dynamic(
  () => import('@/shared/ui/image-to-video/ui/ImageToVideo'),
  { ssr: false }
);

const yourSvg2 = `
<svg width="440" height="473" viewBox="0 0 440 473" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M343.5 67.5001C368.1 107.3 373.986 151 387.186 204.5C400.386 258 446.5 308.668 439 359.968C431.5 411.268 387.4 460.068 336.4 470.268C285.4 480.368 227.3 451.868 170.8 427.668C114.3 403.368 59.4001 383.468 29.1001 343.268C-1.19993 303.068 -6.69994 242.668 8.00006 190.568C22.8001 138.468 57.9001 94.6682 100.1 57.8682C142.2 21.1682 177.4 2.00004 228 0.500039C278.6 -1.09996 318.9 27.7001 343.5 67.5001Z" fill="#BB004B"/>
</svg>
`;

export default function VideoSection() {
  const emeraldSectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: emeraldScrollProgress } = useScroll({
    target: emeraldSectionRef,
    offset: ["start 0.8", "end start"]
  });

  const { scrollYProgress: mainScrollProgress } = useScroll({
    offset: ["start start", "end start"],
  });

  const { ref: intersectionRef, isIntersecting: isAnimated } = useIntersectionObserver(
    {
      threshold: 0.4,
      rootMargin: "0px",
      triggerOnce: true,
      intersectionRatio: 0.4,
    },
  );

  // Связываем intersectionRef с videoContainerRef
  const setRefs = (node: HTMLDivElement | null) => {
    // Для intersection observer
    intersectionRef.current = node;
    // Для нашего собственного ref
    videoContainerRef.current = node;
  };

  const star3Y = useTransform(emeraldScrollProgress, [0, 1], [0, -200]);
  const star4Y = useTransform(emeraldScrollProgress, [0, 1], [0, -300]);
  const star5Y = useTransform(emeraldScrollProgress, [0, 1], [0, -200]);
  const videoY = useTransform(mainScrollProgress, [0.4, 1], [0, 200]);

  return (
    <div ref={emeraldSectionRef} className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-forest-400" />

      <ParallaxStar
        y={star3Y}
        starColor={"#4a6d5d"}
        shimmerColor={"#e5fbf1"}
        className="absolute bottom-24 left-24"
        delay={0}
        shimmerSize={70}
        shimmerResponsiveSizes={{
          sm: 70,
          md: 100,
          lg: 150,
          xl: 150,
          '2xl': 150
        }}
      />

      <ParallaxStar
        y={star4Y}
        starColor={"#4a6d5d"}
        shimmerColor={"#e5fbf1"}
        className="absolute hidden sm:block bottom-64 left-48"
        delay={2}
        shimmerSize={30}
        shimmerResponsiveSizes={{
          sm: 30,
          md: 50,
          lg: 70,
          xl: 80,
          '2xl': 100
        }}
      />

      <ParallaxStar
        y={star5Y}
        starColor={"#4a6d5d"}
        shimmerColor={"#e5fbf1"}
        className="absolute top-48 right-16"
        delay={1}
        shimmerSize={100}
        shimmerResponsiveSizes={{
          sm: 100,
          md: 120,
          lg: 130,
          xl: 150,
          '2xl': 200
        }}
      />

      <div className="flex flex-col items-center justify-center w-full h-full">
        <div
          ref={setRefs}
          className="flex flex-col w-full max-w-screen-2xl gap-8 items-center justify-center"
          style={{ height: "600px" }}
        >
          {isAnimated && (
            <motion.div
              className={"relative"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                y: videoY,
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            >
              <ImageToVideo
                loadingElement={
                  <SvgSkeleton
                    svg={yourSvg2}
                    isLoading={true}
                    variant={'dark'}
                    color="#7fa590"
                    size={250}
                    responsive={{
                      default: { width: 250, height: 250 },
                      sm: { width: 350, height: 350 },
                      md: { width: 450, height: 450 },
                      lg: { width: 550, height: 550 },
                      xl: { width: 600, height: 600 }
                    }}
                  />
                }
                step={1}
                imageSrc="/robot.png"
                videos={[{ src: "/robot4.mp4" }]}
                maskSrc={"/mask2.svg"}
                responsive={{
                  default: { width: 250, height: 250 },
                  sm: { width: 350, height: 350 },
                  md: { width: 450, height: 450 },
                  lg: { width: 550, height: 550 },
                  xl: { width: 600, height: 600 }
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}