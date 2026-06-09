-- Fix: cambiar columna status de ENUM a TEXT con CHECK constraint correcto
ALTER TABLE public.cases 
  ALTER COLUMN status TYPE TEXT 
  USING status::TEXT;

ALTER TABLE public.cases
  DROP CONSTRAINT IF EXISTS cases_status_check;

ALTER TABLE public.cases
  ADD CONSTRAINT cases_status_check 
  CHECK (status IN (
    'pending_partner',
    'questionnaires', 
    'negotiation',
    'signing',
    'completed'
  ));

ALTER TABLE public.cases
  ALTER COLUMN status SET DEFAULT 'pending_partner';
