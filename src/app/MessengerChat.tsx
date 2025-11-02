import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/shadcn/lib/utils';
import { useIntersectionObserver } from '@/shared/hooks';

// Типы для кнопок
interface ButtonData {
  text: string;
  emoji?: string;
}

interface InlineButtonProps {
  text: string;
  emoji?: string;
  delay?: number;
}

interface InlineKeyboardProps {
  buttons: ButtonData[][];
  delay?: number;
}

// Типы для сообщений
interface ChatMessageProps {
  message: string;
  isBot: boolean;
  delay: number;
  buttons?: ButtonData[][];
}

interface MessageData {
  text: string;
  isBot: boolean;
  buttons?: ButtonData[][];
}

// GPU-стили для оптимизации
const gpuOptimizedStyle: React.CSSProperties = {
  willChange: 'transform, opacity',
  transform: 'translateZ(0)', // Force GPU layer
  backfaceVisibility: 'hidden'
};

const gpuTransformStyle: React.CSSProperties = {
  willChange: 'transform',
  transform: 'translateZ(0)', // Force GPU layer
  backfaceVisibility: 'hidden'
};

const InlineButton = memo<InlineButtonProps>(({ text, emoji, delay = 0 }) => {
  return (
    <motion.button
      className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 !text-emerald-100 text-sm font-medium transition-all duration-200 border border-emerald-500/30 hover:border-emerald-400/50 backdrop-blur-sm"
      style={gpuOptimizedStyle}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="flex items-center space-x-1">
        {emoji && <span className='text-white'>{emoji}</span>}
        <span className={'text-white'}>{text}</span>
      </span>
    </motion.button>
  );
});

// Компонент для набора кнопок
const InlineKeyboard = memo<InlineKeyboardProps>(({ buttons, delay = 0 }) => {
  return (
    <motion.div
      className="mt-3 space-y-2"
      style={gpuOptimizedStyle}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      {buttons.map((row: ButtonData[], rowIndex: number) => (
        <div key={rowIndex} className="flex flex-wrap gap-2">
          {row.map((button: ButtonData, btnIndex: number) => (
            <InlineButton
              key={btnIndex}
              text={button.text}
              emoji={button.emoji}
              delay={delay + 0.1 + (rowIndex * row.length + btnIndex) * 0.05}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
});

// Компонент сообщения чата
const ChatMessage = memo<ChatMessageProps>(({ message, isBot, delay, buttons }) => {
  return (
    <motion.div
      className={cn(
        "flex w-full mb-4",
        isBot ? "justify-start" : "justify-end"
      )}
      style={gpuOptimizedStyle}
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.8,
        rotateX: -15
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0
      }}
      transition={{
        delay,
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {/* Аватар для бота */}
      {isBot && (
        <motion.div
          className="flex-shrink-0 w-8 h-8 mr-3 mt-1"
          style={gpuTransformStyle}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.1, duration: 0.25 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm">🤖</span>
          </div>
        </motion.div>
      )}

      <div className="max-w-[75%]">
        <div
          className={cn(
            "px-5 py-3.5 font-medium leading-relaxed relative overflow-hidden",
            isBot
              ? "bg-white/95 text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-emerald-100/50"
              : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl rounded-br-md shadow-lg"
          )}
          style={{
            ...gpuTransformStyle,
            backdropFilter: isBot ? 'blur(10px)' : 'none'
          }}
        >
          {!isBot && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{
                ...gpuTransformStyle,
                width: '50%',
                height: '100%',
                transform: 'skewX(-15deg) translateZ(0)'
              }}
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '200%', opacity: [0, 1, 0] }}
              transition={{
                delay: delay + 0.4,
                duration: 0.8,
                ease: "easeInOut"
              }}
            />
          )}

          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.span>
        </div>

        {/* Inline кнопки */}
        {buttons && (
          <InlineKeyboard buttons={buttons} delay={delay + 0.3} />
        )}
      </div>
    </motion.div>
  );
});

// Главный компонент мессенджера
export const MessengerChat = memo(() => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.4,
    rootMargin: '0px',
    triggerOnce: true,
    intersectionRatio: 0.4
  });

  const messages: MessageData[] = [
    {
      text: "Добро пожаловать в ресторан 'La Bella Vista'! 🍽️ Я помогу вам выбрать блюда из нашего меню",
      isBot: true,
      buttons: [
        [{ text: "Начать выбор", emoji: "🎯" }]
      ]
    },
    {
      text: "Отлично! Покажите меню",
      isBot: false
    },
    {
      text: "Какую кухню предпочитаете?",
      isBot: true,
      buttons: [
        [
          { text: "Итальянская", emoji: "🇮🇹" },
          { text: "Французская", emoji: "🇫🇷" }
        ],
      ]
    },
    {
      text: "Итальянская",
      isBot: false
    },
    {
      text: "Превосходный выбор! 🍝 Что бы вы хотели заказать?",
      isBot: true,
      buttons: [
        [
          { text: "Паста", emoji: "🍝" },
          { text: "Пицца", emoji: "🍕" }
        ],
        [
          { text: "Ризотто", emoji: "🥘" },
          { text: "Салаты", emoji: "🥗" }
        ],
        [
          { text: "Посмотреть всё меню", emoji: "📋" }
        ]
      ]
    },
    {
      text: "Пицца",
      isBot: false
    },
    {
      text: "Отличный выбор! 🍕 Вот наши лучшие пиццы:",
      isBot: true,
      buttons: [
        [
          { text: "Маргарита - 850₽", emoji: "🧀" },
          { text: "Пепперони - 950₽", emoji: "🥓" }
        ],
        [
          { text: "Четыре сыра - 1050₽", emoji: "🧄" },
          { text: "Дьябола - 1150₽", emoji: "🌶️" }
        ],
        [
          { text: "Показать напитки", emoji: "🥤" },
          { text: "Назад к категориям", emoji: "⬅️" }
        ]
      ]
    }
  ];

  return (
    <div
      ref={ref}
      className="w-full h-full bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 flex flex-col relative overflow-hidden"
      style={gpuOptimizedStyle}
    >
      {/* Анимированный фоновый паттерн - GPU оптимизация */}
      <div
        className="absolute inset-0 opacity-10"
        style={gpuOptimizedStyle}
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(251,146,60,0.4)_0%,_transparent_50%)]"
          style={gpuTransformStyle}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(251,146,60,0.3)_0%,_transparent_50%)]"
          style={gpuTransformStyle}
        />
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(251,146,60,0.1)_25%,_transparent_25%,_transparent_75%,_rgba(251,146,60,0.1)_75%)]"
          style={{
            ...gpuOptimizedStyle,
            backgroundSize: '50px 50px'
          }}
          animate={{ x: [0, 50] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Заголовок */}
      <motion.div
        className="p-6 pt-12 text-center relative"
        style={gpuOptimizedStyle}
        initial={{ y: -50, opacity: 0 }}
        animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-bold text-white mb-1">🤖 MenuBot</h3>
        <p className="text-emerald-200 text-sm">Помощник по выбору блюд</p>
      </motion.div>

      {/* Контейнер для сообщений */}
      <div
        className="flex-1 p-5 overflow-hidden relative"
        style={gpuOptimizedStyle}
      >
        <div
          className="absolute inset-0 shadow-inner pointer-events-none"
          style={gpuTransformStyle}
        />

        <div
          className="relative z-10 space-y-1"
          style={gpuOptimizedStyle}
        >
          {isIntersecting && messages.map((msg: MessageData, index: number) => (
            <ChatMessage
              key={index}
              message={msg.text}
              isBot={msg.isBot}
              delay={0.2 + index * 0.4}
              buttons={msg.buttons}
            />
          ))}
        </div>
      </div>

      {/* Поле ввода (декоративное) */}
      <motion.div
        className="p-4 border-t border-emerald-800/30 bg-emerald-900/50 backdrop-blur-sm"
        style={gpuOptimizedStyle}
        initial={{ y: 50, opacity: 0 }}
        animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="flex-1 bg-white/10 rounded-full px-4 py-2 text-emerald-200 text-sm backdrop-blur-sm border border-emerald-600/30"
            style={gpuTransformStyle}
          >
            Напишите сообщение...
          </div>
          <button
            className="w-10 h-10 bg-emerald-500 hover:bg-emerald-400 rounded-full flex items-center justify-center text-white transition-colors duration-200"
            style={gpuTransformStyle}
          >
            <span>📤</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
});

// Добавляем displayName с типизацией
InlineButton.displayName = 'InlineButton';
InlineKeyboard.displayName = 'InlineKeyboard';
ChatMessage.displayName = 'ChatMessage';
MessengerChat.displayName = 'MessengerChat';