'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ChatAnimation = () => {
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);

  useEffect(() => {
    // Показываем первое сообщение через 1 секунду
    const timer1 = setTimeout(() => {
      setShowFirstMessage(true);
    }, 1000);

    // Показываем второе сообщение через 3 секунды
    const timer2 = setTimeout(() => {
      setShowSecondMessage(true);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const messageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.7,
      y: 30,
      rotate: -30
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        bounce: 0.3,
        duration: 0.6
      }
    }
  };

  return (
    <div className=" bg-gradient-to-br flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Первое сообщение (от собеседника) */}
        {showFirstMessage && (
          <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-start"
          >
            <div className="max-w-[80%]">
              <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-md">
                <p className="text-sm font-medium">Привет! Расскажи о себе</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Второе сообщение (от нас/ИИ) */}
        {showSecondMessage && (
          <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-end"
          >
            <div className="max-w-[80%]">
              <div className="bg-gradient-to-r bg-black text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md">
                <p className="text-sm text-white font-medium">Привет! Я твой личный ИИ-помощник</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatAnimation;