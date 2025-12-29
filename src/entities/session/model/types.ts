export interface Session {
  id: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
  user_agent: string | null;
  ip_address: string | null;
}