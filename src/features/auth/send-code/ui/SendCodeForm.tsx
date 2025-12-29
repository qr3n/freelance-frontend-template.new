// features/authentication/send-code/ui/SendCodeForm.tsx
'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/shadcn/ui/button';
import { Input } from '@/shared/shadcn/ui/input';
import { Label } from '@/shared/shadcn/ui/label';
import { sendCodeSchema, type SendCodeFormData } from '@/entities/auth/model/schemas';
import { formatContact } from '@/entities/auth/lib/utils';

interface SendCodeFormProps {
  onSuccess: (contact: string) => void;
  onError?: (error: string) => void;
  isLoading?: boolean;
}

export const SendCodeForm: FC<SendCodeFormProps> = ({
                                                      onSuccess,
                                                      onError,
                                                      isLoading = false,
                                                    }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendCodeFormData>({
    resolver: zodResolver(sendCodeSchema),
  });

  const onSubmit = async (data: SendCodeFormData) => {
    try {
      const formattedContact = formatContact(data.contact);
      onSuccess(formattedContact);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Произошла ошибка');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2 px-0.5">
        <Label htmlFor="contact" className={'text-emerald-800/70'}>
          Телефон или почта
        </Label>
        <Input
          className='h-[48px] pl-4 !placeholder-emerald-800/70 !text-lg'
          id="contact"
          type="text"
          placeholder="+79117629553"
          disabled={isLoading}
          {...register('contact')}
        />
        {errors.contact && (
          <p className="text-sm text-red-500">
            {errors.contact.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-[48px] text-lg"
        isLoading={isLoading}
      >
        {isLoading ? 'Отправка...' : 'Получить код'}
      </Button>
    </form>
  );
};