"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { atom, useAtom } from 'jotai';

// Атомы Jotai для глобального состояния
export const isExitingAtom = atom(false);
export const isMobileAtom = atom(false);

interface ClientContextType {
  isExiting: boolean;
  setIsExiting: (value: boolean) => void;
  handleContinue: () => void;
  isMobile: boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [isExiting, setIsExiting] = useAtom(isExitingAtom);
  const [isMobile, setIsMobile] = useAtom(isMobileAtom);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  const handleContinue = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push("/dashboard/create");
    }, 400);
  };

  return (
    <ClientContext.Provider value={{ isExiting, setIsExiting, handleContinue, isMobile }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within ClientProvider');
  }
  return context;
}