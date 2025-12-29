/**
 * Типы для формы создания бота
 */

export interface BotCreationFormData {
  token: string;
  templateId: string;
  businessName: string;
  businessAddress: string;
  businessDescription: string;
}

export interface BotCreationStepData {
  token?: string;
  templateId?: string;
  businessName?: string;
  businessAddress?: string;
}