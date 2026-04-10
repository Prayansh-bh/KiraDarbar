-- Create custom types/enums (Safe check)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('tenant', 'paralegal', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_type') THEN
        CREATE TYPE public.plan_type AS ENUM ('free', 'shield');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'case_type') THEN
        CREATE TYPE public.case_type AS ENUM ('legal_notice', 'agreement_review', 'deposit_recovery', 'rights_check');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'case_status') THEN
        CREATE TYPE public.case_status AS ENUM ('submitted', 'under_review', 'in_progress', 'resolved', 'closed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_product') THEN
        CREATE TYPE public.payment_product AS ENUM ('legal_notice', 'agreement_review', 'shield_monthly', 'shield_annual');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notice_delivery') THEN
        CREATE TYPE public.notice_delivery AS ENUM ('email', 'registered_post', 'both');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notice_status') THEN
        CREATE TYPE public.notice_status AS ENUM ('draft', 'approved', 'sent', 'delivered');
    END IF;
END $$;

-- Create tables (IF NOT EXISTS)
-- USERS
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name text,
  phone text,
  city text,
  state text,
  role public.user_role DEFAULT 'tenant'::public.user_role,
  plan public.plan_type DEFAULT 'free'::public.plan_type,
  plan_started_at timestamptz,
  plan_expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- CASES
CREATE TABLE IF NOT EXISTS public.cases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  case_type public.case_type NOT NULL,
  status public.case_status DEFAULT 'submitted'::public.case_status,
  title text NOT NULL,
  description text,
  landlord_name text,
  landlord_phone text,
  landlord_address text,
  property_address text,
  amount_disputed numeric(12, 2),
  documents jsonb DEFAULT '[]'::jsonb,
  assigned_paralegal uuid REFERENCES public.users(id),
  notes text,
  outcome text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL,
  razorpay_order_id text NOT NULL,
  razorpay_payment_id text,
  amount numeric NOT NULL, -- in paise
  currency text DEFAULT 'INR',
  product public.payment_product NOT NULL,
  status public.payment_status DEFAULT 'pending'::public.payment_status,
  created_at timestamptz DEFAULT now()
);

-- DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  file_type text,
  uploaded_at timestamptz DEFAULT now()
);

-- NOTICES
CREATE TABLE IF NOT EXISTS public.notices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  drafted_by uuid REFERENCES public.users(id),
  content_md text,
  sent_at timestamptz,
  delivery_method public.notice_delivery,
  status public.notice_status DEFAULT 'draft'::public.notice_status,
  created_at timestamptz DEFAULT now()
);

-- TENANT RIGHTS (CMS)
CREATE TABLE IF NOT EXISTS public.tenant_rights (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  state text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  legal_reference text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_rights ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (Safe Creation)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own cases') THEN
        CREATE POLICY "Users can view own cases" ON public.cases FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create own cases') THEN
        CREATE POLICY "Users can create own cases" ON public.cases FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own cases') THEN
        CREATE POLICY "Users can update own cases" ON public.cases FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own payments') THEN
        CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own payments') THEN
        CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own documents') THEN
        CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload own documents') THEN
        CREATE POLICY "Users can upload own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own notices') THEN
        CREATE POLICY "Users can view own notices" ON public.notices FOR SELECT 
        USING (EXISTS (SELECT 1 FROM public.cases WHERE id = notices.case_id AND user_id = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Tenant rights are publicly readable') THEN
        CREATE POLICY "Tenant rights are publicly readable" ON public.tenant_rights FOR SELECT USING (is_active = true);
    END IF;
END $$;

-- Admin / Paralegal policies would go here (omitted for brevity but noted)

-- STORAGE BUCKETS (SQL snippets for Supabase Dashboard or API)
/*
  INSERT INTO storage.buckets (id, name, public) VALUES ('case-documents', 'case-documents', false);
  INSERT INTO storage.buckets (id, name, public) VALUES ('notice-pdfs', 'notice-pdfs', false);
  INSERT INTO storage.buckets (id, name, public) VALUES ('public-assets', 'public-assets', true);
*/
