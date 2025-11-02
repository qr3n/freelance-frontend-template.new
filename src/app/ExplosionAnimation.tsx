import React from 'react';
import { motion, MotionValue } from 'framer-motion';
import Image from 'next/image';
import { groceryCartImg, ramenImg, spa1Img, spa2Img, sushiImg } from '@/shared/assets';
import { useIntersectionObserver } from '@/shared/hooks';

export const ExplosionAnimation = ({ y }: { y: MotionValue<number> }) => {
  const { ref, isIntersecting: isAnimated } = useIntersectionObserver({
    threshold: 0.55,
    rootMargin: '0px',
    triggerOnce: true,
    intersectionRatio: 0.55
  });

  const images = [
    {
      src: sushiImg,
      alt: 'sushiImg',
      width: 300,
      finalPosition: { x: -350, y: -180 }, // Увеличено
      rotation: -15,
      mass: 0.8,
      explosionForce: 1.5, // Увеличена сила
      airResistance: 0.95,
      bounciness: 0.3
    },
    {
      src: ramenImg,
      alt: 'ramenImg',
      width: 200,
      finalPosition: { x: 280, y: -250 }, // Увеличено
      rotation: 25,
      mass: 0.6,
      explosionForce: 1.7, // Увеличена сила
      airResistance: 0.92,
      bounciness: 0.4
    },
    {
      src: groceryCartImg,
      alt: 'groceryCartImg',
      width: 350,
      finalPosition: { x: 480, y: 120 }, // Увеличено
      rotation: -8,
      mass: 1.5,
      explosionForce: 1.0, // Увеличена сила
      airResistance: 0.98,
      bounciness: 0.1
    },
    {
      src: spa1Img,
      alt: 'spa1Img',
      width: 250,
      finalPosition: { x: -300, y: 300 }, // Увеличено
      rotation: 12,
      mass: 1.0,
      explosionForce: 1.3, // Увеличена сила
      airResistance: 0.96,
      bounciness: 0.2
    },
    {
      src: spa2Img,
      alt: 'spa2Img',
      width: 200,
      finalPosition: { x: -520, y: 80 }, // Увеличено
      rotation: -20,
      mass: 0.7,
      explosionForce: 1.4, // Увеличена сила
      airResistance: 0.94,
      bounciness: 0.35
    }
  ];

  return (
    <motion.div
      ref={ref}
      className="w-full min-h-screen relative overflow-hidden"
      style={{ y }}
    >
      {/* Контейнер для анимации */}
      <div className="w-full h-screen flex items-center justify-center relative">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute z-10 p-8 bg-forest-100/60 rounded-full"
            initial={{
              x: 0,
              y: 0,
              scale: 0.1,
              rotate: 0,
              opacity: 0.8
            }}
            animate={isAnimated ? {
              x: [
                0,
                image.finalPosition.x * image.explosionForce * 0.7,
                image.finalPosition.x * image.explosionForce * image.airResistance,
                image.finalPosition.x
              ],
              y: [
                0,
                image.finalPosition.y * image.explosionForce * 0.7 - 40, // Больше подбрасывание
                image.finalPosition.y * image.explosionForce * image.airResistance + 25,
                image.finalPosition.y
              ],
              scale: [0.1, 1.4 * image.explosionForce, 1.1, 1],
              rotate: [
                0,
                image.rotation * 0.3,
                image.rotation * 1.2,
                image.rotation
              ],
              opacity: [0.8, 1, 1, 1]
            } : {
              x: 0,
              y: 0,
              scale: 0.1,
              rotate: 0,
              opacity: 0.8
            }}
            transition={{
              type: "spring",
              stiffness: 80 / image.mass,
              damping: 15 * image.mass,
              mass: image.mass,
              duration: 2.5 + (image.mass * 0.5),
              ease: [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.2, 0.6, 1]
            }}
            style={{
              transform: 'translateZ(0)',
              willChange: 'transform'
            }}
          >
            {/*<Image src={image.src} alt={image.alt} width={image.width}/>*/}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};