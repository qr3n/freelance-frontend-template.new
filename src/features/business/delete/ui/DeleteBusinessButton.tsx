'use client';

import { Button } from '@/shared/shadcn/ui/button';
import { Modal } from '@/shared/ui/modal';
import { useDeleteBusiness } from '../model/hooks';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/config';

interface DeleteBusinessButtonProps {
  businessId: string;
}

export const DeleteBusinessButton = ({ businessId }: DeleteBusinessButtonProps) => {
  const { mutate, isPending } = useDeleteBusiness(businessId);
  const router = useRouter();

  const handleDelete = () => {
    mutate(undefined, {
      onSuccess: () => {
        router.push(ROUTES.DASHBOARD);
      },
    });
  };

  return (
    <Modal
      trigger={
        <Button variant="destructive" size="sm">
          Удалить
        </Button>
      }
      title="Удалить бизнес"
      description="Вы уверены, что хотите удалить этот бизнес? Это действие необратимо."
    >
      <div className="flex gap-3 justify-end mt-4">
        <Button variant="outline" disabled={isPending}>
          Отмена
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          isLoading={isPending}
        >
          Удалить
        </Button>
      </div>
    </Modal>
  );
};
