-- ============================================================
-- FormaPro — Schéma complet Supabase
-- À exécuter dans l'éditeur SQL Supabase (Dashboard → SQL Editor)
-- ============================================================

-- PROFILES (liée à auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id               uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name        text,
  specialty        text,
  bio              text,
  avatar_url       text,
  score            numeric DEFAULT 0,
  plan             text DEFAULT 'starter',
  daily_rate       numeric,
  experience_years int,
  location_city    text,
  location_country text DEFAULT 'France',
  radius_km        int DEFAULT 80,
  onboarding_done  bool DEFAULT false,
  created_at       timestamptz DEFAULT now()
);

-- ADN PÉDAGOGIQUE (1-to-1 avec profiles)
CREATE TABLE IF NOT EXISTS pedagogy_dna (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id       uuid REFERENCES profiles ON DELETE CASCADE UNIQUE,
  animation_styles text[] DEFAULT '{}',
  posture          text,
  rhythm           text,
  tools            text[] DEFAULT '{}',
  tone             text,
  updated_at       timestamptz DEFAULT now()
);

-- COMPÉTENCES
CREATE TABLE IF NOT EXISTS skills (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  name       text,
  category   text -- 'domain' | 'skill' | 'public' | 'format'
);

-- EXPÉRIENCES
CREATE TABLE IF NOT EXISTS experiences (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id      uuid REFERENCES profiles ON DELETE CASCADE,
  title           text,
  organization    text,
  period_start    date,
  period_end      date,
  description     text,
  trainees_count  int
);

-- DISPONIBILITÉS
CREATE TABLE IF NOT EXISTS availabilities (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id     uuid REFERENCES profiles ON DELETE CASCADE,
  days_of_week   int[] DEFAULT '{}',
  available_from date,
  formats        text[] DEFAULT '{}'
);

-- FORMATIONS (contenu IA en JSONB)
CREATE TABLE IF NOT EXISTS formations (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id    uuid REFERENCES profiles ON DELETE CASCADE,
  title         text NOT NULL,
  subject       text,
  audience      text,
  level         text,
  duration_days int,
  format        text,
  content       jsonb DEFAULT '{}',
  qa_score      int,
  status        text DEFAULT 'draft',
  created_at    timestamptz DEFAULT now()
);

-- DEVIS
CREATE TABLE IF NOT EXISTS quotes (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id       uuid REFERENCES profiles ON DELETE CASCADE,
  reference        text,
  client_name      text,
  formation_title  text,
  days_count       int,
  amount_ht        numeric,
  status           text DEFAULT 'draft',
  valid_until      date,
  sent_at          timestamptz,
  created_at       timestamptz DEFAULT now()
);

-- FACTURES
CREATE TABLE IF NOT EXISTS invoices (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id   uuid REFERENCES profiles ON DELETE CASCADE,
  quote_id     uuid REFERENCES quotes,
  reference    text,
  client_name  text,
  amount_ht    numeric,
  tva_rate     numeric DEFAULT 0,
  status       text DEFAULT 'draft',
  due_date     date,
  paid_at      timestamptz,
  created_at   timestamptz DEFAULT now()
);

-- ÉLÈVES
CREATE TABLE IF NOT EXISTS students (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id   uuid REFERENCES profiles ON DELETE CASCADE,
  formation_id uuid REFERENCES formations,
  full_name    text,
  email        text,
  company      text,
  progress_pct int DEFAULT 0,
  certified_at timestamptz
);

-- AVIS
CREATE TABLE IF NOT EXISTS reviews (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id    uuid REFERENCES profiles ON DELETE CASCADE,
  formation_id  uuid REFERENCES formations,
  reviewer_name text,
  reviewer_type text, -- 'student' | 'center'
  rating        numeric,
  comment       text,
  verified      bool DEFAULT false,
  created_at    timestamptz DEFAULT now()
);

-- MISSIONS
CREATE TABLE IF NOT EXISTS missions (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title           text NOT NULL,
  required_skills text[] DEFAULT '{}',
  format          text,
  days_count      int,
  daily_rate      numeric,
  location        text,
  deadline        date,
  status          text DEFAULT 'open',
  created_at      timestamptz DEFAULT now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-création profil à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Recalcul score formateur à chaque nouvel avis
CREATE OR REPLACE FUNCTION update_profile_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET score = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM reviews
    WHERE profile_id = NEW.profile_id
  )
  WHERE id = NEW.profile_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_created ON reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_profile_score();

-- ============================================================
-- RLS — Row Level Security
-- ============================================================

ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedagogy_dna   ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills         ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences    ENABLE ROW LEVEL SECURITY;
ALTER TABLE availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices       ENABLE ROW LEVEL SECURITY;
ALTER TABLE students       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;

-- Supprimer les policies existantes avant de les recréer
DROP POLICY IF EXISTS "own" ON profiles;
DROP POLICY IF EXISTS "own" ON pedagogy_dna;
DROP POLICY IF EXISTS "own" ON skills;
DROP POLICY IF EXISTS "own" ON experiences;
DROP POLICY IF EXISTS "own" ON availabilities;
DROP POLICY IF EXISTS "own" ON formations;
DROP POLICY IF EXISTS "own" ON quotes;
DROP POLICY IF EXISTS "own" ON invoices;
DROP POLICY IF EXISTS "own" ON students;
DROP POLICY IF EXISTS "own" ON reviews;

-- Chaque formateur voit et modifie uniquement ses données
CREATE POLICY "own" ON profiles       FOR ALL USING (auth.uid() = id);
CREATE POLICY "own" ON pedagogy_dna   FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own" ON skills         FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own" ON experiences    FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own" ON availabilities FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own" ON formations     FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own" ON quotes         FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own" ON invoices       FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own" ON students       FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own" ON reviews        FOR ALL USING (auth.uid() = profile_id);

-- Missions : lecture publique (matching), écriture admin uniquement
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "missions_read" ON missions;
CREATE POLICY "missions_read" ON missions FOR SELECT USING (true);
