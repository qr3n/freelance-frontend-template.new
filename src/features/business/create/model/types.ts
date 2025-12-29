// features/business/create/model/types.ts
export enum BusinessType {
  RESTAURANT = 'restaurant',
  PARKING = 'parking',
  RETAIL = 'retail',
  SERVICE = 'service',
  OTHER = 'other',
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  business_type: BusinessType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessCreateData {
  name: string;
  description: string;
  business_type: BusinessType;
  telegram_bot_token: string;
}