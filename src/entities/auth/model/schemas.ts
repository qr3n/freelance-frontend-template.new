// entities/auth/model/schemas.ts
import { z } from 'zod';

const emailSchema = z.string().email('Неверный формат email');

const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Неверный формат телефона');

export const sendCodeSchema = z.object({
  contact: z
    .string()
    .min(1, 'Введите email или номер телефона')
    .refine(
      (value) => {
        if (value.includes('@')) {
          return emailSchema.safeParse(value).success;
        }
        const cleaned = value.replace(/[\s\-\(\)]/g, '');
        return phoneSchema.safeParse(cleaned).success;
      },
      {
        message: 'Введите корректный email или номер телефона',
      }
    ),
});

export const verifyCodeSchema = z.object({
  contact: z.string().min(1, 'Контакт обязателен'),
  code: z
    .string()
    .length(6, 'Код должен содержать 6 цифр')
    .regex(/^\d{6}$/, 'Код должен содержать только цифры'),
});

export type SendCodeFormData = z.infer<typeof sendCodeSchema>;
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;