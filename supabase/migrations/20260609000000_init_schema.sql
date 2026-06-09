-- ============================================================
-- MEDIADOR APP — Schema completo
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLAS

-- PERFILES DE USUARIO (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  kyc_verified  BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- EXPEDIENTES DE MEDIACIÓN
CREATE TABLE IF NOT EXISTS public.cases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id       UUID NOT NULL REFERENCES public.profiles(id),
  user_b_id       UUID REFERENCES public.profiles(id),
  status          TEXT DEFAULT 'pending_partner'
                  CHECK (status IN (
                    'pending_partner',
                    'questionnaires',
                    'negotiation',
                    'signing',
                    'completed'
                  )),
  invite_token    UUID UNIQUE DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- CUESTIONARIO BÁSICO
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

-- PREGUNTAS DINÁMICAS (IA)
CREATE TABLE IF NOT EXISTS public.questionnaire_dynamic (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id       UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id),
  question_text TEXT NOT NULL,
  answer_text   TEXT,
  order_index   INTEGER,
  answered_at   TIMESTAMPTZ
);

-- PUNTOS DE ACUERDO
CREATE TABLE IF NOT EXISTS public.agreements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id         UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  topic           TEXT NOT NULL,
  ai_summary      TEXT NOT NULL,
  user_a_status   TEXT DEFAULT 'pending' CHECK (user_a_status IN ('pending','accepted','rejected')),
  user_b_status   TEXT DEFAULT 'pending' CHECK (user_b_status IN ('pending','accepted','rejected')),
  ai_suggestion   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- MENSAJES DEL ASISTENTE IA
CREATE TABLE IF NOT EXISTS public.assistant_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id),
  role        TEXT CHECK (role IN ('user', 'assistant')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PAGOS
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

-- 3. TRIGGER: crear perfil automáticamente al registrar usuario
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

-- 4. INSERTAR PERFILES PARA USUARIOS EXISTENTES QUE NO LO TIENEN AÚN
INSERT INTO public.profiles (id, full_name, avatar_url)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', u.email),
  u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 5. ROW LEVEL SECURITY (RLS)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_basic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_dynamic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "Permitir lectura pública de perfiles" ON public.profiles;
CREATE POLICY "Permitir lectura pública de perfiles" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserción de perfil propio" ON public.profiles;
CREATE POLICY "Permitir inserción de perfil propio" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Permitir actualización del propio perfil" ON public.profiles;
CREATE POLICY "Permitir actualización del propio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- cases
DROP POLICY IF EXISTS "Solo partes del expediente pueden ver y editar" ON public.cases;
CREATE POLICY "Solo partes del expediente pueden ver y editar" ON public.cases
  FOR ALL USING (
    auth.uid() = user_a_id OR auth.uid() = user_b_id
  );

DROP POLICY IF EXISTS "Cualquier usuario autenticado puede crear expediente" ON public.cases;
CREATE POLICY "Cualquier usuario autenticado puede crear expediente" ON public.cases
  FOR INSERT WITH CHECK (auth.uid() = user_a_id);

-- questionnaire_basic
DROP POLICY IF EXISTS "Solo el usuario puede ver/crear/editar su propio cuestionario" ON public.questionnaire_basic;
CREATE POLICY "Solo el usuario puede ver/crear/editar su propio cuestionario" ON public.questionnaire_basic
  FOR ALL USING (auth.uid() = user_id);

-- questionnaire_dynamic
DROP POLICY IF EXISTS "Solo el usuario puede ver/editar su propio cuestionario dinámico" ON public.questionnaire_dynamic;
CREATE POLICY "Solo el usuario puede ver/editar su propio cuestionario dinámico" ON public.questionnaire_dynamic
  FOR ALL USING (auth.uid() = user_id);

-- agreements
DROP POLICY IF EXISTS "Partes del expediente pueden ver acuerdos" ON public.agreements;
CREATE POLICY "Partes del expediente pueden ver acuerdos" ON public.agreements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE id = agreements.case_id
      AND (user_a_id = auth.uid() OR user_b_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partes del expediente pueden editar acuerdos" ON public.agreements;
CREATE POLICY "Partes del expediente pueden editar acuerdos" ON public.agreements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE id = agreements.case_id
      AND (user_a_id = auth.uid() OR user_b_id = auth.uid())
    )
  );

-- assistant_messages
DROP POLICY IF EXISTS "Solo el usuario puede ver y crear sus mensajes del asistente" ON public.assistant_messages;
CREATE POLICY "Solo el usuario puede ver y crear sus mensajes del asistente" ON public.assistant_messages
  FOR ALL USING (auth.uid() = user_id);

-- payments
DROP POLICY IF EXISTS "Solo el usuario puede ver y crear sus propios pagos" ON public.payments;
CREATE POLICY "Solo el usuario puede ver y crear sus propios pagos" ON public.payments
  FOR ALL USING (auth.uid() = user_id);
