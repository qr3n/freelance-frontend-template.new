"use client";

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { TextBackgroundSvg } from "@/shared/ui/svg/ui/TextBackgroundSvg";
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';
import { useClient } from '@/app/ClientProvider';
import { SplitText } from '@/app/splitText';
import ParallaxStar from './ParallaxStar';
import LargeButton from './LargeButton';
import { SvgSkeleton } from '@/shared/ui/svg-skeleton/SvgSkeleton';

const ImageToVideo = dynamic(
  () => import('@/shared/ui/image-to-video/ui/ImageToVideo'),
  { ssr: false }
);

const yourSvg = `...`; // SVG код

export default function FirstSection() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const { handleContinue } = useClient();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const star1Y = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const star2Y = useTransform(scrollYProgress, [0, 1], [0, -500]);

  useEffect(() => {
    const split = new SplitText(textRef.current, {
      type: "chars,words,lines"
    });

    gsap.from(split.chars, {
      opacity: 0,
      y: 50,
      stagger: 0.05,
      duration: 0.8,
      ease: "back.out"
    });

    return () => {
      split.revert();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <div className='flex w-full flex-col h-full items-center justify-center absolute top-0 left-0'>
        <div className={'absolute w-full h-full bg-gradient-to-t from-[#010804] to-transparent top-0 left-0'}/>
      </div>

      <div className="overflow-hidden w-full flex items-center justify-center">
        <div className="w-full max-w-[1750px] px-8 py-24 flex-col md:flex-row flex relative justify-between">
          <div>
            <motion.div className="absolute z-50">
              <h1 className="text-white sm:ml-2 md:ml-4 lg:ml-8 xl:ml-12 2xl:ml-12 text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold">
                <span ref={textRef}>
                  Ваш AI-агент
                </span> <br />
                <span className="relative">
                  <TextBackgroundSvg className='mt-[5px] ml-1 scale-[115%] xl:scale-[120%] xl:mt-3 xl:ml-4'/>
                  <span className="z-10 relative text-emerald-950">
                    уже готов.
                  </span>
                </span>
              </h1>

              <LargeButton
                onClick={handleContinue}
                className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 rotate-[-5deg] bg-white text-emerald-950 hover:bg-emerald-100 transition-colors duration-200"
              >
                Выбрать агента
              </LargeButton>
            </motion.div>

            <ParallaxStar
              y={star1Y}
              className="absolute top-8 right-8 sm:top-16 sm:right-0"
              starColor={"#14532d"}
              shimmerColor={"#4ade80"}
              delay={0}
              shimmerSize={50}
              shimmerResponsiveSizes={{
                sm: 70,
                md: 100,
                lg: 150,
                xl: 150,
                '2xl': 150
              }}
            />

            <ParallaxStar
              y={star2Y}
              className="absolute bottom-0 right-8 sm:bottom-16 sm:left-2"
              starColor={"#14532d"}
              shimmerColor={"#4ade80"}
              delay={2}
              shimmerSize={80}
              shimmerResponsiveSizes={{
                sm: 70,
                md: 100,
                lg: 150,
                xl: 150,
                '2xl': 200
              }}
            />
          </div>

          <ImageToVideo
            loadingElement={
              <SvgSkeleton
                svg={yourSvg}
                isLoading={true}
                variant={'dark'}
                color="#052e16"
                size={500}
                responsive={{
                  default: { width: 350, height: 350 },
                  sm: { width: 550, height: 550 },
                  md: { width: 400, height: 400 },
                  lg: { width: 500, height: 500 },
                  xl: { width: 600, height: 600 },
                  '2xl': { width: 750, height: 750 },
                }}
              />
            }
            loop
            className={'mt-52 sm:mt-64 md:mt-0 z-[5000]'}
            step={1}
            imageSrc="/robot.png"
            videos={[{ src: '/robot3.mp4' }]}
            maskSrc={"/mask.svg"}
            responsive={{
              default: { width: 350, height: 350 },
              sm: { width: 550, height: 550 },
              md: { width: 400, height: 400 },
              lg: { width: 500, height: 500 },
              xl: { width: 600, height: 600 },
              '2xl': { width: 750, height: 750 },
            }}
          />
        </div>
      </div>
    </div>
  );
}