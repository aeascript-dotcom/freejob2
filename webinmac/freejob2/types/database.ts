// Database types for Freejob application

export type UserRole = 'client' | 'freelancer' | 'admin';
export type AvailabilityStatus = 'available' | 'busy';
export type QuotationStatus = 'open' | 'closed';
export type DealStatus = 'active' | 'completed';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  bio_short: string | null;
  bio_long: string | null;
  province: string;
  workStyles: string[];
  skills_tags: string[];
  availability_status: AvailabilityStatus;
  is_duplicate_flag: boolean;
  stats_completed_jobs: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Quotation {
  id: string;
  client_id: string;
  freelancer_ids: string[];
  job_description: string;
  status: QuotationStatus;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  quotation_id: string | null;
  client_id: string;
  freelancer_id: string;
  status: DealStatus;
  current_scope: string | null;
  scope_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatLog {
  id: string;
  deal_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}
