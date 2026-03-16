-- ============================================================
-- Supabase Setup Script for Lab Forms
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Sequences for auto-incrementing Record IDs ──
CREATE SEQUENCE IF NOT EXISTS mor_seq START 1;
CREATE SEQUENCE IF NOT EXISTS rsr_seq START 1;
CREATE SEQUENCE IF NOT EXISTS eql_aut_seq START 1;
CREATE SEQUENCE IF NOT EXISTS eql_inc_seq START 1;
CREATE SEQUENCE IF NOT EXISTS eql_ref_seq START 1;
CREATE SEQUENCE IF NOT EXISTS eql_bsc_seq START 1;
CREATE SEQUENCE IF NOT EXISTS eql_wtb_seq START 1;
CREATE SEQUENCE IF NOT EXISTS eql_col_seq START 1;
CREATE SEQUENCE IF NOT EXISTS eql_bal_seq START 1;
CREATE SEQUENCE IF NOT EXISTS eql_mic_seq START 1;

-- ── Function: Generate formatted Record ID ──
CREATE OR REPLACE FUNCTION next_record_id(prefix TEXT, seq_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_val BIGINT;
BEGIN
  EXECUTE format('SELECT nextval(%L)', seq_name) INTO next_val;
  RETURN prefix || '-' || LPAD(next_val::TEXT, 4, '0');
END;
$$;

-- ── Table: Media Opening Records ──
CREATE TABLE IF NOT EXISTS mor_records (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  record_id TEXT UNIQUE NOT NULL,
  media_name TEXT,
  qc_disposition TEXT,
  analyst_name TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Table: Reference Strain Records ──
CREATE TABLE IF NOT EXISTS rsr_records (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  record_id TEXT UNIQUE NOT NULL,
  organism_name TEXT,
  qc_disposition TEXT,
  analyst_name TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Table: Equipment Logs (all 8 types) ──
CREATE TABLE IF NOT EXISTS equipment_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  record_id TEXT UNIQUE NOT NULL,
  equipment_type TEXT NOT NULL,
  overall_status TEXT,
  analyst_name TEXT,
  record_date DATE,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Create indexes for common queries ──
CREATE INDEX IF NOT EXISTS idx_mor_created ON mor_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsr_created ON rsr_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_eql_created ON equipment_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_eql_type ON equipment_logs(equipment_type);

-- ── Row Level Security: Allow public access via anon key ──
-- (matches current Google Apps Script behavior — anyone can CRUD)
ALTER TABLE mor_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on mor" ON mor_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on rsr" ON rsr_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on eql" ON equipment_logs FOR ALL USING (true) WITH CHECK (true);

-- ── Done! ──
-- You should now see 3 tables in the Table Editor:
--   mor_records, rsr_records, equipment_logs
