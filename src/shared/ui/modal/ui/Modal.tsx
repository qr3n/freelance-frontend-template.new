'use client';

import { FC, PropsWithChildren, ReactElement, useCallback, useState } from 'react';
import {
  Dialog, DialogClose,
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
        <TitleComponent className="flex gap-2 items-center">{props.title}</TitleComponent>
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
 */
export const Modal: FC<IProps> = (props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const onOpenChange = props.onOpenChange
  const open = props.open ?? internalOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(newOpen);
      } else {
        setInternalOpen(newOpen);
      }
    },
    [onOpenChange]
  );

  const Wrapper = isDesktop ? Dialog : Drawer;
  const Trigger = isDesktop ? DialogTrigger : DrawerTrigger;
  const Content = isDesktop ? DialogContent : DrawerContent;

  return (
    <Wrapper open={open} onOpenChange={handleOpenChange}>
      {props.trigger && <Trigger asChild>{props.trigger}</Trigger>}
      <Content className={cn(isDesktop ? 'max-w-[425px]' : '', isDesktop ? props.dialogStyle : props.modalStyle)}>
        <ModalContent title={props.title} description={props.description} isDesktop={isDesktop}>
          {props.children}
        </ModalContent>
      </Content>
    </Wrapper>
  );
};

export const ModalClose: FC<PropsWithChildren> = (props) => {
  return (
    <DialogClose asChild>
      {props.children}
    </DialogClose>
  )
}