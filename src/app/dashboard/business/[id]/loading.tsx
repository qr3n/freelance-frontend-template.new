import { Montserrat } from 'next/font/google';
import React from 'react';
import { DishCardSkeleton } from '@/features/dish/create/ui/DishCard';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function Loading() {
  return (
    <div className={`bg-white w-full h-[100dvh] ${montserrat.className}`}>
      <div className="h-[calc(100dvh-0px)] overflow-hidden relative pb-24">
        <div>
          <div className='flex flex-col items-center'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full sm:max-w-max gap-4 pt-12 px-4 sm:px-0'>
              <DishCardSkeleton />
              <DishCardSkeleton />
              <DishCardSkeleton />
              <DishCardSkeleton />
              <DishCardSkeleton />
              <DishCardSkeleton />
              <DishCardSkeleton />
              <DishCardSkeleton />
              <DishCardSkeleton />
            </div>
          </div>
        </div>
      </div>

      <div className='w-full h-[100dvh] bg-gradient-to-b from-transparent to-white fixed top-0 left-0 '/>
    </div>
  );
}