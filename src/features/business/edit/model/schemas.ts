import { z } from 'zod';
import { BusinessType } from '@/features/business/create/model/types';

export const businessUpdateSchema = z.object({
  name: z
    .string()
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(255, 'Название не должно превышать 255 символов')
    .optional(),
  description: z
    .string()
    .min(10, 'Описание должно содержать минимум 10 символов')
    .max(2000, 'Описание не должно превышать 2000 символов')
    .optional(),
  business_type: z.nativeEnum(BusinessType).optional(),
  telegram_bot_token: z
    .string()
    .min(10, 'Токен Telegram бота обязателен')
    .optional(),
  is_active: z.boolean().optional(),
});

export type BusinessUpdateFormData = z.infer<typeof businessUpdateSchema>;
