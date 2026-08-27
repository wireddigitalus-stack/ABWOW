-- ==============================================================================
-- ABWOW Paving - Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. LEADS TABLE (Contact Forms, Estimator Leads, Chatbot Leads)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT,
    service TEXT,
    message TEXT,
    source TEXT DEFAULT 'contact', -- 'contact', 'estimator', 'chatbot'
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'quoted', 'won', 'lost'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. JOBS / WORK ORDERS TABLE (Full Costing, Materials, Labor, Equipment)
CREATE TABLE IF NOT EXISTS public.jobs (
    id TEXT PRIMARY KEY,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE SET NULL,
    job_number TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    job_address TEXT NOT NULL,
    service_type TEXT NOT NULL,
    contract_price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'in-progress', 'completed', 'invoiced', 'paid'
    start_date DATE,
    target_completion_date DATE,
    materials JSONB DEFAULT '[]'::jsonb NOT NULL,
    labor JSONB DEFAULT '[]'::jsonb NOT NULL,
    equipment JSONB DEFAULT '[]'::jsonb NOT NULL,
    checklist JSONB DEFAULT '{"sitePrepDone": false, "baseCompacted": false, "tackApplied": false, "asphaltRolled": false, "edgesTamped": false, "cleanupComplete": false}'::jsonb NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ESTIMATES TABLE (Instant Ballpark Quotes)
CREATE TABLE IF NOT EXISTS public.estimates (
    id TEXT PRIMARY KEY,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT,
    job_type TEXT NOT NULL,
    area NUMERIC(10, 2) NOT NULL,
    area_unit TEXT DEFAULT 'sq ft',
    service_type TEXT NOT NULL,
    estimated_cost TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'reviewed', 'quoted', 'accepted', 'declined'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CHAT LOGS TABLE (Customer Conversations with AI Assistant)
CREATE TABLE IF NOT EXISTS public.chat_logs (
    id TEXT PRIMARY KEY,
    lead_name TEXT,
    lead_email TEXT,
    lead_phone TEXT,
    messages JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR FAST SEARCH & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_estimates_created_at ON public.estimates (created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allows public submissions for leads, estimates, and chats,
-- and allows read/write for the admin dashboard.
-- ==============================================================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

-- Public insert policies (so visitors can submit forms, estimates, chat logs)
CREATE POLICY "Allow public insert to leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to estimates" ON public.estimates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to chat_logs" ON public.chat_logs FOR INSERT WITH CHECK (true);

-- Admin read/write policies (using anon key for client-side admin portal)
CREATE POLICY "Allow all access to leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to jobs" ON public.jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to estimates" ON public.estimates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to chat_logs" ON public.chat_logs FOR ALL USING (true) WITH CHECK (true);
