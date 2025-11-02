'use client';

import { FC, PropsWithChildren, ReactElement, useCallback, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/shadcn/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/shadcn/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/shadcn/ui/alert-dialog';
import { cn } from '@/shared/shadcn/lib/utils';
import { useMediaQuery } from '@/shared/hooks';

interface IProps extends PropsWithChildren {
  trigger?: ReactElement;
  title: string | ReactElement | ReactElement[];
  description: string | ReactElement | ReactElement[];
  dialogStyle?: string;
  modalStyle?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  confirmOnClose?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmActionText?: string;
  confirmCancelText?: string;
}

/**
 * Компонент содержимого модального окна.
 * @param props.title - Заголовок модального окна.
 * @param props.description - Описание модального окна.
 * @param props.children - Дочерние элементы внутри модального окна.
 * @param props.isDesktop - Флаг, указывающий на использование десктопной версии.
 */
const ModalContent: FC<Pick<IProps, 'title' | 'description' | 'children'> & { isDesktop: boolean }> = (props) => {
  const TitleComponent = props.isDesktop ? DialogTitle : DrawerTitle;
  const DescriptionComponent = props.isDesktop ? DialogDescription : DrawerDescription;
  const HeaderComponent = props.isDesktop ? DialogHeader : DrawerHeader;

  return (
    <div className="relative">
      <HeaderComponent>
        <TitleComponent className="flex gap-2 items-center text-white">{props.title}</TitleComponent>
        <DescriptionComponent>{props.description}</DescriptionComponent>
      </HeaderComponent>
      <div className={'pt-0 px-4 md:pt-4 md:px-0'}>{props.children}</div>
    </div>
  );
};

/**
 * Универсальный модальный компонент, адаптирующийся под размер экрана.
 * Использует `Dialog` для десктопа и `Drawer` для мобильных устройств.
 * @param props.open - Управляемое состояние открытия модального окна.
 * @param props.onOpenChange - Коллбэк при изменении состояния открытия.
 * @param props.trigger - Элемент, который вызывает модальное окно.
 * @param props.title - Заголовок модального окна.
 * @param props.description - Описание модального окна.
 * @param props.children - Контент внутри модального окна.
 * @param props.dialogStyle - Дополнительные стили для контейнера диалога.
 * @param props.modalStyle - Дополнительные стили для контейнера модального окна.
 * @param props.confirmOnClose - Включает диалог подтверждения при закрытии модального окна.
 * @param props.confirmTitle - Заголовок диалога подтверждения закрытия.
 * @param props.confirmDescription - Описание в диалоге подтверждения закрытия.
 * @param props.confirmActionText - Текст кнопки подтверждения закрытия.
 * @param props.confirmCancelText - Текст кнопки отмены закрытия.
 */
export const Modal: FC<IProps> = (props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const onOpenChange = props.onOpenChange;
  const open = props.open ?? internalOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      // Если закрываем и нужно подтверждение
      if (!newOpen && props.confirmOnClose && open) {
        setShowConfirm(true);
        return;
      }

      if (onOpenChange) {
        onOpenChange(newOpen);
      } else {
        setInternalOpen(newOpen);
      }
    },
    [onOpenChange, props.confirmOnClose, open]
  );

  const handleConfirmClose = useCallback(() => {
    setShowConfirm(false);
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setInternalOpen(false);
    }
  }, [onOpenChange]);

  const handleCancelClose = useCallback(() => {
    setShowConfirm(false);
  }, []);

  const Wrapper = Drawer;
  const Trigger = DrawerTrigger;
  const Content = DrawerContent;

  return (
    <>
      <Wrapper open={open} onOpenChange={handleOpenChange}>
        {props.trigger && <Trigger asChild>{props.trigger}</Trigger>}
        <Content className={cn(isDesktop ? 'max-w-[425px] will-change-transform transform-gpu' : 'will-change-transform transform-gpu', isDesktop ? props.dialogStyle : props.modalStyle)}>
          <ModalContent title={props.title} description={props.description} isDesktop={isDesktop}>
            {props.children}
          </ModalContent>
        </Content>
      </Wrapper>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className='will-change-transform transform-gpu max-w-[85dvw] sm:max-w-[400px] !rounded-3xl'>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {props.confirmTitle || 'Вы уверены?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {props.confirmDescription || 'Вы точно хотите закрыть это окно? Несохраненные изменения будут потеряны.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>
              {props.confirmCancelText || 'Отмена'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              {props.confirmActionText || 'Закрыть'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const ModalClose: FC<PropsWithChildren> = (props) => {
  return <DialogClose asChild>{props.children}</DialogClose>;
};