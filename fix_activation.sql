-- Run this in your Supabase SQL Editor to fix existing stuck payment and activate Shield Pro

-- Step 1: Upgrade your account to Shield Pro
UPDATE public.users 
SET 
  plan = 'shield', 
  plan_started_at = now(), 
  plan_expires_at = now() + interval '30 days'
WHERE id = (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1);

-- Step 2: Mark any pending payments as paid
UPDATE public.payments 
SET 
  status = 'paid',
  razorpay_payment_id = COALESCE(razorpay_payment_id, 'manual_activation')
WHERE status = 'pending';
