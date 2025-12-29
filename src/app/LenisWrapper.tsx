"use client";

import ReactLenis from "lenis/react";
import { motion } from "framer-motion";
import { useAtom } from 'jotai';
import { isExitingAtom } from '@/app/ClientProvider';
import { ClientProvider } from '@/app/ClientProvider';
  
export default function LenisWrapper({ children }: { children: React.ReactNode }) {
  const [isExiting] = useAtom(isExitingAtom);

  return (
    <ClientProvider>
      <motion.div
        initial={false}
        animate={{
          clipPath: isExiting
            ? "circle(150% at 50% 50%)"
            : "circle(0% at 50% 50%)",
        }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        className="fixed inset-0 bg-white z-[1000] max-w-[100vw] overflow-hidden"
      />

      <ReactLenis
        root
        options={{
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        }}
      >
        {children}
      </ReactLenis>
    </ClientProvider>
  );
}