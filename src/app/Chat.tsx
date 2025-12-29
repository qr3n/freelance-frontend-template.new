"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Message {
  id: number;
  text: string;
  isMine: boolean;
}

const MESSAGES: Message[] = [
  { id: 1, text: 'Привет! Как дела?', isMine: false },
  { id: 2, text: 'Привет! Отлично, спасибо 😊', isMine: true },
  { id: 3, text: 'Что планируешь на выходные?', isMine: false },
  { id: 4, text: 'Думаю съездить за город', isMine: true },
  { id: 5, text: 'Звучит здорово!', isMine: false },
];

export default function Chat() {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MESSAGES.forEach((message, index) => {
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, message]);
      }, index * 800);
    });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [visibleMessages]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div
          ref={containerRef}
          className="h-[600px] overflow-y-auto space-y-3 flex flex-col scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {visibleMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className={`flex font-medium ${message.isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                  message.isMine
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-base leading-relaxed">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Сообщение..."
            className="flex-1 rounded-2xl bg-gray-100 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400"
            disabled
          />
          <button
            className="rounded-2xl bg-gray-100 px-4 py-2.5 text-gray-400"
            disabled
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}