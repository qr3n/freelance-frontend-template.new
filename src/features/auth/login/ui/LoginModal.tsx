// features/authentication/login/ui/LoginModal.tsx
'use client';

import { FC, useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/shared/ui/modal';
import { useSendCode, useVerifyCode } from '@/entities/auth/model/hooks';
import { SendCodeForm } from '@/features/auth/send-code/ui/SendCodeForm';
import { VerifyCodeForm } from '@/features/auth/verify-code/ui/VerifyCodeForm';
import ImageToVideo from '@/shared/ui/image-to-video/ui/ImageToVideo';
import { AnimatedStar } from '@/shared/ui/animated-star/ui/AnimatedStar';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type Step = 'send-code' | 'verify-code';

export const LoginModal: FC<LoginModalProps> = ({
                                                  open,
                                                  onOpenChange,
                                                  onSuccess,
                                                }) => {
  const [step, setStep] = useState<Step>('send-code');
  const [contact, setContact] = useState<string>('');

  const sendCodeMutation = useSendCode();
  const verifyCodeMutation = useVerifyCode();

  const handleSendCode = async (formattedContact: string) => {
    try {
      await sendCodeMutation.mutateAsync({ contact: formattedContact });
      setContact(formattedContact);
      setStep('verify-code');
      toast.success('Код отправлен!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Не удалось отправить код'
      );
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      await verifyCodeMutation.mutateAsync({ contact, code });
      toast.success('Вход выполнен успешно!');
      onOpenChange(false);
      onSuccess?.();

      setStep('send-code');
      setContact('');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Неверный код'
      );
    }
  };

  const handleResendCode = async () => {
    try {
      await sendCodeMutation.mutateAsync({ contact });
      toast.success('Код отправлен повторно!');
    } catch (error) {
      toast.error('Не удалось отправить код');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep('send-code');
      setContact('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={''}
      description={''}
      dialogStyle="max-w-[920px]"
    >
      <div className='flex relative'>
        <div className="hidden sm:flex w-0 sm:w-[50%] flex-col items-center justify-center">
          <ImageToVideo
            imageSrc="/robot.png"
            videos={[{ src: "/robot5.mp4" }, { src: "/robot6.mp4" }]}
            maskSrc={"/mask.svg"}
            width={450}
            height={450}
            step={step === 'send-code' ? 1 : 2}
            transitionDuration={0}
          />
        </div>

        <AnimatedStar className={'hidden sm:block'} verticalPosition={'bottom'} horizontalPosition={'320px'} size={120}/>
        <AnimatedStar className={'hidden sm:block'}/>

        <div className='w-full sm:w-[50%] sm:pr-12 flex flex-col items-center justify-center'>
          <div className='w-full'>
            <motion.h1
              className='text-3xl mt-16 sm:mt-8 justify-center sm:justify-start mb-4  flex gap-3 font-semibold items-center'
              layout
            >
              Авторизация
            </motion.h1>

            <motion.div
              layout
              className='relative overflow-hidden'
              style={{ minHeight: '280px' }}
            >
              <AnimatePresence mode='wait' initial={false}>
                {step === 'send-code' && (
                  <motion.div
                    key="send-code"
                    initial={{ x: -300, scale: 0.4, opacity: 0 }}
                    animate={{ x: 0, scale: 1, opacity: 1 }}
                    exit={{ x: 300, scale: 0.4, opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    <SendCodeForm
                      onSuccess={handleSendCode}
                      isLoading={sendCodeMutation.isPending}
                    />
                  </motion.div>
                )}

                {step === 'verify-code' && (
                  <motion.div
                    key="verify-code"
                    initial={{ x: -300, scale: 0.4, opacity: 0 }}
                    animate={{ x: 0, scale: 1, opacity: 1 }}
                    exit={{ x: 300, scale: 0.4, opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    <VerifyCodeForm
                      contact={contact}
                      onSuccess={handleVerifyCode}
                      onResend={handleResendCode}
                      isLoading={verifyCodeMutation.isPending}
                      isResending={sendCodeMutation.isPending}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </Modal>
  );
};