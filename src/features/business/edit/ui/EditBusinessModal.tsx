'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/shadcn/ui/button';
import { Input } from '@/shared/shadcn/ui/input';
import { Textarea } from '@/shared/shadcn/ui/textarea';
import { Label } from '@/shared/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadcn/ui/select';
import { useUpdateBusiness } from '../model/hooks';
import { businessUpdateSchema, type BusinessUpdateFormData } from '../model/schemas';
import { BusinessType } from '@/features/business/create/model/types';
import type { Business } from '@/entities/business/model/types';

interface EditBusinessModalProps {
  business: Business;
}

export const EditBusinessModal = ({ business }: EditBusinessModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useUpdateBusiness(business.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BusinessUpdateFormData>({
    resolver: zodResolver(businessUpdateSchema),
    defaultValues: {
      name: business.name,
      description: business.description,
      business_type: business.business_type as BusinessType,
      is_active: business.is_active,
    },
  });

  const businessType = watch('business_type');

  const onSubmit = (data: BusinessUpdateFormData) => {
    mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <Modal
      dialogStyle="max-w-2xl rounded-t-[48px]"
      title="Редактировать бизнес"
      description="Обновите информацию о вашем бизнесе"
      trigger={
        <Button variant="outline" size="sm">
          Редактировать
        </Button>
      }
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            placeholder="Название бизнеса"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            placeholder="Описание бизнеса"
            rows={4}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_type">Тип бизнеса</Label>
          <Select
            value={businessType}
            onValueChange={(value) => setValue('business_type', value as BusinessType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип бизнеса" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BusinessType.RESTAURANT}>Ресторан</SelectItem>
              <SelectItem value={BusinessType.PARKING}>Парковка</SelectItem>
              <SelectItem value={BusinessType.RETAIL}>Розничная торговля</SelectItem>
              <SelectItem value={BusinessType.SERVICE}>Услуги</SelectItem>
              <SelectItem value={BusinessType.OTHER}>Другое</SelectItem>
            </SelectContent>
          </Select>
          {errors.business_type && (
            <p className="text-sm text-red-500">{errors.business_type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegram_bot_token">Токен Telegram бота</Label>
          <Input
            id="telegram_bot_token"
            type="password"
            placeholder="Токен Telegram бота"
            {...register('telegram_bot_token')}
          />
          {errors.telegram_bot_token && (
            <p className="text-sm text-red-500">{errors.telegram_bot_token.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            {...register('is_active')}
            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
          />
          <Label htmlFor="is_active" className="cursor-pointer">
            Активен
          </Label>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Отмена
          </Button>
          <Button type="submit" loading={isPending} className="bg-emerald-950">
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  );
};
