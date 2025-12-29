'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Modal } from '@/shared/ui/modal';
import { Skeleton } from '@/shared/ui/skeleton/ui/Skeleton';

interface DishCardProps {
  image: StaticImageData | string;
  title: string;
  description: string;
  price: string;
  className?: string;
}

export const DishCard: React.FC<DishCardProps> = ({
                                                    image,
                                                    title,
                                                    description,
                                                    price,
                                                    className = '',
                                                  }) => {
  const isStaticImage = typeof image !== 'string';

  return (
    <Modal
      title={title}
      description={description}
      trigger={
        <article
          className={`relative w-full sm:w-[280px] group cursor-pointer overflow-hidden ${className}`}
        >
          <div className="relative z-10">
            <div className="overflow-hidden rounded-[32px]">
              {isStaticImage ? (
                <Image
                  src={image}
                  alt={title}
                  className="w-full aspect-square object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-50"
                />
              ) : (
                <Image
                  src={image}
                  alt={title}
                  width={280}
                  height={280}
                  className="w-full aspect-square object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-50"
                  unoptimized
                />
              )}
            </div>

            <h3 className="text-xl font-semibold leading-tight truncate mt-3">
              {title}
            </h3>

            <div className="relative h-12 overflow-hidden mb-2">
              <p className="text-sm text-neutral-600 leading-relaxed">
                {description}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="px-3 h-[22px] flex items-center text-sm font-medium bg-neutral-100 rounded-xl">
                Тег
              </span>

              <button
                className="h-9 bg-emerald-950 w-[90px] rounded-2xl text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95"
                aria-label={`Добавить ${title} в корзину за ${price} рублей`}
              >
                {Math.round(Number(price))} ₽
              </button>
            </div>
          </div>
        </article>
      }
    >
      <div className="space-y-4">
        <div className="relative w-full aspect-square  rounded-3xl overflow-hidden">
          {isStaticImage ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <Image
              src={image}
              alt={title}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              unoptimized
            />
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-3xl font-bold text-emerald-950">{price} ₽</span>
        </div>
      </div>
    </Modal>
  );
};

export const DishCardSkeleton: React.FC<{ className?: string }> = ({
                                                                     className = '',
                                                                   }) => (
  <div className={`w-full sm:w-[280px] p-4 space-y-2 ${className}`}>
    <Skeleton className="!h-[280px]" width={280} height={280} borderRadius={24} variant="light" />
    <Skeleton height={27} width="70%" borderRadius={4} variant="light" />
    <Skeleton height={16} width="50%" borderRadius={4} variant="light" />

    <div className="flex items-center justify-between pt-2">
      <Skeleton height={22} width={60} borderRadius={12} variant="light" />
      <Skeleton height={36} width={90} borderRadius={16} variant="light" />
    </div>
  </div>
);