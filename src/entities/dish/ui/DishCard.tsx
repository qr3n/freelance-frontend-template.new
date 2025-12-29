'use client';

import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { Modal } from '@/shared/ui/modal';
import { Skeleton } from '@/shared/ui/skeleton/ui/Skeleton';
import { Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useDeleteDish } from '@/features/dish/create/model/hooks';
import { Badge } from '@/shared/shadcn/ui/badge';
import { CATEGORY_OPTIONS, CUISINE_OPTIONS } from '@/features/dish/create/model/schemas';

interface DishCardProps {
  image: StaticImageData | string;
  title: string;
  description: string;
  price: string;
  className?: string;
  onEdit?: () => void;
  id: string;
  onDelete?: () => void;
  category?: string | null;
  cuisine?: string | null;
  tags?: string[];
  ingredients?: string[];
  allergens?: string[];
}

export const DishCard: React.FC<DishCardProps> = ({
                                                    id,
                                                    image,
                                                    title,
                                                    description,
                                                    price,
                                                    className = '',
                                                    onEdit,
                                                    onDelete,
                                                    category,
                                                    cuisine,
                                                    tags = [],
                                                    ingredients = [],
                                                    allergens = [],
                                                  }) => {
  const [isCardImageLoaded, setIsCardImageLoaded] = useState(false);
  const [isModalImageLoaded, setIsModalImageLoaded] = useState(false);
  const [showCardSkeleton, setShowCardSkeleton] = useState(true);
  const [showModalSkeleton, setShowModalSkeleton] = useState(true);
  const isStaticImage = typeof image !== 'string';

  const { mutateAsync } = useDeleteDish();

  const handleCardImageLoad = () => {
    setIsCardImageLoaded(true);
    setTimeout(() => {
      setShowCardSkeleton(false);
    }, 1000);
  };

  const handleModalImageLoad = () => {
    setIsModalImageLoaded(true);
    setTimeout(() => {
      setShowModalSkeleton(false);
    }, 1000);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutateAsync(id);
  };

  // Get category and cuisine labels
  const categoryLabel = category
    ? CATEGORY_OPTIONS.find(c => c.value === category)?.label
    : null;
  const cuisineLabel = cuisine
    ? CUISINE_OPTIONS.find(c => c.value === cuisine)?.label
    : null;

  // Display first tag or category
  const displayTag = tags[0] || categoryLabel || 'Блюдо';

  return (
    <Modal
      title={title}
      description={description}
      trigger={
        <article
          className={`relative rounded-3xl w-full sm:w-[280px] group cursor-pointer overflow-hidden ${className}`}
        >
          <div className="relative z-10">
            <div className="overflow-hidden rounded-[32px] relative aspect-square">
              <Skeleton
                width="100%"
                height="100%"
                borderRadius="32px"
                className={`absolute inset-0 transition-opacity duration-300 ${
                  showCardSkeleton ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {isStaticImage ? (
                <Image
                  src={image}
                  alt={title}
                  className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-50 absolute inset-0 ${
                    isCardImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleCardImageLoad}
                />
              ) : (
                <Image
                  src={image}
                  alt={title}
                  width={280}
                  height={280}
                  className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-50 absolute inset-0 ${
                    isCardImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleCardImageLoad}
                  unoptimized
                />
              )}

              {/* Иконки редактирования и удаления */}
              <div className="absolute top-5 left-5 right-5 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <button
                  onClick={handleEdit}
                  className="w-8 h-8 bg-emerald-500 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                  aria-label={`Редактировать ${title}`}
                >
                  <Pencil className="w-4 h-4 text-emerald-950" color={'green'} />
                </button>
                <button
                  onClick={handleDelete}
                  className="w-8 h-8 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all duration-200 shadow-lg"
                  aria-label={`Удалить ${title}`}
                >
                  <Trash2 className="w-4 h-4 text-red-600" color={'white'} />
                </button>
              </div>

              {/* Allergen warning badge */}
              {allergens.length > 0 && (
                <div className="absolute top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <Badge  className="rounded-full bg-forest-400 flex items-center gap-1 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    Аллергены
                  </Badge>
                </div>
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

            <div className="flex items-center justify-between">
              <span className="px-3 h-[22px] flex items-center text-sm font-medium bg-neutral-100 rounded-xl truncate max-w-[140px]">
                {displayTag}
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
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden">
          <Skeleton
            width="100%"
            height="100%"
            borderRadius="16px"
            className={`absolute inset-0 transition-opacity duration-300 ${
              showModalSkeleton ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {isStaticImage ? (
            <Image
              src={image}
              alt={title}
              fill
              className={`object-cover transition-opacity duration-300 absolute inset-0 ${
                isModalImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleModalImageLoad}
            />
          ) : (
            <Image
              src={image}
              alt={title}
              width={600}
              height={600}
              className={`w-full h-full object-cover transition-opacity duration-300 absolute inset-0 ${
                isModalImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleModalImageLoad}
              unoptimized
            />
          )}
        </div>

        <div>
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-2xl font-semibold flex-1">{title}</h2>
            <span className="text-3xl font-bold text-emerald-950 ml-4">
              {Math.round(Number(price))} ₽
            </span>
          </div>

          {/* Category and Cuisine badges */}
          {(categoryLabel || cuisineLabel) && (
            <div className="flex gap-2 mb-3">
              {categoryLabel && (
                <Badge variant="secondary" className="text-sm">
                  {categoryLabel}
                </Badge>
              )}
              {cuisineLabel && (
                <Badge variant="outline" className="text-sm">
                  {cuisineLabel}
                </Badge>
              )}
            </div>
          )}

          <p className="text-gray-600 leading-relaxed mb-4">{description}</p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Теги</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {ingredients.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Основные ингредиенты</h3>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {allergens.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 rounded-2xl border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-semibold text-red-900">Содержит аллергены</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};