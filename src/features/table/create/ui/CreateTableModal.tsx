'use client';

import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/shadcn/ui/button';
import { Input } from '@/shared/shadcn/ui/input';
import { Label } from '@/shared/shadcn/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tableCreateSchema, TableCreateForm } from '../../model/schemas';
import { useCreateTable } from '../../model/hooks';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';

interface CreateTableModalProps {
  businessId: string;
}

export const CreateTableModal = ({ businessId }: CreateTableModalProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateTable();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TableCreateForm>({
    resolver: zodResolver(tableCreateSchema),
    defaultValues: {
      table_number: 1,
      capacity: 4,
      floor: 1,
    },
  });

  const onSubmit = async (data: TableCreateForm) => {
    mutate(
      {
        business_id: businessId,
        table_number: data.table_number,
        capacity: data.capacity,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button className="bg-emerald-950 hover:bg-emerald-900 text-white rounded-full px-6 py-2 font-semibold flex items-center gap-2">
          <MdAdd size={20} className='fill-white' color={'white'}/>
          Добавить столик
        </Button>
      }
      title="Создать новый столик"
      description="Заполните информацию о новом столике"
    >
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
            type="button"
            variant="ghost"
            onClick={() => {
              setOpen(false);
              reset();
            }}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            isLoading={isPending}
            className="flex-1 bg-emerald-950 hover:bg-emerald-900"
          >
            Создать
          </Button>
        </div>
      </form>
    </Modal>
  );
};
