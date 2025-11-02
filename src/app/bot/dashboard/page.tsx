'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdEditSquare, MdAdd } from "react-icons/md";
import { IoImage, IoTrashBin } from 'react-icons/io5';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { Lenis } from 'lenis/react';
import { Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/shared/shadcn/ui/button';
import { Input } from '@/shared/shadcn/ui/input';
import { Badge } from '@/shared/shadcn/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/shared/shadcn/ui/tabs';
import { Modal } from '@/shared/ui/modal';
import { TextBackgroundSvg } from '@/shared/ui/svg/ui/TextBackgroundSvg';
import { sushiImg } from '@/shared/assets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/shadcn/ui/alert-dialog';
import { Skeleton } from '@/shared/shadcn/ui/skeleton';
import { FaPlus } from 'react-icons/fa6';

interface Dish {
  dish_id: string;
  restaurant_id: string;
  restaurant_name: string;
  dish_name: string;
  alt_names?: string;
  description?: string;
  ingredients?: string;
  weight_g?: number;
  price: number;
  currency: string;
  city: string;
  available: boolean;
  category: string;
  photo_url?: string;
  spicy_level?: number;
  tags?: string;
  updated_at: string;
}

type DishFormData = Omit<Dish, 'dish_id' | 'updated_at'>;
type TabValue = 'all' | 'available' | 'popular';

// ============= VALIDATION =============
const dishSchema = z.object({
  restaurant_id: z.string().min(1, 'Обязательное поле'),
  restaurant_name: z.string().min(1, 'Обязательное поле'),
  dish_name: z.string().min(1, 'Обязательное поле'),
  alt_names: z.string().optional(),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  weight_g: z.coerce.number().min(0).optional(),
  price: z.coerce.number().min(0, 'Цена должна быть положительной'),
  currency: z.string().default('RUB'),
  city: z.string().min(1, 'Обязательное поле'),
  available: z.boolean().default(true),
  category: z.string().min(1, 'Обязательное поле'),
  photo_url: z.string().optional(),
  spicy_level: z.coerce.number().min(0).max(5).optional(),
  tags: z.string().optional(),
});

// ============= CONSTANTS =============
const ANIMATION_CONFIG = {
  transition: {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  },
  scale: {
    duration: 0.3,
    ease: [0.34, 1.56, 0.64, 1] as const
  }
};

const mockDishes: Dish[] = [
  {
    dish_id: 'G1',
    restaurant_id: 'gotai_msk',
    restaurant_name: 'GoTai',
    dish_name: 'Шпинат с арахисом',
    description: 'Свежий шпинат с хрустящим арахисом',
    ingredients: 'Шпинат, арахис, соус',
    weight_g: 200,
    price: 900,
    currency: 'RUB',
    city: 'Москва',
    available: true,
    category: 'Холодные блюда',
    photo_url: 'https://drive.google.com/uc?export=download&id=15mru9QiFIhylFDjbYeczgZe0GewZDw5x',
    spicy_level: 1,
    tags: 'вегетарианское',
    updated_at: '2025-09-24',
  },
  {
    dish_id: 'G2',
    restaurant_id: 'gotai_msk',
    restaurant_name: 'GoTai',
    dish_name: 'Том Ям с креветками',
    description: 'Острый тайский суп с креветками и лемонграссом',
    ingredients: 'Креветки, лемонграсс, перец чили, лайм',
    weight_g: 350,
    price: 1200,
    currency: 'RUB',
    city: 'Москва',
    available: true,
    category: 'Супы',
    spicy_level: 3,
    tags: 'острое,популярное',
    updated_at: '2025-09-24',
  },
  {
    dish_id: 'G3',
    restaurant_id: 'gotai_msk',
    restaurant_name: 'GoTai',
    dish_name: 'Пад Тай с курицей',
    description: 'Традиционная тайская лапша с курицей',
    ingredients: 'Рисовая лапша, курица, яйцо, арахис',
    weight_g: 300,
    price: 850,
    currency: 'RUB',
    city: 'Москва',
    available: false,
    category: 'Горячие блюда',
    spicy_level: 2,
    tags: 'популярное',
    updated_at: '2025-09-23',
  },
];

// ============= API =============
const dishApi = {
  getAll: async (): Promise<Dish[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockDishes];
  },

  create: async (data: DishFormData): Promise<Dish> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newDish: Dish = {
      ...data,
      dish_id: `D${Date.now()}`,
      updated_at: new Date().toISOString().split('T')[0],
    };
    mockDishes.push(newDish);
    return newDish;
  },

  update: async (id: string, data: DishFormData): Promise<Dish> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = mockDishes.findIndex(d => d.dish_id === id);
    if (index === -1) throw new Error('Dish not found');

    const updated: Dish = {
      ...data,
      dish_id: id,
      updated_at: new Date().toISOString().split('T')[0],
    };
    mockDishes[index] = updated;
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockDishes.findIndex(d => d.dish_id === id);
    if (index === -1) throw new Error('Dish not found');
    mockDishes.splice(index, 1);
  },
};

// ============= HOOKS =============
const useDishes = () => useQuery({
  queryKey: ['dishes'],
  queryFn: dishApi.getAll,
});

const useCreateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      toast.success('Блюдо создано!');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });
};

const useUpdateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DishFormData }) => dishApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      toast.success('Блюдо обновлено!');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });
};

const useDeleteDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      toast.success('Блюдо удалено');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });
};

// ============= SHARED COMPONENTS =============
const FormInput = memo<{
  label: string;
  placeholder?: string;
  type?: string;
  rows?: number;
  error?: string;
  register?: any;
}>(({ label, placeholder, type = 'text', rows, error, register }) => {
  const Component = rows ? 'textarea' : 'input';

  return (
    <div>
      <label className='text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5 sm:mb-2 block'>{label}</label>
      <Component
        {...register}
        type={type}
        placeholder={placeholder}
        rows={rows}
        className='w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-zinc-500 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors resize-none'
      />
      {error && <p className='text-red-500 text-xs sm:text-sm mt-1'>{error}</p>}
    </div>
  );
});

const AnimatedButton = memo<{
  onClick?: () => void;
  className: string;
  children: React.ReactNode;
  isHovered: boolean;
  delay?: number;
}>(({ onClick, className, children, isHovered, delay = 0 }) => (
  <motion.div
    onClick={onClick}
    initial={{ scale: 0, opacity: 0 }}
    animate={isHovered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{
      scale: { ...ANIMATION_CONFIG.scale, delay },
      opacity: { duration: 0.2, delay }
    }}
    className={className}
  >
    {children}
  </motion.div>
));

// ============= DISH CARD =============
const DishCard = memo<{ dish: Dish; onEdit: () => void; onDelete: () => void }>(({
                                                                                   dish,
                                                                                   onEdit,
                                                                                   onDelete
                                                                                 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className='bg-zinc-100 rounded-2xl sm:rounded-3xl p-3 sm:p-4 group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='relative bg-black rounded-2xl sm:rounded-3xl overflow-hidden will-change-transform'>
        <motion.div
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className='will-change-transform'
        >
          <Image
            src={ sushiImg}
            alt={dish.dish_name}
            width={400}
            height={300}
            className='transition-all duration-300 will-change-transform transform-gpu group-hover:brightness-[50%]'
          />
        </motion.div>

        <AnimatedButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          isHovered={isHovered}
          className='cursor-pointer shadow-xl hover:bg-red-900 absolute p-1.5 sm:p-2 top-2 sm:top-4 left-2 sm:left-4 z-[500] bg-red-800 rounded-lg sm:rounded-xl'
        >
          <IoTrashBin className='fill-red-500 w-4 h-4 sm:w-5 sm:h-5'/>
        </AnimatedButton>

        <AnimatedButton
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          isHovered={isHovered}
          delay={0.05}
          className='cursor-pointer shadow-xl hover:bg-emerald-600 absolute p-1.5 sm:p-2 top-2 sm:top-4 right-2 sm:right-4 z-[500] bg-emerald-500 rounded-lg sm:rounded-xl'
        >
          <MdEditSquare className='fill-emerald-800 w-4 h-4 sm:w-5 sm:h-5'/>
        </AnimatedButton>

        {!dish.available && (
          <div className='absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center overflow-hidden justify-center rounded-2xl'>
            <div className='group-hover:brightness-50 transition-all bg-gradient-to-r from-red-500 to-red-600 rounded-2xl  px-4 py-2 shadow-2xl transform rotate-[-5deg]'>
              <p className='text-white font-bold text-sm sm:text-base tracking-wide'>
                Нет в наличии
              </p>
            </div>
          </div>
        )}
      </div>

      <h1 className='mt-3 sm:mt-4 text-base sm:text-xl font-semibold line-clamp-1'>{dish.dish_name}</h1>
      <p className='text-xs  font-medium text-zinc-500 line-clamp-2'>
        {dish.description || 'Описание отсутствует'}
      </p>
      <div className='flex justify-between items-center mt-4'>
        <Badge className='rounded-full text-xs'>{dish.category}</Badge>
        <h1 className='font-semibold text-sm sm:text-base'>{dish.price}р.</h1>
      </div>
    </div>
  );
});

// ============= SKELETON LOADER =============
const DishCardSkeleton = memo(() => (
  <div className='bg-zinc-100 rounded-2xl sm:rounded-3xl p-3 sm:p-4'>
    <Skeleton className='w-full aspect-video rounded-2xl sm:rounded-3xl' />
    <Skeleton className='h-6 w-3/4 mt-3 sm:mt-4 rounded-lg' />
    <Skeleton className='h-4 w-full mt-2 rounded-lg' />
    <Skeleton className='h-4 w-5/6 mt-1 rounded-lg' />
    <div className='flex justify-between items-center mt-2'>
      <Skeleton className='h-6 w-20 rounded-full' />
      <Skeleton className='h-5 w-16 rounded-lg' />
    </div>
  </div>
));

// ============= DISH FORM =============
const DishForm = memo<{ dish?: Dish; onSubmitStart: () => void }>(({
                                                                     dish,
                                                                     onSubmitStart
                                                                   }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(dish?.photo_url || null);
  const createMutation = useCreateDish();
  const updateMutation = useUpdateDish();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<DishFormData>({
    resolver: zodResolver(dishSchema),
    defaultValues: dish || {
      restaurant_id: 'gotai_msk',
      restaurant_name: 'GoTai',
      dish_name: '',
      price: 0,
      currency: 'RUB',
      city: 'Москва',
      available: true,
      category: 'Холодные блюда',
      spicy_level: 0,
      tags: '',
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUploadedImage(result);
        setValue('photo_url', result);
      };
      reader.readAsDataURL(file);
      toast.success('Фото загружено');
    }
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
  });

  const removeImage = useCallback(() => {
    setUploadedImage(null);
    setValue('photo_url', '');
  }, [setValue]);

  const onSubmit = useCallback(async (data: DishFormData) => {
    onSubmitStart();
    try {
      if (dish) {
        await updateMutation.mutateAsync({ id: dish.dish_id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      // Errors handled by mutations
    }
  }, [dish, createMutation, updateMutation, onSubmitStart]);

  const blocks = useMemo(() => [
    <div className='h-full flex flex-col gap-4 sm:gap-6 md:gap-8' key={0}>
      <div
        {...getRootProps()}
        className={`dotted-background w-full overflow-hidden bg-zinc-100 flex-col aspect-video relative flex items-center cursor-pointer justify-center h-min rounded-2xl sm:rounded-3xl border-2 border-dashed transition-colors ${
          isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-zinc-300'
        }`}
      >
        <input {...getInputProps()} />
        {uploadedImage ? (
          <>
            <img src={uploadedImage} alt="Preview" className='w-full h-full object-cover' />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600'
            >
              <X className='w-4 h-4' />
            </button>
          </>
        ) : (
          <div className='relative flex flex-col items-center justify-center gap-2'>
            <div className='relative flex items-center justify-center'>
              <div className='absolute w-[40px] h-[32px] sm:w-[48px] sm:h-[40px] rounded-md bg-zinc-100'/>
              <IoImage className='!w-[50px] !h-[50px] sm:!w-[60px] sm:!h-[60px] absolute fill-zinc-400'/>
            </div>
            <p className='text-sm text-zinc-500 mt-12'>
              {isDragActive ? 'Отпустите файл' : 'Перетащите фото или нажмите'}
            </p>
          </div>
        )}
      </div>
      <div className='w-full mt-2 space-y-3 sm:space-y-4'>
        <Input
          {...register('dish_name')}
          autoFocus
          placeholder='Название блюда'
          className='focus-visible:ring-zinc-500 bg-zinc-100 hover:bg-zinc-200 rounded-[12px] h-[44px] sm:h-[48px] text-sm sm:text-base'
        />
        {errors.dish_name && (
          <p className='text-red-500 text-xs sm:text-sm'>{errors.dish_name.message}</p>
        )}
        <Input
          {...register('description')}
          placeholder='Описание блюда'
          className='focus-visible:ring-zinc-500 bg-zinc-100 hover:bg-zinc-200 rounded-[12px] h-[44px] sm:h-[48px] text-sm sm:text-base'
        />
      </div>
    </div>,

    <div className='h-full flex flex-col gap-4 sm:gap-6' key={1}>
      <div className='space-y-3 sm:space-y-4'>
        <FormInput
          label="Категория"
          placeholder="Холодные блюда"
          register={register('category')}
          error={errors.category?.message}
        />

        <FormInput
          label="Ингредиенты"
          placeholder="Перечислите через запятую"
          rows={3}
          register={register('ingredients')}
        />

        <div className='grid grid-cols-2 gap-3 sm:gap-4'>
          <FormInput
            label="Вес (г)"
            type="number"
            placeholder="250"
            register={register('weight_g')}
          />
          <FormInput
            label="Цена (₽)"
            type="number"
            placeholder="900"
            register={register('price')}
            error={errors.price?.message}
          />
        </div>

        <div className='grid grid-cols-2 gap-3 sm:gap-4'>
          <FormInput
            label="Острота (0-5)"
            type="number"
            placeholder="0"
            register={register('spicy_level')}
          />
          <div>
            <label className='text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5 sm:mb-2 block'>
              Доступность
            </label>
            <label className='flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-100 hover:bg-zinc-200 rounded-xl cursor-pointer transition-colors'>
              <input
                type="checkbox"
                {...register('available')}
                className='w-4 h-4'
              />
              <span className='text-sm sm:text-base'>В наличии</span>
            </label>
          </div>
        </div>

        <FormInput
          label="Теги (через запятую)"
          placeholder="вегетарианское, острое"
          register={register('tags')}
        />
      </div>
    </div>
  ], [uploadedImage, register, errors, getRootProps, getInputProps, isDragActive, removeImage]);

  const handleNext = useCallback(() => {
    if (currentIndex < blocks.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  }, [currentIndex, blocks.length, handleSubmit, onSubmit]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  return (
    <div className='flex overflow-hidden relative flex-col w-full h-[calc(90dvh-100px)] sm:h-[calc(85dvh-128px)]'>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={ANIMATION_CONFIG.transition}
          className='absolute w-full h-full px-4 sm:px-8 md:px-12 lg:px-16'
        >
          {blocks[currentIndex]}
        </motion.div>
      </AnimatePresence>

      <div className='absolute bottom-0 px-4 sm:px-8 md:px-12 lg:px-16 w-full'>
        <div className='flex gap-3'>
          {currentIndex > 0 && (
            <Button
              onClick={handleBack}
              size='lg'
              variant='outline'
              className='w-24 text-base sm:text-lg md:text-xl mt-4 sm:mt-6 !h-[48px] sm:!h-[54px]'
            >
              Назад
            </Button>
          )}
          <Button
            onClick={handleNext}
            size='lg'
            className='flex-1 bg-emerald-950 text-base sm:text-lg md:text-xl mt-4 sm:mt-6 !h-[48px] sm:!h-[54px]'
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Сохранение...'
              : currentIndex < blocks.length - 1 ? 'Далее' : 'Сохранить'
            }
          </Button>
        </div>
      </div>
    </div>
  );
});

// ============= SEARCH HEADER =============
const SearchHeader = memo<{
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeTab: TabValue;
  onTabChange: (value: TabValue) => void;
}>(({ searchValue, onSearchChange, activeTab, onTabChange }) => {
  return (
    <div className='h-[270px] sm:h-[240px] md:h-[270px] flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[24rem] bg-white mb-4 md:mb-8'>
      <h1 className='text-white text-3xl sm:text-4xl md:text-5xl mt-4 md:mt-8 font-bold'>
        <span className='relative'>
          <TextBackgroundSvg mode='short' />
          <span className='z-10 relative text-emerald-950'>Меню</span>
        </span>
      </h1>

      <div className='relative w-full max-w-md mt-4 md:mt-6'>
        <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-zinc-400' />
        <input
          type='text'
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Поиск блюд...'
          className='w-full pl-10 md:pl-12 pr-10 py-2.5 md:py-3 text-sm md:text-base rounded-2xl bg-zinc-100 border-none focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600'
          >
            <X className='w-4 h-4 md:w-5 md:h-5' />
          </button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabValue)} className='mt-4 md:mt-8'>
        <TabsList className='text-xs sm:text-sm'>
          <TabsTrigger value='all' className='px-3 sm:px-4'>Все блюда</TabsTrigger>
          <TabsTrigger value='available' className='px-3 sm:px-4'>В наличии</TabsTrigger>
          <TabsTrigger value='popular' className='px-3 sm:px-4'>Популярные</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
});

// ============= MAIN PAGE =============
export default function MenuPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | undefined>();
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [deleteConfirmDish, setDeleteConfirmDish] = useState<Dish | null>(null);

  const { data: dishes, isLoading } = useDishes();
  const deleteMutation = useDeleteDish();

  const filteredDishes = useMemo(() => {
    if (!dishes) return [];

    let filtered = [...dishes];

    // Поиск
    if (searchValue.trim()) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(dish =>
        dish.dish_name.toLowerCase().includes(search) ||
        dish.description?.toLowerCase().includes(search) ||
        dish.ingredients?.toLowerCase().includes(search) ||
        dish.category.toLowerCase().includes(search)
      );
    }

    // Фильтрация по табам
    if (activeTab === 'available') {
      filtered = filtered.filter(dish => dish.available);
    } else if (activeTab === 'popular') {
      filtered = filtered.filter(dish => dish.tags?.includes('популярное'));
    }

    return filtered;
  }, [dishes, searchValue, activeTab]);

  const handleSubmitStart = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingDish(undefined);
  }, []);

  const handleEdit = useCallback((dish?: Dish) => {
    setEditingDish(dish);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((dish: Dish) => {
    setDeleteConfirmDish(dish);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteConfirmDish) {
      await deleteMutation.mutateAsync(deleteConfirmDish.dish_id);
      setDeleteConfirmDish(null);
    }
  }, [deleteConfirmDish, deleteMutation]);

  return (
    <div className="h-[100dvh] bg-black p-0.5 sm:p-1">
      <div className='bg-white w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden'>
        <SearchHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className='relative px-4 sm:px-6 md:px-12 lg:px-24 xl:px-[22rem]'>
          <Lenis
            className='px-2 sm:px-4 md:px-8 flex gap-4 sm:gap-6 md:gap-8 will-change-scroll h-[calc(100dvh-280px)] sm:h-[calc(100dvh-270px)] md:h-[calc(100dvh-310px)] overflow-y-auto
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-thumb]:bg-zinc-300
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:opacity-0
              hover:[&::-webkit-scrollbar-thumb]:opacity-100
              [&::-webkit-scrollbar-thumb]:transition-opacity'
          >
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 will-change-contents pb-4'>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <DishCardSkeleton key={i} />
                ))
              ) : filteredDishes.length === 0 ? (
                <div className='col-span-full text-center py-12'>
                  <p className='text-zinc-400 text-lg'>Блюда не найдены</p>
                </div>
              ) : (
                filteredDishes.map((dish) => (
                  <DishCard
                    key={dish.dish_id}
                    dish={dish}
                    onEdit={() => handleEdit(dish)}
                    onDelete={() => handleDeleteClick(dish)}
                  />
                ))
              )}
            </div>
          </Lenis>
        </div>

        {/* Floating Action Button */}
        <motion.button
          onClick={() => handleEdit()}
          className='fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl z-50'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <FaPlus className='w-6 h-6' />
        </motion.button>

        {/* Edit/Create Modal */}
        <Modal
          dialogStyle='max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-4xl rounded-t-2xl sm:rounded-t-[3rem] pt-6 sm:pt-8 px-4 sm:px-6 md:px-8 h-[90dvh] sm:h-[85dvh] mx-auto'
          title={editingDish ? 'Редактировать блюдо' : 'Создать блюдо'}
          description=''
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        >
          <DishForm dish={editingDish} onSubmitStart={handleSubmitStart} />
        </Modal>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirmDish} onOpenChange={() => setDeleteConfirmDish(null)}>
          <AlertDialogContent className='!rounded-3xl'>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить блюдо?</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите удалить блюдо "{deleteConfirmDish?.dish_name}"?
                Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className='bg-red-500 hover:bg-red-600'
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}