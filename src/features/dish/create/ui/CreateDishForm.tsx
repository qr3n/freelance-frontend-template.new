// features/dish/create/ui/CreateDishForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef } from 'react';
import { X, Upload, ImagePlus, ArrowRight, ArrowLeft, Check, Plus } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from '@/shared/shadcn/ui/input';
import { Textarea } from '@/shared/shadcn/ui/textarea';
import { Button } from '@/shared/shadcn/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/shadcn/ui/select';
import { Badge } from '@/shared/shadcn/ui/badge';

import {
  dishCreateSchema,
  type DishCreateFormData,
  CATEGORY_OPTIONS,
  CUISINE_OPTIONS,
  COMMON_ALLERGENS,
} from '../model/schemas';
import { useCreateDish } from '../model/hooks';

interface CreateDishFormProps {
  businessId: string;
  onSuccess?: () => void;
}

type FormStep = 1 | 2 | 3 | 4;

export function CreateDishForm({ businessId, onSuccess }: CreateDishFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createDish, isPending } = useCreateDish();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<DishCreateFormData>({
    resolver: zodResolver(dishCreateSchema),
    defaultValues: {
      business_id: businessId,
      title: '',
      description: '',
      price: '',
      image: null,
      is_available: true,
      category: null,
      cuisine: null,
      tags: [],
      ingredients: [],
      allergens: [],
    },
  });

  const watchedFields = watch();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setValue('image', file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setValue('image', null, { shouldValidate: true });
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !watchedFields.tags?.includes(tagInput.trim())) {
      setValue('tags', [...(watchedFields.tags || []), tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setValue('tags', watchedFields.tags?.filter((t) => t !== tag) || []);
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !watchedFields.ingredients?.includes(ingredientInput.trim())) {
      setValue('ingredients', [...(watchedFields.ingredients || []), ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setValue('ingredients', watchedFields.ingredients?.filter((i) => i !== ingredient) || []);
  };

  const handleToggleAllergen = (allergen: string) => {
    const current = watchedFields.allergens || [];
    if (current.includes(allergen)) {
      setValue('allergens', current.filter((a) => a !== allergen));
    } else {
      setValue('allergens', [...current, allergen]);
    }
  };

  const handleNextStep = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger('image');
      if (isValid && previewUrl) {
        setCurrentStep(2);
      } else if (!previewUrl) {
        toast.error('Пожалуйста, загрузите фото блюда');
      }
    } else if (currentStep === 2) {
      isValid = await trigger(['title', 'description']);
      if (isValid) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      isValid = await trigger(['price', 'category', 'cuisine']);
      if (isValid) {
        setCurrentStep(4);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
    }
  };

  const onSubmit = handleSubmit((data: DishCreateFormData) => {
    if (!data.image) {
      toast.error('Please upload an image');
      return;
    }

    createDish(
      {
        business_id: businessId,
        title: data.title,
        description: data.description,
        price: data.price,
        image: data.image,
        is_available: data.is_available,
        category: data.category,
        cuisine: data.cuisine,
        tags: data.tags,
        ingredients: data.ingredients,
        allergens: data.allergens,
      },
      {
        onSuccess: () => {
          toast.success('Блюдо успешно создано!');
          reset({
            business_id: businessId,
            title: '',
            description: '',
            price: '',
            image: null,
            is_available: true,
            category: null,
            cuisine: null,
            tags: [],
            ingredients: [],
            allergens: [],
          });
          setPreviewUrl(null);
          setCurrentStep(1);
          setTagInput('');
          setIngredientInput('');
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(`Ошибка: ${error.message}`);
        },
      }
    );
  });

  const slideVariants = {
    enter: {
      x: -300,
      scale: 0.4,
      opacity: 0,
    },
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
    },
    exit: {
      x: 300,
      scale: 0.4,
      opacity: 0,
    },
  };

  const contentTransition = {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1],
  };

  return (
    <div className="w-full mx-auto">
      {/* Progress Bar */}
      <div className="mb-4 md:mb-6">
        {/* Circles and Lines */}
        <div className="relative flex items-center mb-2 md:mb-3">
          {[1, 2, 3, 4].map((step, index) => (
            <div key={step} className={`flex ${index < 3 ? 'flex-1' : ''} items-center ${index === 3 ? '' : 'justify-center'}`}>
              <motion.div
                initial={false}
                animate={{
                  scale: currentStep === step ? 1.15 : 1,
                  backgroundColor: currentStep >= step ? 'rgb(63, 63, 70)' : 'rgb(229, 231, 235)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-semibold text-white text-xs md:text-sm z-10"
              >
                {currentStep > step ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    <Check className="h-3 w-3 md:h-4 md:w-4" color={'white'}/>
                  </motion.div>
                ) : (
                  step
                )}
              </motion.div>
              {index < 3 && (
                <div className="flex-1 h-1 md:h-1.5 mx-2 md:mx-3 bg-zinc-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: currentStep > step ? '100%' : '0%' }}
                    transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                    className="h-full bg-zinc-700"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Labels */}
        <div className="flex items-center">
          <div className="flex-1 text-left">
            <span className="text-[10px] md:text-xs font-medium text-zinc-600">Фото</span>
          </div>
          <div className="flex-1 -ml-0 text-center">
            <span className="text-[10px] md:text-xs font-medium text-zinc-600">Описание</span>
          </div>
          <div className="flex-1 ml-24 text-center">
            <span className="text-[10px] md:text-xs font-medium text-zinc-600">Детали</span>
          </div>
          <div className="flex-1 text-right">
            <span className="text-[10px] md:text-xs font-medium text-zinc-600">Доп. инфо</span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden">
        <div className="h-[355px] md:h-[480px] relative">
          <AnimatePresence mode="wait" initial={false}>
            {/* Step 1: Image Upload */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={contentTransition}
                className="p-4 md:p-6 h-full overflow-y-auto flex flex-col"
              >
                <h2 className="text-lg md:text-xl font-semibold text-black mb-1">
                  Загрузите фото блюда
                </h2>
                <p className="text-xs md:text-sm text-zinc-500 mb-4 md:mb-6">
                  Красивое фото увеличит привлекательность блюда
                </p>

                <div className="flex-1 flex bg-zinc-50 rounded-2xl md:rounded-3xl items-center justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                    id="dish-image-input"
                  />

                  {previewUrl ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="relative w-64 h-48 md:w-96 md:h-72 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group"
                    >
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <Button
                        type="button"
                        onClick={handleRemoveImage}
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 md:top-3 md:right-3 h-7 w-7 md:h-8 md:w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                      >
                        <X className="h-4 w-4 md:h-5 md:w-5" color={'white'}/>
                      </Button>

                      <label
                        htmlFor="dish-image-input"
                        className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 bg-white hover:bg-zinc-50 text-black px-4 py-2 md:px-6 md:py-3 rounded-full cursor-pointer transition-all duration-200 flex items-center gap-2 opacity-0 group-hover:opacity-100 shadow-lg"
                      >
                        <Upload className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="font-semibold text-xs md:text-sm">Изменить</span>
                      </label>
                    </motion.div>
                  ) : (
                    <label
                      htmlFor="dish-image-input"
                      className="cursor-pointer group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="w-56 h-56 md:w-72 md:h-72 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center relative group-hover:border-zinc-400 transition-colors"
                      >
                        <motion.div
                          animate={{
                            y: [0, -8, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-zinc-300 rounded-full blur-2xl opacity-30" />
                          <div className="relative bg-zinc-200 rounded-2xl md:rounded-3xl p-6 md:p-8 group-hover:bg-zinc-300 transition-colors">
                            <ImagePlus className="h-12 w-12 md:h-16 md:w-16 text-zinc-600 group-hover:text-zinc-700 transition-colors" />
                          </div>
                        </motion.div>

                        <p className="mt-4 md:mt-6 text-black font-semibold text-base md:text-lg">
                          Загрузите фото
                        </p>
                        <p className="mt-1 md:mt-2 text-zinc-600 text-xs md:text-sm font-medium">
                          PNG, JPG, WEBP
                        </p>
                        <p className="text-zinc-500 text-[10px] md:text-xs mt-0.5 md:mt-1">
                          до 5MB
                        </p>
                      </motion.div>
                    </label>
                  )}
                </div>

                {errors.image && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs md:text-sm text-red-600 bg-red-50 px-3 py-2 md:px-4 md:py-3 rounded-xl md:rounded-2xl mt-3 md:mt-4 text-center font-medium"
                  >
                    {errors.image.message}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Step 2: Title & Description */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={contentTransition}
                className="p-4 md:p-6 h-full overflow-y-auto"
              >
                <h2 className="text-lg md:text-xl font-semibold text-black mb-1">
                  Расскажите о блюде
                </h2>
                <p className="text-xs md:text-sm text-zinc-500 mb-3 md:mb-4">
                  Название и описание помогут гостям сделать выбор
                </p>

                <div className="space-y-3 md:space-y-4">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="block text-xs md:text-sm font-semibold text-black">
                      Название блюда
                    </label>
                    <Input
                      {...register('title')}
                      placeholder="Например: Цезарь с курицей"
                      disabled={isPending}
                      className="h-10 md:h-12 px-3 md:px-4 bg-zinc-50 hover:bg-zinc-100 border-zinc-200 rounded-2xl md:rounded-3xl focus-visible:ring-zinc-500 focus-visible:ring-offset-0 focus-visible:border-zinc-500 transition-all text-sm md:text-base"
                    />
                    {errors.title && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                        <span className="text-[10px] md:text-xs">⚠️</span>
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <label className="block text-xs md:text-sm font-semibold text-black">
                      Описание
                    </label>
                    <Textarea
                      {...register('description')}
                      placeholder="Опишите состав, особенности приготовления или вкус..."
                      disabled={isPending}
                      className="min-h-[120px] md:min-h-[160px] px-3 py-2 md:px-4 md:py-3 bg-zinc-50 hover:bg-zinc-100 border-zinc-200 rounded-2xl md:rounded-3xl focus-visible:ring-zinc-500 focus-visible:ring-offset-0 focus-visible:border-zinc-500 resize-none transition-all text-sm md:text-base"
                    />
                    {errors.description && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                        <span className="text-[10px] md:text-xs">⚠️</span>
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Price, Category, Cuisine */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={contentTransition}
                className="p-4 md:p-6 h-full overflow-y-auto"
              >
                <h2 className="text-lg md:text-xl font-semibold text-black mb-1">
                  Детали блюда
                </h2>
                <p className="text-xs md:text-sm text-zinc-500 mb-3 md:mb-4">
                  Укажите цену, категорию и тип кухни
                </p>

                <div className="space-y-3 md:space-y-4">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="block text-xs md:text-sm font-semibold text-black">
                      Цена
                    </label>
                    <div className="relative">
                      <Input
                        {...register('price')}
                        placeholder="0"
                        type="text"
                        inputMode="decimal"
                        disabled={isPending}
                        className="h-12 md:h-14 px-4 pr-12 md:px-5 md:pr-14 bg-zinc-50 hover:bg-zinc-100 border-zinc-200 rounded-2xl md:rounded-3xl focus-visible:ring-zinc-500 focus-visible:ring-offset-0 focus-visible:border-zinc-500 transition-all text-lg md:text-xl font-semibold"
                      />
                      <span className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold text-lg md:text-xl">
                        ₽
                      </span>
                    </div>
                    {errors.price && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                        <span className="text-[10px] md:text-xs">⚠️</span>
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <label className="block text-xs md:text-sm font-semibold text-black">
                      Категория
                    </label>
                    <Select
                      value={watchedFields.category || ''}
                      onValueChange={(value) => setValue('category', value)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-10 md:h-12 bg-zinc-50 hover:bg-zinc-100 border-zinc-200 rounded-2xl md:rounded-3xl focus:ring-zinc-500 transition-all text-sm md:text-base">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                        <span className="text-[10px] md:text-xs">⚠️</span>
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <label className="block text-xs md:text-sm font-semibold text-black">
                      Кухня
                    </label>
                    <Select
                      value={watchedFields.cuisine || ''}
                      onValueChange={(value) => setValue('cuisine', value)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-10 md:h-12 bg-zinc-50 hover:bg-zinc-100 border-zinc-200 rounded-2xl md:rounded-3xl focus:ring-zinc-500 transition-all text-sm md:text-base">
                        <SelectValue placeholder="Выберите тип кухни" />
                      </SelectTrigger>
                      <SelectContent>
                        {CUISINE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.cuisine && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                        <span className="text-[10px] md:text-xs">⚠️</span>
                        {errors.cuisine.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Tags, Ingredients, Allergens */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={contentTransition}
                className="p-4 md:p-6 h-full overflow-y-auto"
              >
                <h2 className="text-lg md:text-xl font-semibold text-black mb-1">
                  Дополнительная информация
                </h2>
                <p className="text-xs md:text-sm text-zinc-500 mb-3 md:mb-4">
                  Теги, ингредиенты и аллергены (необязательно)
                </p>

                <div className="space-y-3 md:space-y-4">
                  {/* Tags */}
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="block text-xs md:text-sm font-semibold text-black">
                      Теги
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Добавьте тег"
                        disabled={isPending}
                        className="h-10 md:h-12 px-3 md:px-4 bg-zinc-50 hover:bg-zinc-100 border-zinc-200 rounded-2xl md:rounded-3xl text-sm md:text-base"
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        disabled={isPending || !tagInput.trim()}
                        size="icon"
                        className="h-10 bg-forest-50 hover:bg-forest-100 w-10 md:h-12 md:w-12 rounded-2xl md:rounded-3xl flex-shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {watchedFields.tags && watchedFields.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {watchedFields.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="pl-3 pr-1 py-1 text-xs md:text-sm rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:bg-zinc-300 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="block text-xs md:text-sm font-semibold text-black">
                      Основные ингредиенты
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddIngredient();
                          }
                        }}
                        placeholder="Добавьте ингредиент"
                        disabled={isPending}
                        className="h-10 md:h-12 px-3 md:px-4 bg-zinc-50 hover:bg-zinc-100 border-zinc-200 rounded-2xl md:rounded-3xl text-sm md:text-base"
                      />
                      <Button
                        type="button"
                        onClick={handleAddIngredient}
                        disabled={isPending || !ingredientInput.trim()}
                        size="icon"
                        className="h-10 bg-forest-50 hover:bg-forest-100 w-10 md:h-12 md:w-12 rounded-2xl md:rounded-3xl flex-shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {watchedFields.ingredients && watchedFields.ingredients.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {watchedFields.ingredients.map((ingredient) => (
                          <Badge
                            key={ingredient}
                            variant="secondary"
                            className="pl-3 pr-1 py-1 text-xs md:text-sm rounded-full"
                          >
                            {ingredient}
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredient(ingredient)}
                              className="ml-1 hover:bg-zinc-300 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Allergens */}
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="block text-xs md:text-sm font-semibold text-black">
                      Аллергены
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_ALLERGENS.map((allergen) => (
                        <Badge
                          key={allergen}
                          variant={watchedFields.allergens?.includes(allergen) ? 'default' : 'outline'}
                          className="cursor-pointer text-xs md:text-sm rounded-full px-3 py-1"
                          onClick={() => handleToggleAllergen(allergen)}
                        >
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="p-3 md:p-5">
          <div className="flex flex-col-reverse sm:flex-row gap-2 md:gap-3">
            {currentStep > 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isPending}
                  variant="outline"
                  className="h-10 md:h-12 w-full sm:w-auto px-4 md:px-5 text-sm md:text-base font-semibold transition-all rounded-2xl md:rounded-3xl"
                >
                  <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                  Назад
                </Button>
              </motion.div>
            )}

            {currentStep < 4 ? (
              <motion.div
                className="flex-1"
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isPending}
                  className="w-full h-10 md:h-12 text-white text-sm md:text-base transform duration-200 rounded-2xl md:rounded-3xl"
                >
                  Далее
                  <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 ml-2" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Button
                  type="button"
                  onClick={onSubmit}
                  isLoading={isPending}
                  className="w-full h-10 md:h-12 text-white text-sm md:text-base duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl md:rounded-3xl"
                >
                  Создать блюдо
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}