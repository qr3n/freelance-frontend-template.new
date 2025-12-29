// features/dish/create/ui/CreateDishModal.tsx
'use client';

import { useState } from 'react';

import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/shadcn/ui/button';

import { CreateDishForm } from './CreateDishForm';

interface CreateDishModalProps {
  businessId: string;
}

export function CreateDishModal({ businessId }: CreateDishModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      dialogStyle="max-w-4xl  rounded-t-[48px]"
      title="Создать новое блюдо"
      description="Заполните информацию о блюде"
      trigger={<Button className="bg-emerald-950">Создать блюдо</Button>}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateDishForm businessId={businessId} onSuccess={handleSuccess} />
    </Modal>
  );
}