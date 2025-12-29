"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollAnimatedLine from '@/line';
import Chat from './Chat';
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";

export default function ChatSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const iphoneY = useTransform(scrollYProgress, [0, 1], [0, -700]);
  const iphoneRotateX = useTransform(scrollYProgress, [0, 0.2, 0.3], [60, 15, 0]);

  return (
    <>
      <ScrollAnimatedLine
        strokeColor="#4ade80"
        strokeWidth={15}
        zIndex={5}
        startOffset={10}
      />
      <div className='w-full h-full absolute top-0 left-0 dotted-background'/>

      <div className="flex w-full items-center justify-center pt-32">
        <div
          className="scale-75 sm:scale-100 absolute -bottom-[20%] sm:-bottom-[10%] z-50"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "center center",
          }}
        >
          <motion.div
            style={{
              y: iphoneY,
              rotateX: iphoneRotateX,
              transformOrigin: "center bottom",
              transformStyle: "preserve-3d",
              transform: "translateZ(0)",
              willChange: "transform",
            }}
          >
            <DeviceFrameset
              device="iPhone X"
              color="black"
              style={{
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            >
              <Chat />
            </DeviceFrameset>
          </motion.div>
        </div>
      </div>
    </>
  );
}