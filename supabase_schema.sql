-- =========================================================================
-- WORLD FITNESS ZONE - PRODUCTION SUPABASE DATABASE SCHEMA
-- Run this SQL in your Supabase Project Dashboard -> SQL Editor -> Click RUN
-- Project URL: https://khkiyplybehsspxtmvkf.supabase.co
-- =========================================================================

-- 1. CLIENTS TABLE (Stores client profiles, private PINs, assigned program & customized macros)
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    pin_code TEXT NOT NULL UNIQUE,
    program TEXT DEFAULT '13-Week Transformation & 30-Day Meal Plan',
    current_week INTEGER DEFAULT 1,
    calories INTEGER DEFAULT 2450,
    protein TEXT DEFAULT '190g',
    carbs TEXT DEFAULT '220g',
    fats TEXT DEFAULT '55g',
    water TEXT DEFAULT '3.5L',
    coach TEXT DEFAULT 'Head Coach James (London)',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RESOURCES & DIET PROTOCOLS TABLE (Stores 7-Day Matrix meal plans, previous versions, videos & guides)
CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    client_name TEXT,
    client_pin TEXT,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'meal_plan',
    type TEXT DEFAULT 'meal_plan',
    format TEXT DEFAULT 'text', -- 'text', 'video', 'image'
    status TEXT DEFAULT 'active', -- 'active', 'archived', 'published'
    version INTEGER DEFAULT 1,
    change_notes TEXT,
    content_text TEXT,
    content_url TEXT,
    layout_type TEXT DEFAULT 'layout_a',
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ
);

-- 3. CLIENT MESSAGES TABLE (Real-time 2-way chat between Client & Coach James)
CREATE TABLE IF NOT EXISTS public.client_messages (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    client_name TEXT,
    client_pin TEXT,
    sender TEXT NOT NULL, -- 'client' or 'coach'
    sender_name TEXT,
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'Delivered'
);

-- 4. FASTED WEIGH-INS TABLE (Sunday morning weight check-ins logged by clients)
CREATE TABLE IF NOT EXISTS public.weigh_ins (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    client_name TEXT,
    client_pin TEXT,
    weight NUMERIC NOT NULL,
    notes TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & ALLOW PUBLIC ACCESS POLICIES
-- This allows the client portal and admin panel to read & write with the anon key
-- =========================================================================

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weigh_ins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid duplication
DROP POLICY IF EXISTS "Public Full Access Clients" ON public.clients;
DROP POLICY IF EXISTS "Public Full Access Resources" ON public.resources;
DROP POLICY IF EXISTS "Public Full Access Messages" ON public.client_messages;
DROP POLICY IF EXISTS "Public Full Access WeighIns" ON public.weigh_ins;

CREATE POLICY "Public Full Access Clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Resources" ON public.resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Messages" ON public.client_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access WeighIns" ON public.weigh_ins FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- SEED FOUNDATIONAL CLIENTS (Zain & Marcus T.)
-- =========================================================================

INSERT INTO public.clients (id, name, pin_code, program, current_week, calories, protein, carbs, fats, water)
VALUES 
  ('client-zain-1', 'Zain', '78601', '13-Week Transformation (Week 1 Active)', 1, 2350, '185g', '210g', '55g', '3.5L'),
  ('demo-client-1', 'Marcus T.', '12345', '13-Week Transformation & 30-Day Meal Plan', 4, 2450, '190g', '220g', '55g', '3.5L')
ON CONFLICT (pin_code) DO NOTHING;

-- SEED ZAIN'S INITIAL 7-DAY MEAL PROTOCOL
INSERT INTO public.resources (
    id, client_id, client_name, client_pin, title, category, type, format, status, version, change_notes, content_text
) VALUES (
    'res-zain-week1',
    'client-zain-1',
    'Zain',
    '78601',
    'Week 1 Plan — 7-Day Precision Meal Protocol',
    'meal_plan',
    'meal_plan',
    'text',
    'active',
    1,
    'Week 1 Precision Split: Timed carbohydrates around workouts with high protein recovery.',
    'Coach James Custom Directives
Week 1 Plan — 7-Day Precision Meal Protocol
Assigned to: Zain • Updated: 12/09/2026
Daily Targets: 2,350 kcal | 185g Protein | 210g Carbs | 55g Fats

7:30 AM — Breakfast
Mon: 2 eggs + 1 roti + tea
Tue: Oats + banana + milk
Wed: 2 eggs + 1–2 slices whole-wheat bread
Thu: 1 paratha + 2 eggs
Fri: Oats + apple
Sat: 2 eggs + 1 roti + tea
Sun: Omelette + 2 slices bread

10:30 AM — Snack
1 fruit + handful of almonds/peanuts

1:30–2:00 PM — Lunch
Mon: Chicken + 1–2 roti + salad
Tue: Daal + 1–2 roti + salad
Wed: Chicken rice + raita
Thu: Beef/chicken + 1–2 roti + vegetables
Fri: Daal + rice + salad
Sat: Chicken + roti + vegetables
Sun: Biryani/pulao + raita (moderate portion)

5:00 PM — Snack
Fruit / yogurt / handful of nuts

8:00–8:30 PM — Dinner
Mon: Chicken + vegetables
Tue: 2 eggs + roti + salad
Wed: Chicken + 1 roti + salad
Thu: Daal + roti + vegetables
Fri: Chicken/fish + salad
Sat: Chicken + roti
Sun: Light dinner — eggs/chicken + salad

10:30 PM — Optional
Milk or plain yogurt if you''re hungry.'
) ON CONFLICT (id) DO NOTHING;
