// Types métier FormaPro — alignés sur le schéma Supabase
// Générés manuellement en attendant `supabase gen types typescript`

export interface Profile {
  id: string;
  full_name: string | null;
  specialty: string | null;
  bio: string | null;
  avatar_url: string | null;
  score: number;
  plan: string;
  daily_rate: number | null;
  experience_years: number | null;
  location_city: string | null;
  location_country: string;
  radius_km: number;
  onboarding_done: boolean;
  created_at: string;
}

export interface PedagogyDna {
  id: string;
  profile_id: string;
  animation_styles: string[];
  posture: string | null;
  rhythm: string | null;
  tools: string[];
  tone: string | null;
  updated_at: string;
}

export interface Skill {
  id: string;
  profile_id: string;
  name: string | null;
  category: string | null; // 'domain' | 'skill' | 'public' | 'format'
}

export interface Experience {
  id: string;
  profile_id: string;
  title: string | null;
  organization: string | null;
  period_start: string | null;
  period_end: string | null;
  description: string | null;
  trainees_count: number | null;
}

export interface Availability {
  id: string;
  profile_id: string;
  days_of_week: number[];
  available_from: string | null;
  formats: string[];
}

export interface Formation {
  id: string;
  profile_id: string;
  title: string;
  subject: string | null;
  audience: string | null;
  level: string | null;
  duration_days: number | null;
  format: string | null;
  content: Record<string, unknown>;
  qa_score: number | null;
  status: string;
  created_at: string;
}

export interface Quote {
  id: string;
  profile_id: string;
  reference: string | null;
  client_name: string | null;
  formation_title: string | null;
  days_count: number | null;
  amount_ht: number | null;
  status: string;
  valid_until: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  profile_id: string;
  quote_id: string | null;
  reference: string | null;
  client_name: string | null;
  amount_ht: number | null;
  tva_rate: number;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface Student {
  id: string;
  profile_id: string;
  formation_id: string | null;
  full_name: string | null;
  email: string | null;
  company: string | null;
  progress_pct: number;
  certified_at: string | null;
}

export interface Review {
  id: string;
  profile_id: string;
  formation_id: string | null;
  reviewer_name: string | null;
  reviewer_type: string | null; // 'student' | 'center'
  rating: number | null;
  comment: string | null;
  verified: boolean;
  created_at: string;
}

export interface Mission {
  id: string;
  title: string;
  required_skills: string[];
  format: string | null;
  days_count: number | null;
  daily_rate: number | null;
  location: string | null;
  deadline: string | null;
  status: string;
  created_at: string;
}

// Type générique pour Supabase (format attendu par @supabase/supabase-js)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      pedagogy_dna: {
        Row: PedagogyDna;
        Insert: Partial<PedagogyDna> & { profile_id: string };
        Update: Partial<PedagogyDna>;
      };
      skills: {
        Row: Skill;
        Insert: Partial<Skill> & { profile_id: string };
        Update: Partial<Skill>;
      };
      experiences: {
        Row: Experience;
        Insert: Partial<Experience> & { profile_id: string };
        Update: Partial<Experience>;
      };
      availabilities: {
        Row: Availability;
        Insert: Partial<Availability> & { profile_id: string };
        Update: Partial<Availability>;
      };
      formations: {
        Row: Formation;
        Insert: Partial<Formation> & { profile_id: string; title: string };
        Update: Partial<Formation>;
      };
      quotes: {
        Row: Quote;
        Insert: Partial<Quote> & { profile_id: string };
        Update: Partial<Quote>;
      };
      invoices: {
        Row: Invoice;
        Insert: Partial<Invoice> & { profile_id: string };
        Update: Partial<Invoice>;
      };
      students: {
        Row: Student;
        Insert: Partial<Student> & { profile_id: string };
        Update: Partial<Student>;
      };
      reviews: {
        Row: Review;
        Insert: Partial<Review> & { profile_id: string };
        Update: Partial<Review>;
      };
      missions: {
        Row: Mission;
        Insert: Partial<Mission> & { title: string };
        Update: Partial<Mission>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
