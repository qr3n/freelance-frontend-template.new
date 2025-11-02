'use client';

import ReactLenis from 'lenis/react';
import { PropsWithChildren, useRef, memo, useMemo, useState, useEffect } from 'react';
import { cn } from '@/shared/shadcn/lib/utils';
import { TailwindBgColor  } from '@/shared/types';
import { Button, ButtonProps } from '@/shared/shadcn/ui/button';
import ImageToVideo from '@/shared/ui/image-to-video/ui/ImageToVideo';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { DeviceFrameset } from "react-device-frameset";
import 'react-device-frameset/styles/marvel-devices.min.css'
import { TextBackgroundSvg } from '@/shared/ui/svg/ui/TextBackgroundSvg';
import { useIntersectionObserver } from '@/shared/hooks';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/shadcn/ui/carousel';
import { ArrowSvg } from '@/shared/ui/svg/ui/ArrowSvg';
import { TelegramSvg } from '@/shared/ui/svg/ui/TelegramSvg';
import { ShimmerSquare } from './ShimmerStar';
import { useRouter } from 'next/navigation';

interface ISectionProps extends PropsWithChildren {
  bgColor?: TailwindBgColor;
}

const Section = memo((props: ISectionProps) => (
  <section className={cn('w-full h-[100dvh] relative', props.bgColor)}>
    {props.children}
  </section>
));


interface ICardProps extends PropsWithChildren {
  bgColor: TailwindBgColor;
}

const Card = memo((props: ICardProps) => {
  return (
    <div className={cn('px-20 py-8 rounded-[36px] h-[600px]', props.bgColor)}>
      <h1 className='font-bold text-white text-3xl'>
        Ресторан
      </h1>
    </div>
  )
});

const LargeButton = memo((props: ButtonProps) => {
  return (
    <Button {...props} className={cn('text-4xl py-[36px] px-[52px]', props.className)}/>
  )
});

// Мемоизируем TextBackground для предотвращения ререндеров






const ParallaxStar = memo(({ y, className, size, delay = 0, shimmerColor, starColor }: {
  y: MotionValue<number>,
  className: string,
  size: string,
  delay?: number,
  starColor?: string;
  shimmerColor?: string;
}) => {
  // Анимация быстрой прокрутки с bounce эффектом
  const spinTransition = useMemo(() => ({
    duration: 0.8,
    ease: "easeOut" as const,
    repeat: Infinity,
    repeatDelay: 4 + delay, // Разные задержки для разных звезд
    times: [0, 0.3, 0.6, 1],
  }), [delay]);

  return (
    <div className={className}>
      <motion.div
        style={{
          y,
          transform: 'translateZ(0)', // Принудительно на GPU
          willChange: 'transform'
        }}
        className={size}
        animate={{
          rotate: [0, 180]
        }}
        transition={spinTransition}
      >
        <ShimmerSquare className="w-full h-full" shimmerColor={shimmerColor} starColor={starColor}/>
      </motion.div>
    </div>
  );
});



export default function Home() {
  const containerRef = useRef(null);
  const [currentStep] = useState(0);
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    router.prefetch('/bot/create');
  }, [router]);

  const handleContinue = () => {
    setIsExiting(true);

    setTimeout(() => {
      router.push('/bot/create');
    }, 400);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const { ref: videoRef, isIntersecting: isAnimated } = useIntersectionObserver({
    threshold: 0.4,
    rootMargin: '0px',
    triggerOnce: true,
    intersectionRatio: 0.4
  });

  const star1Y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const star2Y = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const iphoneY = useTransform(scrollYProgress, [0, 1], [0, -700]);
  const iphoneRotateX = useTransform(scrollYProgress, [0, 0.2, 0.3], [60, 15, 0]);
  const videoY = useTransform(scrollYProgress, [0.4, 1], [0, 200]);

  return (
    <>
      <motion.div
        initial={false}
        animate={{
          clipPath: isExiting
            ? 'circle(150% at 50% 50%)'
            : 'circle(0% at 50% 50%)'
        }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        className="fixed inset-0 bg-white z-[1000]"
      />
      <ReactLenis root options={{
        duration: 1,
        lerp: 0
      }} />
      <div ref={containerRef}>
        <Section bgColor={'bg-emerald-950'}>
          <div className='absolute top-0 left-0 w-full h-full'>
            <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#010804]'/>
          </div>
          <div className='overflow-y-hidden w-full flex items-center justify-center'>
            <div className='w-full max-w-[1750px] px-8 py-24 flex relative justify-between'>
              <div>
                <motion.div
                  className='absolute z-50'
                >
                  <h1 className='text-white text-9xl font-bold'>
                    Ваш AI-агент <br/>
                    <span className='relative'>
                      <TextBackgroundSvg/>
                      <span className='z-10 relative text-emerald-950'>уже готов.</span>
                    </span>
                  </h1>

                  <LargeButton
                    onClick={handleContinue}
                    className='mt-20 rotate-[-5deg] bg-white text-emerald-950 hover:bg-emerald-100 transition-colors duration-200'
                  >
                    Выбрать агента
                  </LargeButton>

                  <div className={'scale-[60%] opacity-50 top-64 rotate-[-8deg] absolute left-[500px]'}>
                    <DeviceFrameset
                      device="iPhone X"
                      color="black"
                    >
                      <div className='w-full h-full bg-gradient-to-br from-emerald-950 to-emerald-800 flex items-center justify-center'>
                        <TelegramSvg/>

                      </div>
                    </DeviceFrameset>

                  </div>
                </motion.div>

                {/* Оптимизированные звезды с параллаксом и bounce анимацией */}
                <ParallaxStar
                  y={star1Y}
                  className="absolute top-16 right-0"
                  size="w-[150px] h-[150px]"
                  starColor={'#14532d'}
                  shimmerColor={'#4ade80'}
                  delay={0}
                />

                <ParallaxStar
                  y={star2Y}
                  className="absolute bottom-16 left-16"
                  size="w-[300px] h-[300px]"
                  starColor={'#14532d'}
                  shimmerColor={'#4ade80'}
                  delay={2}
                />
              </div>

              <ImageToVideo
                imageSrc="/robot.png"
                videoSrc="/robot3.mp4"
                maskSrc={'/mask.svg'}
                width={750}
                height={750}
              />
            </div>
          </div>
        </Section>

        <Section bgColor={'bg-emerald-50'} >
          <div className='flex w-full items-center justify-center pt-32'>
            <div
              className='absolute -bottom-1/4 z-50'
              style={{
                perspective: '1200px',
                perspectiveOrigin: 'center center'
              }}
            >
              <motion.div
                style={{
                  y: iphoneY,
                  rotateX: iphoneRotateX,
                  transformOrigin: 'center bottom',
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(0)',
                  willChange: 'transform'
                }}
              >
                <DeviceFrameset
                  device="iPhone X"
                  color="black"
                  style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}
                >
                </DeviceFrameset>
              </motion.div>
            </div>
          </div>

          <div className='absolute top-0 left-0 w-full h-full'>
            <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-emerald-100/50'/>
          </div>
        </Section>

        <Section bgColor={'bg-forest-950'}>
          <div className='absolute top-0 left-0 w-full h-full'>
            <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#022a16]'/>
          </div>

          <div className={'flex items-center justify-center w-full h-full'}>
            <div className='max-w-screen-2xl w-full h-full flex items-center justify-between'>
              <div className='flex w-[70%] flex-col items-center justify-center'>
                <Carousel className="w-[70%]">
                  <CarouselContent>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <CarouselItem key={index}>
                        <div className="h-[400px] w-full p-24 bg-white rounded-3xl">
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                <div className='flex items-center justify-center gap-3 mt-8'>
                  {Array.from({ length: 3 }).map((_, index) =>
                    <motion.div
                      className={cn('rounded-full h-[12px]', `${currentStep === index ? 'bg-green-500 w-[32px]' : 'bg-green-600 w-[12px]'}`)}
                      key={index}
                    />)}
                </div>
              </div>

              <div className='z-50'>
                <h1 className={'text-white text-7xl font-bold z-50'}>
                  Начните всего <br/> за 3 шага
               </h1>

                <LargeButton className='bg-emerald-500 text-emerald-950 mt-12 rotate-[-4] hover:bg-emerald-600'>Узнать подробнее</LargeButton>
              </div>
            </div>
          </div>

          {/*/>*/}
        </Section>

        <Section bgColor={'bg-emerald-200'}>
          <div className='absolute top-0 left-0 w-full h-full'>
            <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-forest-400' />
            <ParallaxStar
              starColor={'#4a6d5d'}
              shimmerColor={'#e5fbf1'}
              className="absolute bottom-24 left-24"
              size="w-[150px] h-[150px]"
              delay={0}
            />

            <ParallaxStar
              starColor={'#4a6d5d'}
              shimmerColor={'#e5fbf1'}
              className="absolute bottom-64 left-48"
              size="w-[250px] h-[250px]"
              delay={2}
            />

            <ParallaxStar
              starColor={'#4a6d5d'}
              shimmerColor={'#e5fbf1'}
              className="absolute top-16 right-16"
              size="w-[350px] h-[350px]"
              delay={1}
            />
          </div>

          <div className='flex flex-col items-center justify-center w-full h-full'>
            <div
              ref={videoRef}
              className='flex flex-col w-full max-w-screen-2xl gap-8 items-center justify-center'
              style={{ height: '600px' }} // Фиксированная высота вместо h-full
            >
              { isAnimated &&
                <motion.div
                  className={'relative'} // Изменили на relative
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    y: videoY,
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}
                >
                  <ImageToVideo
                    imageSrc="/robot.png"
                    videoSrc="/robot4.mp4"
                    maskSrc={'/mask2.svg'}
                    width={600}
                    height={600}
                  />
                </motion.div>
              }
            </div>
          </div>

          <div className='absolute top-0 left-0 w-full h-full'>
          </div>
        </Section>

        <Section>
          <div className='absolute w-full p-10 h-full top-0 left-0'>
          </div>

          <div className='w-full h-full flex flex-col items-center justify-center'>
            <h1 className={'text-emerald-800 text-center text-7xl font-bold z-50'}>
              Абсолютная <br/> универсальность
            </h1>

            <div className='flex items-center justify-center gap-24'>
              <ArrowSvg width={600} height={400}/>
            </div>

            {/*<div className='absolute w-full h-full top-0 left-0'>*/}
            {/*  <Image src={sushiImg} alt={'sushiImg'} width={350} height={350}/>*/}
            {/*  <Image src={ramenImg} alt={'sushiImg'} width={350} height={350}/>*/}
            {/*  <Image src={spa2Img} alt={'sushiImg'} width={350} height={350}/>*/}
            {/*</div>*/}
          </div>

        </Section>

        <Section bgColor={'bg-emerald-950'}>
          <div className='absolute top-0 left-0 w-full h-full '>
            <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#010804]'/>
          </div>
          <div className='w-full h-full flex items-center justify-center z-50'>
            <div className='max-w-xl  w-full z-50'>
              <div>

              </div>
            </div>
          </div>
        </Section>
      </div>
    </>
  )
}
Section.displayName = 'Section'
Card.displayName = 'Card'
LargeButton.displayName = 'LargeButton'
ShimmerSquare.displayName = 'ShimmerStar'
ParallaxStar.displayName = 'ParallaxStar'
