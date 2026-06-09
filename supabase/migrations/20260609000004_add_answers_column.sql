-- Add answers JSONB column to questionnaire_basic table for flexible storage of questionnaire responses.
ALTER TABLE public.questionnaire_basic 
ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}'::jsonb;
