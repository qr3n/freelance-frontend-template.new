'use client';

import { Input } from '@/shared/shadcn/ui/input';
import { Label } from '@/shared/shadcn/ui/label';
import { Button } from '@/shared/shadcn/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tableCreateSchema, TableCreateForm as TableCreateFormType } from '../../model/schemas';
import { useCreateTable } from '../../model/hooks';

interface CreateTableFormProps {
  businessId: string;
  onSuccess?: () => void;
}

export const CreateTableForm = ({ businessId, onSuccess }: CreateTableFormProps) => {
  const { mutate, isPending } = useCreateTable();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TableCreateFormType>({
    resolver: zodResolver(tableCreateSchema),
    defaultValues: {
      table_number: 1,
      capacity: 4,
      floor: 1,
    },
  });

  const onSubmit = async (data: TableCreateFormType) => {
    mutate(
      {
        business_id: businessId,
        table_number: data.table_number,
        capacity: data.capacity,
      },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="table_number">Номер столика</Label>
        <Input
          id="table_number"
          type="number"
          {...register('table_number', { valueAsNumber: true })}
          placeholder="1"
        />
        {errors.table_number && (
          <p className="text-sm text-red-500">{errors.table_number.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">Вместимость (человек)</Label>
        <Input
          id="capacity"
          type="number"
          {...register('capacity', { valueAsNumber: true })}
          placeholder="4"
        />
        {errors.capacity && (
          <p className="text-sm text-red-500">{errors.capacity.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="floor">Этаж</Label>
        <Input
          id="floor"
          type="number"
          {...register('floor', { valueAsNumber: true })}
          placeholder="1"
        />
        {errors.floor && (
          <p className="text-sm text-red-500">{errors.floor.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          loading={isPending}
          className="w-full bg-emerald-950 hover:bg-emerald-900"
        >
          Создать столик
        </Button>
      </div>
    </form>
  );
};
