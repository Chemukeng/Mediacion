-- ============================================================
-- LIMPIEZA COMPLETA Y SCHEMA NUEVO — v3 (orden correcto)
-- ============================================================

-- 1. Eliminar políticas conflictivas
DROP POLICY IF EXISTS "Blind phase inventory select policy" ON public.inventory_items;
DROP POLICY IF EXISTS "Users can delete their own items in pending status" ON public.inventory_items;
DROP POLICY IF EXISTS "Users can update their own items in pending status" ON public.inventory_items;
DROP POLICY IF EXISTS "Users can insert their own inventory items" ON public.inventory_items;
DROP POLICY IF EXISTS "Insert own dynamic questions" ON public.dynamic_questions;
DROP POLICY IF EXISTS "Update own dynamic questions" ON public.dynamic_questions;
DROP POLICY IF EXISTS "View own dynamic questions" ON public.dynamic_questions;
DROP POLICY IF EXISTS "Insert own static questionnaire" ON public.static_questionnaires;
DROP POLICY IF EXISTS "View own static questionnaire" ON public.static_questionnaires;
DROP POLICY IF EXISTS "Update own static questionnaire" ON public.static_questionnaires;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view cases they are part of" ON public.cases;
DROP POLICY IF EXISTS "Users can update cases they are part of" ON public.cases;
DROP POLICY IF EXISTS "Users can create cases" ON public.cases;
DROP POLICY IF EXISTS "Users can view pending cases" ON public.cases;
DROP POLICY IF EXISTS "Users can join pending cases" ON public.cases;
DROP POLICY IF EXISTS "Users can insert agreements of their case" ON public.agreements;
DROP POLICY IF EXISTS "Users can view agreements of their case" ON public.agreements;
DROP POLICY IF EXISTS "Users can update agreements of their case" ON public.agreements;
DROP POLICY IF EXISTS "Solo partes del expediente pueden ver y editar" ON public.cases;
DROP POLICY IF EXISTS "Cualquier usuario autenticado puede crear expediente" ON public.cases;

-- 2. Eliminar tablas del prototipo viejo
DROP TABLE IF EXISTS public.inventory_items CASCADE;
DROP TABLE IF EXISTS public.dynamic_questions CASCADE;
DROP TABLE IF EXISTS public.static_questionnaires CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 3. Quitar constraint CHECK antiguo
ALTER TABLE public.cases DROP CONSTRAINT IF EXISTS cases_status_check;

-- 4. Cambiar tipo de ENUM a TEXT primero (sin CHECK constraint aún)
ALTER TABLE public.cases 
  ALTER COLUMN status TYPE TEXT 
  USING status::TEXT;

-- 5. Ahora sí actualizar valores inválidos (la columna ya es TEXT)
UPDATE public.cases 
SET status = 'pending_partner' 
WHERE status NOT IN ('pending_partner','questionnaires','negotiation','signing','completed');

-- 6. Añadir el CHECK constraint correcto
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

-- 7. Crear tablas nuevas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.questionnaire_basic (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id             UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES public.profiles(id),
  monthly_income      NUMERIC(10,2),
  has_children        BOOLEAN DEFAULT FALSE,
  children_details    TEXT,
  has_properties      BOOLEAN DEFAULT FALSE,
  properties_details  TEXT,
  has_debts           BOOLEAN DEFAULT FALSE,
  debts_details       TEXT,
  submitted_at        TIMESTAMPTZ,
  UNIQUE(case_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.questionnaire_dynamic (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id       UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id),
  question_text TEXT NOT NULL,
  answer_text   TEXT,
  order_index   INTEGER,
  answered_at   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.assistant_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id),
  role        TEXT CHECK (role IN ('user', 'assistant')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id             UUID NOT NULL REFERENCES public.cases(id),
  user_id             UUID NOT NULL REFERENCES public.profiles(id),
  stripe_session_id   TEXT UNIQUE,
  amount_cents        INTEGER NOT NULL,
  type                TEXT CHECK (type IN ('full', 'half')),
  status              TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','failed')),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Habilitar RLS
ALTER TABLE public.questionnaire_basic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_dynamic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 9. Políticas limpias para cases
CREATE POLICY "Solo partes del expediente pueden ver y editar" ON public.cases
  FOR ALL USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Cualquier usuario autenticado puede crear expediente" ON public.cases
  FOR INSERT WITH CHECK (auth.uid() = user_a_id);

-- 10. Políticas para tablas nuevas
DROP POLICY IF EXISTS "Solo el usuario puede ver/crear/editar su propio cuestionario" ON public.questionnaire_basic;
CREATE POLICY "Solo el usuario puede ver/crear/editar su propio cuestionario" ON public.questionnaire_basic
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Solo el usuario puede ver/editar su propio cuestionario dinámico" ON public.questionnaire_dynamic;
CREATE POLICY "Solo el usuario puede ver/editar su propio cuestionario dinámico" ON public.questionnaire_dynamic
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Solo el usuario puede ver y crear sus mensajes del asistente" ON public.assistant_messages;
CREATE POLICY "Solo el usuario puede ver y crear sus mensajes del asistente" ON public.assistant_messages
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Solo el usuario puede ver y crear sus propios pagos" ON public.payments;
CREATE POLICY "Solo el usuario puede ver y crear sus propios pagos" ON public.payments
  FOR ALL USING (auth.uid() = user_id);

-- 11. Trigger para nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Crear perfiles para usuarios sin perfil
INSERT INTO public.profiles (id, full_name, avatar_url)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', u.email),
  u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
