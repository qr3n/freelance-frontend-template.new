import { z } from 'zod';

export const tableCreateSchema = z.object({
  table_number: z.number().int().positive('Номер столика должен быть положительным'),
  capacity: z.number().int().positive('Вместимость должна быть положительной'),
  floor: z.number().int().default(1),
});

export const tableUpdateSchema = z.object({
  table_number: z.number().int().positive('Номер столика должен быть положительным').optional(),
  capacity: z.number().int().positive('Вместимость должна быть положительной').optional(),
  status: z.enum(['available', 'booked', 'occupied']).optional(),
  is_active: z.boolean().optional(),
  floor: z.number().int().optional(),
});

export type TableCreateForm = z.infer<typeof tableCreateSchema>;
export type TableUpdateForm = z.infer<typeof tableUpdateSchema>;
