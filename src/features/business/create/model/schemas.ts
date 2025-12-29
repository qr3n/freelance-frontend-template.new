// features/business/create/model/schemas.ts
import { z } from 'zod';
import { BusinessType } from './types';

export const businessCreateSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(255, 'Name must not exceed 255 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  business_type: z.nativeEnum(BusinessType),
  telegram_bot_token: z
    .string()
    .min(10, 'Telegram dashboard token is required'),
});

export type BusinessCreateFormData = z.infer<typeof businessCreateSchema>;