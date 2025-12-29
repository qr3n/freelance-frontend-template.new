/**
 * Jotai store для данных формы создания бота
 */

import { atom } from 'jotai';
import type { BotCreationFormData } from './types';

export const botCreationFormAtom = atom<Partial<BotCreationFormData>>({
  token: '',
  templateId: '',
  businessName: 'Мой бот',
  businessAddress: '',
  businessDescription: '',
});