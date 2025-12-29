"use client";

import ReactLenis from "lenis/react";
import {
  PropsWithChildren,
  useRef,
  memo,
  useMemo,
  useState,
  useEffect,
} from "react";
import { cn } from "@/shared/shadcn/lib/utils";
import { TailwindBgColor, TailwindHeight } from '@/shared/types';
import { ButtonProps } from "@/shared/shadcn/ui/button";
import { motion, MotionValue, useInView, useScroll, useTransform } from 'framer-motion';
import "react-device-frameset/styles/marvel-devices.min.css";
import { TextBackgroundSvg } from "@/shared/ui/svg/ui/TextBackgroundSvg";
import { useIntersectionObserver } from "@/shared/hooks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/shadcn/ui/carousel";
import { ArrowSvg } from "@/shared/ui/svg/ui/ArrowSvg";
import { ShimmerStar } from "./ShimmerStar";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

import dynamic from 'next/dynamic';
import { RiRobot2Line, RiRocketLine, RiSettings4Line } from 'react-icons/ri';
import { SvgSkeleton } from '@/shared/ui/svg-skeleton/SvgSkeleton';
import ScrollAnimatedLine from '@/line';
import { useTextRevealAnimation } from '@/app/useTextRevealAnimation';
import { InteractiveHoverButton } from '@/shared/shadcn/abstract-glassy-shader';



const ImageToVideo = dynamic(
  () => import('@/shared/ui/image-to-video/ui/ImageToVideo'),
  { ssr: false }
);

interface ISectionProps extends PropsWithChildren {
  bgColor?: TailwindBgColor;
  height?: TailwindHeight;
}

const Section = memo((props: ISectionProps) => (
  <section className={cn("w-full h-[100dvh] relative", props.bgColor, props.height)}>
    {props.children}
  </section>
));

interface ICardProps extends PropsWithChildren {
  bgColor: TailwindBgColor;
}

const Card = memo((props: ICardProps) => {
  return (
    <div className={cn("px-20 py-8 rounded-[36px] h-[600px]", props.bgColor)}>
      <h1 className="font-bold text-white text-3xl">Ресторан</h1>
    </div>
  );
});

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

function Chat() {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const containerRef = useRef(null);

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
  )
}

const LargeButton = memo((props: ButtonProps) => {
  return (
    <InteractiveHoverButton
      duration={350}
      textColor={'black'}
      textHoverColor={'#ffffff'}
      dotSize={'w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-4 2xl:h-4 rounded-full'}
      dotColor="#000000"
      dotInitialPosition={{ left: "13%" }}
      textTranslate="translate-x-1 sm:translate-x-2 md:translate-x-3 lg:translate-x-4 xl:translate-x-6 group-hover:translate-x-[150px] sm:group-hover:translate-x-[180px] md:group-hover:translate-x-[200px]"
      hoverTranslate="translate-x-[150px] sm:translate-x-[380px] md:translate-x-[200px] group-hover:-translate-x-5 sm:group-hover:-translate-x-4.5 md:group-hover:-translate-x-4 lg:group-hover:-translate-x-3.5 xl:group-hover:-translate-x-3"
      arrowSize="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 2xl:h-9 2xl:w-9"
      {...props}
      className={cn(
        "w-[180px] sm:w-[200px] md:w-[250px] lg:w-[300px] xl:w-[360px] 2xl:w-[420px]",
        "text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl",
        "py-2 sm:py-2.5 md:py-3.5 lg:py-4.5 xl:py-5",
        "px-6",
        "text-black",
        props.className
      )}
      text={'Начать сейчас'}
    />
  );
});

const ParallaxStar = memo(
  ({
     y,
     className,
     size,
     delay = 0,
     shimmerColor,
     starColor,
     shimmerSize = 50,
     shimmerResponsiveSizes,
   }: {
    y: MotionValue<number>;
    className: string;
    size: string;
    delay?: number;
    starColor?: string;
    shimmerColor?: string;
    shimmerSize?: number;
    shimmerResponsiveSizes?: {
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      '2xl'?: number;
    };
  }) => {
    const spinTransition = useMemo(
      () => ({
        duration: 0.8,
        ease: "easeOut" as const,
        repeat: Infinity,
        repeatDelay: 4 + delay,
        times: [0, 0.3, 0.6, 1],
      }),
      [delay],
    );

    return (
      <div className={className}>
        <motion.div
          style={{
            y,
            transform: "translateZ(0)",
            willChange: "transform",
          }}
          className={size}
          animate={{
            rotate: [0, 180],
          }}
          transition={spinTransition}
        >
          <ShimmerStar
            className="w-full h-full"
            shimmerColor={shimmerColor}
            starColor={starColor}
            size={shimmerSize}
            responsiveSizes={shimmerResponsiveSizes}
          />
        </motion.div>
      </div>
    );
  },
);


export default function Home() {
  const containerRef = useRef(null);
  const [currentStep] = useState(0);
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const section1ref = useRef(null)
  const section1InView = useInView(section1ref)


  const [currentSection, setCurrentSection] = useState('section1');
  const sectionsRef = useRef([]);
  const sectionStyles = {
    section1: {
      register: {
        className: 'bg-white text-emerald-950',
        textColor: '#052e16',
        dotColor: '#052e16'
      },
      login: {
        className: 'bg-emerald-600 text-white',
        textColor: 'white',
        dotColor: 'white'
      }
    },
    section2: {
      register: {
        className: 'bg-emerald-950 text-white',
        textColor: 'white',
        dotColor: 'white'
      },
      login: {
        className: 'bg-white text-emerald-950',
        textColor: '#052e16',
        dotColor: '#052e16'
      }
    },
    section3: {
      register: {
        className: 'bg-white text-emerald-950',
        textColor: '#052e16',
        dotColor: '#052e16'
      },
      login: {
        className: 'bg-emerald-950 text-white',
        textColor: 'white',
        dotColor: 'white'
      }
    },
    section4: {
      register: {
        className: 'bg-emerald-200 text-emerald-950',
        textColor: '#052e16',
        dotColor: '#052e16'
      },
      login: {
        className: 'bg-emerald-950 text-white',
        textColor: 'white',
        dotColor: 'white'
      }
    },
    section5: {
      register: {
        className: 'bg-white text-emerald-950',
        textColor: '#052e16',
        dotColor: '#052e16'
      },
      login: {
        className: 'bg-emerald-600 text-white',
        textColor: 'white',
        dotColor: 'white'
      }
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Триггер когда секция в центре экрана
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Наблюдаем за всеми секциями
    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const currentStyles = sectionStyles[currentSection] || sectionStyles.section1;

  const yourSvg = `
    <svg width="1057" height="1110" viewBox="0 0 1057 1110" xmlns="http://www.w3.org/2000/svg">
      <path d="M728.084 111.493C617.793 61.2244 477.767 85.6827 349.591 127.284C221.66 169.027 105.333 227.771 76.9286 315.202C48.5242 402.634 108.042 518.753 136.617 649.383C165.192 780.013 163.211 925.051 234.843 998.947C306.423 1072.65 451.564 1075.02 545.624 1015.19C639.439 955.221 774.562 876.34 774.562 725.292C774.562 603.292 907.654 511.617 913.195 399.213C918.737 286.808 838.375 161.761 728.084 111.493Z" fill="#BB004B"/>
      <path d="M728.084 111.493C617.793 61.2244 477.767 85.6827 349.591 127.284C221.66 169.027 105.333 227.771 76.9286 315.202C48.5242 402.634 108.042 518.753 136.617 649.383C165.192 780.013 163.211 925.051 234.843 998.947C306.423 1072.65 451.564 1075.02 545.624 1015.19C639.439 955.221 774.562 876.34 774.562 725.292C774.562 603.292 907.654 511.617 913.195 399.213C918.737 286.808 838.375 161.761 728.084 111.493Z" fill="black" fill-opacity="0.2"/>
    </svg>
  `

  const yourSvg2 = `
  <svg width="440" height="473" viewBox="0 0 440 473" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M343.5 67.5001C368.1 107.3 373.986 151 387.186 204.5C400.386 258 446.5 308.668 439 359.968C431.5 411.268 387.4 460.068 336.4 470.268C285.4 480.368 227.3 451.868 170.8 427.668C114.3 403.368 59.4001 383.468 29.1001 343.268C-1.19993 303.068 -6.69994 242.668 8.00006 190.568C22.8001 138.468 57.9001 94.6682 100.1 57.8682C142.2 21.1682 177.4 2.00004 228 0.500039C278.6 -1.09996 318.9 27.7001 343.5 67.5001Z" fill="#BB004B"/>
</svg>
`

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    router.prefetch("/dashboard/create");
  }, [router]);

  const handleContinue = () => {
    setIsExiting(true);

    console.log('exit')

    setTimeout(() => {
      router.push("/dashboard/create");
    }, 400);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const { ref: videoRef, isIntersecting: isAnimated } = useIntersectionObserver(
    {
      threshold: 0.4,
      rootMargin: "0px",
      triggerOnce: true,
      intersectionRatio: 0.4,
    },
  );

  const STEPS = [
    {
      title: "1. Выберите агента",
      description: "Выберите готового AI-агента из нашей библиотеки или создайте своего с уникальными возможностями",
      icon: <RiRobot2Line className="h-12 w-12 fill-emerald-950/80" />,
      color: "bg-white"
    },
    {
      title: "2. Настройте под себя",
      description: "Персонализируйте агента под ваши задачи: обучите его вашим данным, настройте стиль общения",
      icon: <RiSettings4Line className="h-12 w-12 fill-emerald-950/80" />,
      color: "bg-emerald-100"
    },
    {
      title: "3. Запустите в работу",
      description: "Интегрируйте агента в ваши каналы коммуникации и начните автоматизировать процессы прямо сейчас",
      icon: <RiRocketLine className="h-12 w-12 fill-emerald-950/80" />,
      color: "bg-white"
    }
  ];

  const star1Y = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const star2Y = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const iphoneY = useTransform(scrollYProgress, [0, 1], [0, 600]);
  const iphoneScale = useTransform(scrollYProgress, [0, 1], [100, 1000]);

  const emeraldSectionRef = useRef(null);

  const { scrollYProgress: emeraldScrollProgress } = useScroll({
    target: emeraldSectionRef,
    offset: ["start 0.8", "end start"] // начинается когда секция на 80% экрана
  });

  const star3Y = useTransform(emeraldScrollProgress, [0, 1], [0, -200]);
  const star4Y = useTransform(emeraldScrollProgress, [0, 1], [0, -300]);
  const star5Y = useTransform(emeraldScrollProgress, [0, 1], [0, -200]);
  const iphoneRotateX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3],
    [60, 15, 0],
  );
  const videoY = useTransform(scrollYProgress, [0.4, 1], [0, 200]);

  // Контент для рендеринга
  const content = (

    <div ref={containerRef}>
      <div className={'fixed top-8 flex gap-4 right-8 z-[50000] '}>
        <InteractiveHoverButton
          text={'ВХОД'}
          duration={350}
          textColor={'#ffffff'}
          textHoverColor={'#ffffff'}
          dotSize={'w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 lg:w-2 lg:h-2 rounded-full'}
          dotColor="#ffffff"
          dotHoverColor={'#46cd48'}
          dotInitialPosition={{ left: "20%" }}
          textTranslate="translate-x-0.5 sm:translate-x-1 md:translate-x-1.5 lg:translate-x-2 group-hover:translate-x-[80px] sm:group-hover:translate-x-[100px] md:group-hover:translate-x-[120px]"
          hoverTranslate="translate-x-[80px] sm:translate-x-[100px] md:translate-x-[120px] group-hover:-translate-x-3 sm:group-hover:-translate-x-2.5 md:group-hover:-translate-x-2 lg:group-hover:-translate-x-1.5"
          arrowSize="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-6 lg:w-6"
          className={cn(
            "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px]",
            "text-sm sm:text-base md:text-lg lg:text-xl",
            "py-2.5 sm:py-3 md:py-3.5 lg:py-4 xl:py-4",
            "px-4",
            `transition-all ${section1InView ? 'bg-forest-800' : 'bg-forest-900'}`
          )}
        />
      </div>


      <Section bgColor={"bg-emerald-950"}>

        <div  className=' flex w-full flex-col h-full items-center justify-center absolute top-0 left-0'>
          <div className={'absolute w-full h-full bg-gradient-to-t from-[#010804] to-transparent top-0 left-0'}/>
        </div>

        <div ref={section1ref} className="overflow-hidden w-full flex items-center justify-center">
          <div className="w-full max-w-[1750px] px-8 py-24 flex-col md:flex-row flex relative justify-between">
            <div>
              <motion.div className="absolute z-50">
                <h1  className="text-white sm:ml-2 md:ml-4 lg:ml-8 xl:ml-12 2xl:ml-12 text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold">
                  Ваш AI-агент <br />
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
                />
              </motion.div>

              <ParallaxStar
                y={star1Y}
                className="absolute top-8 right-8 sm:top-32 sm:right-0"
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

            <div className=' w-[500px] h-[500px] sm:w-[550px] sm:h-[550px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] 2xl:w-[750px] 2xl:h-[750px] '>
              <svg className='mt-52 sm:mt-64 md:mt-0 w-[350px] h-[350px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] 2xl:w-[750px] 2xl:h-[750px] absolute'  viewBox="0 0 1057 1110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M728.084 111.493C617.793 61.2244 477.767 85.6827 349.591 127.284C221.66 169.027 105.333 227.771 76.9286 315.202C48.5242 402.634 108.042 518.753 136.617 649.383C165.192 780.013 163.211 925.051 234.843 998.947C306.423 1072.65 451.564 1075.02 545.624 1015.19C639.439 955.221 774.562 876.34 774.562 725.292C774.562 603.292 907.654 511.617 913.195 399.213C918.737 286.808 838.375 161.761 728.084 111.493Z" fill="#052e16"/>
                <path d="M728.084 111.493C617.793 61.2244 477.767 85.6827 349.591 127.284C221.66 169.027 105.333 227.771 76.9286 315.202C48.5242 402.634 108.042 518.753 136.617 649.383C165.192 780.013 163.211 925.051 234.843 998.947C306.423 1072.65 451.564 1075.02 545.624 1015.19C639.439 955.221 774.562 876.34 774.562 725.292C774.562 603.292 907.654 511.617 913.195 399.213C918.737 286.808 838.375 161.761 728.084 111.493Z" fill="#052e16" fillOpacity="0.2"/>
              </svg>

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
                      sm: { width: 350, height: 350 },
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
                  sm: { width: 350, height: 350 },
                  md: { width: 400, height: 400 },
                  lg: { width: 500, height: 500 },
                  xl: { width: 600, height: 600 },
                  '2xl': { width: 750, height: 750 },
                }}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section bgColor={"bg-emerald-50"} height={'h-[300dvh]'}>
        <ScrollAnimatedLine
          className='mt-24 sm:mt-[260px] md:mt-[280px] lg:mt-[340px] xl:mt-[400px] 2xl:mt-96'
          strokeColor="#7d967d"
          strokeWidth={24}
          zIndex={5}
          startOffset={30} // Линия начнет рисоваться после 50vh скролла
        />
        <div ref={el => sectionsRef.current[1] = el} className='absolute dotted-background  size-full top-0 flex flex-col  justify-center left-0'>

        </div>

        <div className='absolute bg-gradient-to-b from-emerald-50 to-transparent from-50%  size-full top-0 flex flex-col  justify-center left-0'>

        </div>

        <div className=' rounded-full pt-32 z-[5000]'>
          <div className='pl-8 sm:pl-16 md:pl-24 lg:pl-32 xl:pl-40 2xl:pl-48 w-full relative z-[5000]'>
            <div className='relative flex items-center gap-5'>
              <ShimmerStar
                starColor={'#a5c2b3'}
                shimmerColor={'#ffffff'}
                responsiveSizes={{
                  sm: 40,
                  md: 60,
                  lg: 80,
                  xl: 100,
                  '2xl': 120
                }}
              />
              <h1 className='text-[48px] sm:text-[64px] md:text-[72px] lg:text-[96px] xl:text-[128px] 2xl:text-[142px] z-[5000] text-forest-950 font-semibold'>
                Онлайн?
              </h1>
            </div>

            <h1 className='text-[48px] sm:text-[64px] md:text-[72px] lg:text-[96px] xl:text-[128px] 2xl:text-[142px] z-[5000] -mt-[32px] sm:-mt-[40px] md:-mt-[48px] xl:-mt-[72px] 2xl:-mt-[98px] text-forest-950 font-semibold'>
              Всегда.
            </h1>

            <motion.div
              style={{ y: iphoneY }}
              className='sm:absolute flex flex-col gap-12  font-medium  text-forest-950 left-1/2  bottom-[-200px] 2xl:-bottom-[280px] w-[200px] sm:w-[300px] md:w-[400px] lg:w-[500px] xl:w-[550px] 2xl:w-[600px]'>
              <span className='text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl'>Полностью автоматическое реагирование нашего агента позволяет вам не тратить деньги, время и ресурсы на поиск нужного работника-консультанта.</span>

              <InteractiveHoverButton
                duration={350}
                textColor={'#ffffff'}
                textHoverColor={'#ffffff'}
                dotSize={'w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 lg:w-2 lg:h-2 rounded-full'}
                dotColor="#ffffff"
                dotHoverColor={'#46cd48'}
                dotInitialPosition={{ left: "20%" }}
                textTranslate="translate-x-0.5 sm:translate-x-1 md:translate-x-1.5 lg:translate-x-2 group-hover:translate-x-[80px] sm:group-hover:translate-x-[100px] md:group-hover:translate-x-[120px]"
                hoverTranslate="translate-x-[80px] sm:translate-x-[100px] md:translate-x-[120px] group-hover:-translate-x-3 sm:group-hover:-translate-x-2.5 md:group-hover:-translate-x-2 lg:group-hover:-translate-x-1.5"
                arrowSize="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-6 lg:w-6"
                className={cn(
                  "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px]",
                  "text-sm sm:text-base md:text-lg lg:text-xl",
                  "py-2.5 sm:py-3 md:py-3.5 lg:py-4 xl:py-4",
                  "px-4",
                  `bg-forest-950`
                )}
              />
            </motion.div>
          </div>
          <div className='mt-32 ml-0 sm:ml-6 md:ml-12 lg:ml-16 xl:ml-20 2xl:ml-24'>
            <ImageToVideo
              loadingElement={
                <SvgSkeleton
                  svg={yourSvg}
                  isLoading={true}
                  variant={'dark'}
                  color="#a5c2b3"
                  size={500}
                  responsive={{
                    default: { width: 300, height: 300 },
                    sm: { width: 300, height: 300 },
                    md: { width: 400, height: 400 },
                    lg: { width: 450, height: 450 },
                    xl: { width: 550, height: 550 },
                    '2xl': { width: 750, height: 750 },
                  }}
                />
              }
              className={' z-[5000]'}
              step={1}
              imageSrc="/robot.png"
              videos={[{ src: '/robot7.mp4' }]}
              maskSrc={"/mask.svg"}
              responsive={{
                default: { width: 300, height: 300 },
                sm: { width: 300, height: 300 },
                md: { width: 350, height: 350 },
                lg: { width: 450, height: 450 },
                xl: { width: 550, height: 550 },
                '2xl': { width: 750, height: 750 },
              }}
            />
          </div>
        </div>
      </Section>

    {/*  <Section bgColor={"bg-forest-950"}>*/}
    {/*    <div ref={el => sectionsRef.current[2] = el} className={"flex items-center justify-center w-full h-full"}>*/}
    {/*      <div className="max-w-screen-2xl w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between">*/}
    {/*        <div className="flex w-[95%] md:w-[70%] flex-col items-center justify-center">*/}
    {/*          <Carousel className="w-[95%] md:w-[70%]">*/}
    {/*            <CarouselContent>*/}
    {/*              {Array.from({ length: 3 }).map((_, index) => (*/}
    {/*                <CarouselItem className={'select-none cursor-pointer'} key={index}>*/}
    {/*                  <div className={`h-[300px] sm:h-[400px] w-full sm:p-12 ${STEPS[index].color} rounded-3xl flex flex-col items-center justify-center text-center`}>*/}
    {/*                    <div className="text-5xl md:text-7xl mb-6">{STEPS[index].icon}</div>*/}
    {/*                    <h3 className="text-xl sm:text-3xl font-bold text-emerald-950 mb-4">{STEPS[index].title}</h3>*/}
    {/*                    <p className="text-sm max-w-[250px] sm:max-w-max sm:text-lg font-semibold text-emerald-950/50">{STEPS[index].description}</p>*/}
    {/*                  </div>*/}
    {/*                </CarouselItem>*/}
    {/*              ))}*/}
    {/*            </CarouselContent>*/}
    {/*          </Carousel>*/}

    {/*          <div className="flex items-center justify-center gap-3 mt-8">*/}
    {/*            {Array.from({ length: 3 }).map((_, index) => (*/}
    {/*              <motion.div*/}
    {/*                className={cn(*/}
    {/*                  "rounded-full h-[12px]",*/}
    {/*                  `${currentStep === index ? "bg-green-500 w-[32px]" : "bg-green-600 w-[12px]"}`,*/}
    {/*                )}*/}
    {/*                key={index}*/}
    {/*              />*/}
    {/*            ))}*/}
    {/*          </div>*/}
    {/*        </div>*/}

    {/*        <div className="z-50 w-full">*/}
    {/*          <div className=' w-full'>*/}
    {/*            <div>*/}
    {/*              <h1 className="text-white mt-8 sm:mt-0 text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold z-50 overflow-hidden">*/}
    {/*              <span ref={textRef2} className="inline-block">*/}
    {/*                Начните всего*/}
    {/*              </span>*/}
    {/*              </h1>*/}

    {/*              <h1 className="text-white text-4xl  lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold z-50 overflow-hidden">*/}
    {/*<span ref={textRef3} className="inline-block">*/}
    {/*  за 3 шага*/}
    {/*</span>*/}
    {/*              </h1>*/}
    {/*            </div>*/}
    {/*          </div>*/}

    {/*          <InteractiveHoverButton className='w-[170px] bg-emerald-600 mt-8' text={'ЧИТАТЬ'}/>*/}

    {/*        </div>*/}
    {/*      </div>*/}
    {/*    </div>*/}
    {/*  </Section>*/}

      <Section bgColor={"bg-emerald-200"}>
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
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full">
          <div
            ref={videoRef}
            className="flex flex-col w-full max-w-screen-2xl gap-8 items-center justify-center"
            style={{ height: "600px" }}
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
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full"></div>
      </Section>
    </div>
  );

  return (
    <div className={montserrat.className}>
      <motion.div
        initial={false}
        animate={{
          clipPath: isExiting
            ? "circle(150% at 50% 50%)"
            : "circle(0% at 50% 50%)",
        }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        className="fixed inset-0 bg-white z-[6000] max-w-[100vw] overflow-hidden"
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
        {content}
      </ReactLenis>
    </div>
  );
}

Section.displayName = "Section";
Card.displayName = "Card";
LargeButton.displayName = "LargeButton";
ShimmerStar.displayName = "ShimmerStar";
ParallaxStar.displayName = "ParallaxStar";