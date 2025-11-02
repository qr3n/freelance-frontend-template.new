'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Label } from '@/shared/shadcn/ui/label';
import { Switch } from '@/shared/shadcn/ui/switch';
import { Button } from '@/shared/shadcn/ui/button';
import { Input } from '@/shared/shadcn/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/shared/shadcn/ui/textarea';
import { Modal } from '@/shared/ui/modal';
import toast from 'react-hot-toast';
import ImageToVideo from '@/shared/ui/image-to-video/ui/ImageToVideo';
import { TextBackgroundSvg } from '@/shared/ui/svg/ui/TextBackgroundSvg';
import { MdSettings } from "react-icons/md";
import { DashboardNavigation } from '@/widgets/dashboard-navigation';

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

const dishSchema = z.object({
  restaurant_id: z.string().min(1, 'Обязательное поле'),
  restaurant_name: z.string().min(1, 'Обязательное поле'),
  dish_name: z.string().min(1, 'Обязательное поле'),
  alt_names: z.string().optional(),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  weight_g: z.number().min(0).optional(),
  price: z.number().min(0, 'Цена должна быть положительной'),
  currency: z.string().default('RUB'),
  city: z.string().min(1, 'Обязательное поле'),
  available: z.boolean().default(true),
  category: z.string().min(1, 'Обязательное поле'),
  photo_url: z.string().url('Неверный формат URL').optional().or(z.literal('')),
  spicy_level: z.number().min(0).max(5).optional(),
  tags: z.string().optional(),
});

// ============= ENTITIES/DISH/API =============
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
];

const dishApi = {
  getAll: async (): Promise<Dish[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockDishes];
  },

  create: async (data: DishFormData): Promise<Dish> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newDish: Dish = {
      ...data,
      dish_id: `D${Date.now()}`,
      updated_at: new Date().toISOString().split('T')[0],
    };
    mockDishes.push(newDish);
    return newDish;
  },

  update: async (id: string, data: DishFormData): Promise<Dish> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
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
};

// ============= ENTITIES/DISH/MODEL =============
const useDishes = () => useQuery({
  queryKey: ['dishes'],
  queryFn: dishApi.getAll,
});

const useCreateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dishes'] }),
  });
};

const useUpdateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DishFormData }) => dishApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dishes'] }),
  });
};

// ============= FEATURES/DISH-FORM =============
interface DishFormProps {
  dish?: Dish;
  onSubmitStart: () => void;
}

const DishForm = memo<DishFormProps>(({ dish, onSubmitStart }) => {
  const createMutation = useCreateDish();
  const updateMutation = useUpdateDish();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<DishFormData>({
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
    },
  });

  const onSubmit = useCallback((data: DishFormData) => {
    onSubmitStart();

    const mutation = dish ? updateMutation : createMutation;
    const payload = dish ? { id: dish.dish_id, data } : data;
    const isEdit = !!dish;

    const promise = mutation.mutateAsync(payload);

    toast.promise(promise, {
      loading: isEdit ? 'Сохранение изменений...' : 'Создание блюда...',
      success: isEdit ? 'Блюдо успешно обновлено!' : 'Блюдо успешно создано!',
      error: (err) => `Ошибка: ${err.message || 'Что-то пошло не так'}`,
    });
  }, [dish, createMutation, updateMutation, onSubmitStart]);

  const available = watch('available');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Название блюда *</Label>
          <Input {...register('dish_name')} />
          {errors.dish_name && <p className="text-sm text-red-500">{errors.dish_name.message}</p>}
        </div>

        <div>
          <Label>Категория *</Label>
          <Input {...register('category')} />
          {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
        </div>
      </div>

      <div>
        <Label>Описание</Label>
        <Textarea {...register('description')} rows={3} />
      </div>

      <div>
        <Label>Ингредиенты</Label>
        <Textarea {...register('ingredients')} rows={2} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Вес (г)</Label>
          <Input type="number" {...register('weight_g', { valueAsNumber: true })} />
        </div>

        <div>
          <Label>Цена *</Label>
          <Input type="number" {...register('price', { valueAsNumber: true })} />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <Label>Острота (0-5)</Label>
          <Input type="number" min="0" max="5" {...register('spicy_level', { valueAsNumber: true })} />
        </div>
      </div>

      <div>
        <Label>URL фото</Label>
        <Input {...register('photo_url')} placeholder="https://..." />
        {errors.photo_url && <p className="text-sm text-red-500">{errors.photo_url.message}</p>}
      </div>

      <div>
        <Label>Теги</Label>
        <Input {...register('tags')} placeholder="вегетарианское, острое" />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={available}
          onCheckedChange={(checked) => setValue('available', checked)}
        />
        <Label>Доступно для заказа</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={handleSubmit(onSubmit)}>
          {dish ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </div>
  );
});

// ============= ENTITIES/DISH/UI =============
interface DishCardProps {
  dish: Dish;
  onEdit: (dish: Dish) => void;
}

const DishCard = memo<DishCardProps>(({ dish, onEdit }) => (
  <>

  </>
));


// ============= PAGE =============
export default function MenuPage() {
  const { data: dishes = [], isLoading } = useDishes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | undefined>();

  const categories = useMemo(() => {
    const cats = new Set(dishes.map(d => d.category));
    return ['all', ...Array.from(cats)];
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      const matchesSearch = dish.dish_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [dishes, searchQuery, selectedCategory]);

  const handleEdit = useCallback((dish: Dish) => {
    setEditingDish(dish);
    setIsModalOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingDish(undefined);
    setIsModalOpen(true);
  }, []);

  const handleSubmitStart = useCallback(() => {
    setIsModalOpen(false);
    setEditingDish(undefined);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className='text-center flex flex-col items-center gap-4 justify-center pt-32'>
        <ImageToVideo
          imageSrc="/robot.png"
          videoSrc="/robot4.mp4"
          maskSrc={'/mask2.svg'}
          width={300}
          height={300}
        />
        <h1 className='text-white text-5xl mt-8 font-bold'>
          <span className='relative'>
                      <TextBackgroundSvg className='-mt-2 ml-4 scale-[120%] rotate-[2deg]'/>
                      <span className='z-10 relative text-emerald-900'>Меню пока нет</span>
          </span>
        </h1>
        <Button size={'lg'} className='bg-emerald-950 text-xl mt-6 h-[52px]'>
          <span>
            <MdSettings  className='!w-8 !h-8 -ml-3 mr-1  bg-emerald-500/40 fill-emerald-500 p-1 rounded-full'/>
          </span>
          Настроить меню</Button>
      </div>
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">
        <Modal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={editingDish ? 'Редактировать блюдо' : 'Создать новое блюдо'}
          description={editingDish ? 'Измените данные блюда' : 'Заполните информацию о новом блюде'}
        >
          <DishForm dish={editingDish} onSubmitStart={handleSubmitStart} />
        </Modal>
      </div>
    </div>
  );
}