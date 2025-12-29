// features/authentication/login/ui/RobotHead.tsx
'use client';

import { FC, useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

interface RobotHeadProps {
  step: 'send-code' | 'verify-code';
}

export const RobotHead: FC<RobotHeadProps> = ({ step }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const leftPupilX = useSpring(0, { damping: 20, stiffness: 200 });
  const leftPupilY = useSpring(0, { damping: 20, stiffness: 200 });
  const rightPupilX = useSpring(0, { damping: 20, stiffness: 200 });
  const rightPupilY = useSpring(0, { damping: 20, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2) / 10, 10);

      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      leftPupilX.set(pupilX);
      leftPupilY.set(pupilY);
      rightPupilX.set(pupilX);
      rightPupilY.set(pupilY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [leftPupilX, leftPupilY, rightPupilX, rightPupilY]);

  return (
    <div
      ref={containerRef}
      className="w-[240px] p-6 h-[240px] flex items-center justify-center bg-emerald-900 rounded-[48px] relative overflow-hidden"
    >
      <div className='w-full h-full bg-zinc-200 rounded-[40px]'>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: step === 'verify-code' ? 1.05 : 1,
          }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 200,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Eyes */}
            <motion.div
              className="absolute flex gap-10"
              style={{ top: '40%', left: '50%', x: '-50%', y: '-50%' }}
              animate={{
                y: step === 'verify-code' ? -5 : 0,
              }}
              transition={{
                type: 'spring',
                damping: 15,
                stiffness: 200,
              }}
            >
              {/* Left Eye */}
              <div className="relative w-[36px] h-[44px] bg-white rounded-full shadow-inner">
                <motion.div
                  className="absolute w-[16px] h-[16px] top-[50%] left-[50%]"
                  style={{
                    x: '-50%',
                    y: '-50%',
                  }}
                >
                  <motion.div
                    className="w-full h-full bg-zinc-800 rounded-full relative"
                    style={{
                      x: leftPupilX,
                      y: leftPupilY,
                    }}
                  >
                    <motion.div
                      className="absolute w-[5px] h-[5px] bg-white rounded-full top-[4px] left-[4px]"
                      animate={{
                        opacity: [1, 0.7, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Right Eye */}
              <div className="relative w-[36px] h-[44px] bg-white rounded-full shadow-inner">
                <motion.div
                  className="absolute w-[16px] h-[16px] top-[50%] left-[50%]"
                  style={{
                    x: '-50%',
                    y: '-50%',
                  }}
                >
                  <motion.div
                    className="w-full h-full bg-zinc-800 rounded-full relative"
                    style={{
                      x: rightPupilX,
                      y: rightPupilY,
                    }}
                  >
                    <motion.div
                      className="absolute w-[5px] h-[5px] bg-white rounded-full top-[4px] left-[4px]"
                      animate={{
                        opacity: [1, 0.7, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Nose */}
            <motion.svg
              width="180"
              height="180"
              viewBox="0 0 180 180"
              className="absolute top-0 left-0"
              animate={{
                y: step === 'verify-code' ? 2 : 0,
              }}
              transition={{
                type: 'spring',
                damping: 15,
                stiffness: 200,
              }}
            >
              <motion.path
                d="M 85 115 L 90 120 L 85 125"
                stroke="#52525b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                animate={{
                  d: step === 'verify-code'
                    ? "M 83 115 L 90 120 L 83 125"
                    : "M 85 115 L 90 120 L 85 125",
                }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 200,
                }}
              />
            </motion.svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
};