import { BusinessType } from '@/features/business/create/model/types';

export interface BusinessUpdateData {
  name?: string;
  description?: string;
  business_type?: BusinessType;
  telegram_bot_token?: string;
  is_active?: boolean;
}
