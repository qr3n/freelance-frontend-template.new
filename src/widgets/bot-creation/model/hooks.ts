/**
 * Хуки для работы с формой создания бота
 */

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { botCreationFormAtom } from './storage';
import type { BotCreationStepData } from './types';

export const useBotCreationForm = () => {
  const [formData, setFormData] = useAtom(botCreationFormAtom);

  const updateFormData = useCallback((data: BotCreationStepData) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, [setFormData]);

  const resetFormData = useCallback(() => {
    setFormData({
      token: '',
      templateId: '',
      businessName: 'Мой бот',
      businessAddress: '',
      businessDescription: '',
    });
  }, [setFormData]);

  return {
    formData,
    updateFormData,
    resetFormData,
  };
};