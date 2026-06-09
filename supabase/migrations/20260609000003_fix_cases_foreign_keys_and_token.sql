-- 1. Add invite_token to cases table if it doesn't exist
ALTER TABLE public.cases 
  ADD COLUMN IF NOT EXISTS invite_token UUID UNIQUE DEFAULT gen_random_uuid();

-- 2. Populate any null invite_tokens with generated UUIDs
UPDATE public.cases 
SET invite_token = gen_random_uuid() 
WHERE invite_token IS NULL;

-- 3. Add foreign keys referencing profiles table
ALTER TABLE public.cases
  DROP CONSTRAINT IF EXISTS cases_user_a_id_fkey,
  DROP CONSTRAINT IF EXISTS cases_user_b_id_fkey;

ALTER TABLE public.cases
  ADD CONSTRAINT cases_user_a_id_fkey FOREIGN KEY (user_a_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT cases_user_b_id_fkey FOREIGN KEY (user_b_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
