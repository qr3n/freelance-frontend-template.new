'use client';

import { Button } from '@/shared/shadcn/ui/button';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/config';

export const CreateBusinessButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push(ROUTES.DASHBOARD_CREATE);
  };

  return (
    <Button
      onClick={handleClick}
      className="bg-forest-200 text-forest-800 hover:bg-forest-300 z-50"
    >
      Создать бизнес
    </Button>
  );
};
