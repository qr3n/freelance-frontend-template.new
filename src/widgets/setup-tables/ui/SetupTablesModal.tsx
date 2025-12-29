'use client';

import { Modal } from '@/shared/ui/modal';
import { useState } from 'react';
import { Button } from '@/shared/shadcn/ui/button';
import { Input } from '@/shared/shadcn/ui/input';
import { Label } from '@/shared/shadcn/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface BulkTablesData {
  total_tables: number;
  default_capacity: number;
  default_floor: number;
}

interface BulkTablesResponse {
  created: number;
  updated: number;
  deleted: number;
  total: number;
  tables: any[];
}

const bulkUpdateTables = async (
  businessId: string,
  data: BulkTablesData
): Promise<BulkTablesResponse> => {
  const response = await fetch(`https://aidronik.com/api/v1/businesses/${businessId}/tables/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update tables');
  }

  return response.json();
};

interface SetupTablesModalProps {
  businessId: string;
  onSuccess?: () => void;
}

export const SetupTablesModal = ({ businessId, onSuccess }: SetupTablesModalProps) => {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState<BulkTablesData>({
    total_tables: 10,
    default_capacity: 4,
    default_floor: 1,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: BulkTablesData) => bulkUpdateTables(businessId, data),
    onSuccess: (data) => {
      toast.success(
        `Столы настроены! Создано: ${data.created}, обновлено: ${data.updated}, удалено: ${data.deleted}`
      );
      queryClient.invalidateQueries({ queryKey: ['tables', businessId] });
      setOpen(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Не удалось настроить столы');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (formData.total_tables < 1 || formData.total_tables > 100) {
      toast.error('Количество столов должно быть от 1 до 100');
      return;
    }

    if (formData.default_capacity < 1 || formData.default_capacity > 20) {
      toast.error('Вместимость должна быть от 1 до 20');
      return;
    }

    mutation.mutate(formData);
  };

  const handleInputChange = (field: keyof BulkTablesData, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <Modal
      open={open}
      dialogStyle={'max-w-2xl'}
      title="Давайте настроим столы"
      description="Это необходимо, чтобы пользователи могли бронировать заказы"
      onOpenChange={setOpen}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {/* Total Tables */}
          <div className="space-y-3">
            <Label htmlFor="total_tables" className="text-lg font-semibold">
              Количество столов
              <span className="text-base text-muted-foreground ml-2 font-normal">(1-100)</span>
            </Label>
            <Input
              id="total_tables"
              type="number"
              min={1}
              max={100}
              value={formData.total_tables}
              onChange={(e) => handleInputChange('total_tables', e.target.value)}
              placeholder="Введите количество столов"
              disabled={mutation.isPending}
              className="h-12  bg-forest-100 hover:bg-forest-200 "
            />
            <p className="text-sm text-muted-foreground">
              Столы будут пронумерованы автоматически
            </p>
          </div>

          {/* Default Capacity */}
          <div className="space-y-3">
            <Label htmlFor="default_capacity" className="text-lg font-semibold">
              Вместимость по умолчанию
              <span className="text-base text-muted-foreground ml-2 font-normal">(1-20 мест)</span>
            </Label>
            <Input
              id="default_capacity"
              type="number"
              min={1}
              max={20}
              value={formData.default_capacity}
              onChange={(e) => handleInputChange('default_capacity', e.target.value)}
              placeholder="Количество мест за столом"
              disabled={mutation.isPending}
              className="h-12  bg-forest-100 hover:bg-forest-200"
            />
            <p className="text-sm text-muted-foreground">
              Вы сможете изменить вместимость для каждого стола отдельно
            </p>
          </div>

          {/* Default Floor */}
          <div className="space-y-3">
            <Label htmlFor="default_floor" className="text-lg font-semibold">
              Этаж по умолчанию
              <span className="text-base text-muted-foreground ml-2 font-normal">(можно использовать отрицательные значения)</span>
            </Label>
            <Input
              id="default_floor"
              type="number"
              value={formData.default_floor}
              onChange={(e) => handleInputChange('default_floor', e.target.value)}
              placeholder="Номер этажа"
              disabled={mutation.isPending}
              className="h-12 bg-forest-100 hover:bg-forest-200"
            />
            <p className="text-sm text-muted-foreground">
              Например: 1, 2, 3 или -1 для подвала
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
            className="h-11 px-6 text-base"
          >
            Отмена
          </Button>
          <Button type="submit" disabled={mutation.isPending} className="h-11 px-6 text-base">
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Настройка...
              </>
            ) : (
              'Создать столы'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};