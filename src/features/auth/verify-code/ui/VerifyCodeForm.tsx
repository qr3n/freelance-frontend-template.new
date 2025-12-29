// features/authentication/verify-code/ui/VerifyCodeForm.tsx
'use client';

import { FC, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/shadcn/ui/button';
import { Label } from '@/shared/shadcn/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/shared/shadcn/ui/input-otp';
import { verifyCodeSchema, type VerifyCodeFormData } from '@/entities/auth/model/schemas';
import { maskContact } from '@/entities/auth/lib/utils';

interface VerifyCodeFormProps {
  contact: string;
  onSuccess: (code: string) => void;
  onError?: (error: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  isResending?: boolean;
}

export const VerifyCodeForm: FC<VerifyCodeFormProps> = ({
                                                          contact,
                                                          onSuccess,
                                                          onError,
                                                          onResend,
                                                          isLoading = false,
                                                          isResending = false,
                                                        }) => {
  const {
    control,
    handleSubmit,
    watch,
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      contact,
      code: '',
    },
  });

  const code = watch('code');

  useEffect(() => {
    if (code.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [code]);

  const onSubmit = async (data: VerifyCodeFormData) => {
    try {
      onSuccess(data.code);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Произошла ошибка');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code" className='text-emerald-900/70'>
          Код отправлен на {maskContact(contact)}
        </Label>

        <div className="flex justify-center py-4">
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                disabled={isLoading}
                autoFocus
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      className='bg-emerald-600/25 hover:bg-emerald-600/30'
                      index={index}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-[48px] text-lg"
        disabled={isLoading}
      >
        {isLoading ? 'Проверка...' : 'Подтвердить'}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full font-medium h-[48px]"
        onClick={onResend}
        disabled={isResending}
      >
        {isResending ? 'Отправка...' : 'Отправить код повторно'}
      </Button>
    </form>
  );
};