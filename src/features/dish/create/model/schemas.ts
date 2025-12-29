import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const dishCreateSchema = z.object({
  business_id: z.string().min(1, 'Business is required'),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number (e.g., 100 or 100.50)'),
  image: z
    .instanceof(File, { message: 'Image is required' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must not exceed 5MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Accepted formats: JPG, JPEG, PNG, WEBP'
    )
    .nullable(),
  is_available: z.boolean(),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must not exceed 50 characters')
    .optional()
    .nullable(),
  cuisine: z
    .string()
    .min(1, 'Cuisine type is required')
    .max(50, 'Cuisine must not exceed 50 characters')
    .optional()
    .nullable(),
  tags: z
    .array(z.string())
    .default([])
    .optional(),
  ingredients: z
    .array(z.string())
    .default([])
    .optional(),
  allergens: z
    .array(z.string())
    .default([])
    .optional(),
});

export type DishCreateFormData = z.infer<typeof dishCreateSchema>;

// Common options for dropdowns
export const CATEGORY_OPTIONS = [
  { value: 'appetizer', label: 'Закуски' },
  { value: 'soup', label: 'Супы' },
  { value: 'salad', label: 'Салаты' },
  { value: 'main', label: 'Основные блюда' },
  { value: 'side', label: 'Гарниры' },
  { value: 'dessert', label: 'Десерты' },
  { value: 'beverage', label: 'Напитки' },
  { value: 'other', label: 'Другое' },
];

export const CUISINE_OPTIONS = [
  { value: 'russian', label: 'Русская' },
  { value: 'italian', label: 'Итальянская' },
  { value: 'asian', label: 'Азиатская' },
  { value: 'american', label: 'Американская' },
  { value: 'french', label: 'Французская' },
  { value: 'mexican', label: 'Мексиканская' },
  { value: 'japanese', label: 'Японская' },
  { value: 'chinese', label: 'Китайская' },
  { value: 'georgian', label: 'Грузинская' },
  { value: 'uzbek', label: 'Узбекская' },
  { value: 'mediterranean', label: 'Средиземноморская' },
  { value: 'fusion', label: 'Фьюжн' },
  { value: 'other', label: 'Другая' },
];

export const COMMON_ALLERGENS = [
  'Глютен',
  'Молоко',
  'Яйца',
  'Рыба',
  'Орехи',
  'Арахис',
  'Соя',
  'Морепродукты',
  'Кунжут',
  'Горчица',
  'Сельдерей',
  'Люпин',
];