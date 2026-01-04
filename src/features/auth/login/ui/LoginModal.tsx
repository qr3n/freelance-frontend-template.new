// features/authentication/login/ui/LoginModal.tsx
'use client';

import { FC, ReactElement, useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/shared/ui/modal';
import { useSendCode, useVerifyCode } from '@/entities/auth/model/hooks';
import { SendCodeForm } from '@/features/auth/send-code/ui/SendCodeForm';
import { VerifyCodeForm } from '@/features/auth/verify-code/ui/VerifyCodeForm';
import ImageToVideo from '@/shared/ui/image-to-video/ui/ImageToVideo';
import { AnimatedStar } from '@/shared/ui/animated-star/ui/AnimatedStar';
import { SvgSkeleton } from '@/shared/ui/svg-skeleton/SvgSkeleton';

interface LoginModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  trigger?: ReactElement
}

type Step = 'send-code' | 'verify-code';

export const LoginModal: FC<LoginModalProps> = ({
                                                  open,
                                                  onOpenChange,
                                                  onSuccess,
  trigger
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
      if (onOpenChange) {
        onOpenChange(false);
      }
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
    } catch (_) {
      toast.error('Не удалось отправить код');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep('send-code');
      setContact('');
    }
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };
  const yourSvg = `
    <svg width="1057" height="1110" viewBox="0 0 1057 1110" xmlns="http://www.w3.org/2000/svg">
      <path d="M728.084 111.493C617.793 61.2244 477.767 85.6827 349.591 127.284C221.66 169.027 105.333 227.771 76.9286 315.202C48.5242 402.634 108.042 518.753 136.617 649.383C165.192 780.013 163.211 925.051 234.843 998.947C306.423 1072.65 451.564 1075.02 545.624 1015.19C639.439 955.221 774.562 876.34 774.562 725.292C774.562 603.292 907.654 511.617 913.195 399.213C918.737 286.808 838.375 161.761 728.084 111.493Z" fill="#c5d9ca"/>
      <path d="M728.084 111.493C617.793 61.2244 477.767 85.6827 349.591 127.284C221.66 169.027 105.333 227.771 76.9286 315.202C48.5242 402.634 108.042 518.753 136.617 649.383C165.192 780.013 163.211 925.051 234.843 998.947C306.423 1072.65 451.564 1075.02 545.624 1015.19C639.439 955.221 774.562 876.34 774.562 725.292C774.562 603.292 907.654 511.617 913.195 399.213C918.737 286.808 838.375 161.761 728.084 111.493Z" fill="black" fill-opacity="0.2"/>
    </svg>
  `

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={''}
      description={''}
      dialogStyle="max-w-[920px] z-[50000]"
      modalStyle={'z-[50000]'}
      trigger={trigger}
    >
      <div className='flex relative'>
        <div className="hidden md:flex w-0 sm:w-[50%] flex-col items-center justify-center">
          <svg className={'absolute w-[450px] h-[450px]'} width="1057" height="1110" viewBox="0 0 1057 1110" xmlns="http://www.w3.org/2000/svg">
            <path d="M728.084 111.493C617.793 61.2244 477.767 85.6827 349.591 127.284C221.66 169.027 105.333 227.771 76.9286 315.202C48.5242 402.634 108.042 518.753 136.617 649.383C165.192 780.013 163.211 925.051 234.843 998.947C306.423 1072.65 451.564 1075.02 545.624 1015.19C639.439 955.221 774.562 876.34 774.562 725.292C774.562 603.292 907.654 511.617 913.195 399.213C918.737 286.808 838.375 161.761 728.084 111.493Z" fill="#c5d9ca"/>
            <path d="M728.084 111.493C617.793 61.2244 477.767 85.6827 349.591 127.284C221.66 169.027 105.333 227.771 76.9286 315.202C48.5242 402.634 108.042 518.753 136.617 649.383C165.192 780.013 163.211 925.051 234.843 998.947C306.423 1072.65 451.564 1075.02 545.624 1015.19C639.439 955.221 774.562 876.34 774.562 725.292C774.562 603.292 907.654 511.617 913.195 399.213C918.737 286.808 838.375 161.761 728.084 111.493Z" fill="black" fillOpacity="0.2"/>
          </svg>
          <ImageToVideo
            loadingElement={
              <SvgSkeleton
                svg={yourSvg}
                isLoading={true}
                variant={'light'}
                color="#c5d9ca"
                size={450}
              />
            }
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