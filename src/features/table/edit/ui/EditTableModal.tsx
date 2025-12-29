'use client';

import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/shadcn/ui/button';
import { Input } from '@/shared/shadcn/ui/input';
import { Label } from '@/shared/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadcn/ui/select';
import { Switch } from '@/shared/shadcn/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/shadcn/ui/alert-dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tableUpdateSchema, TableUpdateForm } from '../../model/schemas';
import { useUpdateTable, useDeleteTable } from '../../model/hooks';
import { Table, TableStatus } from '@/entities/table';
import { useState, useEffect } from 'react';

interface EditTableModalProps {
  businessId: string;
  table: Table;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditTableModal = ({ businessId, table, open, onOpenChange }: EditTableModalProps) => {
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateTable();
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteTable();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<TableUpdateForm>({
    resolver: zodResolver(tableUpdateSchema),
    defaultValues: {
      table_number: table.table_number,
      capacity: table.capacity,
      status: table.status,
      is_active: table.is_active,
      floor: table.floor,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        table_number: table.table_number,
        capacity: table.capacity,
        status: table.status,
        is_active: table.is_active,
        floor: table.floor,
      });
    }
  }, [open, table, reset]);

  const onSubmit = async (data: TableUpdateForm) => {
    updateMutate(
      {
        businessId,
        tableId: table.id,
        data,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMutate(
      { businessId, tableId: table.id },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Редактировать столик #${table.table_number}`}
      description="Измените информацию о столике"
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

        <div className="space-y-2">
          <Label htmlFor="status">Статус</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TableStatus.AVAILABLE}>Свободен</SelectItem>
                  <SelectItem value={TableStatus.BOOKED}>Забронирован</SelectItem>
                  <SelectItem value={TableStatus.OCCUPIED}>Занят</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between py-2">
          <Label htmlFor="is_active">Активен</Label>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Switch
                id="is_active"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Отмена
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
              >
                Удалить
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить. Столик #{table.table_number} будет удален навсегда.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Удаление...' : 'Удалить'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            type="submit"
            loading={isUpdating}
            className="flex-1 bg-emerald-950 hover:bg-emerald-900"
          >
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  );
};
