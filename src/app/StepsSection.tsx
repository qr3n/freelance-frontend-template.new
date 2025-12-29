"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/shadcn/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/shadcn/ui/carousel";
import LargeButton from './LargeButton';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface StepsSectionProps {
  steps: Step[];
}

export default function StepsSection({ steps }: StepsSectionProps) {
  const [currentStep] = useState(0);

  return (
    <div className={"flex pby items-center justify-center w-full h-full"}>
      <div className="max-w-screen-2xl w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between">
        <div className="flex w-[95%] md:w-[70%] flex-col items-center justify-center">
          <Carousel className="w-[95%] md:w-[70%]">
            <CarouselContent>
              {steps.map((step, index) => (
                <CarouselItem className={'select-none cursor-pointer'} key={index}>
                  <div className={`h-[300px] sm:h-[400px] w-full sm:p-12 ${step.color} rounded-3xl flex flex-col items-center justify-center text-center`}>
                    <div className="text-5xl md:text-7xl mb-6">{step.icon}</div>
                    <h3 className="text-xl sm:text-3xl font-bold text-emerald-950 mb-4">{step.title}</h3>
                    <p className="text-sm max-w-[250px] sm:max-w-max sm:text-lg font-semibold text-emerald-950/50">{step.description}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex items-center justify-center gap-3 mt-8">
            {steps.map((_, index) => (
              <motion.div
                className={cn(
                  "rounded-full h-[12px]",
                  `${currentStep === index ? "bg-green-500 w-[32px]" : "bg-green-600 w-[12px]"}`
                )}
                key={index}
              />
            ))}
          </div>
        </div>

        <div className="z-50">
          <h1 className={"text-white mt-8 sm:mt-0 text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold z-50"}>
            Начните всего <br /> за 3 шага
          </h1>

          <LargeButton className="bg-emerald-500 text-emerald-950 mt-6 sm:mt-12 rotate-[-4] hover:bg-emerald-600">
            Узнать подробнее
          </LargeButton>
        </div>
      </div>
    </div>
  );
}