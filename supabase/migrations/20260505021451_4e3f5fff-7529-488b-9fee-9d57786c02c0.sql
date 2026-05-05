
-- Caixas de treino criadas pelo líder
CREATE TABLE public.workout_boxes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  day_of_week SMALLINT,                  -- 0=Dom .. 6=Sáb (NULL = sem dia)
  week_label TEXT DEFAULT 'S1',
  body_parts TEXT[] DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL DEFAULT 'fabricio',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.box_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  box_id UUID NOT NULL REFERENCES public.workout_boxes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  body_part TEXT,
  focus TEXT,
  sets INTEGER NOT NULL DEFAULT 3,
  reps TEXT NOT NULL DEFAULT '10-12',
  load_kg NUMERIC NOT NULL DEFAULT 0,
  rest_seconds INTEGER NOT NULL DEFAULT 60,
  order_index INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  -- Mídia: várias por exercício
  media JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{url,type:'image|video|gif|youtube', name}]
  youtube_id TEXT,
  subs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.workout_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  body_part TEXT,
  load_kg NUMERIC NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  set_num INTEGER NOT NULL DEFAULT 1,
  is_pr BOOLEAN NOT NULL DEFAULT false,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_box_exercises_box ON public.box_exercises(box_id, order_index);
CREATE INDEX idx_workout_boxes_day ON public.workout_boxes(day_of_week, order_index);
CREATE INDEX idx_workout_logs_user_date ON public.workout_logs(user_id, performed_at DESC);

-- RLS aberto (auth é local por nickname; gate de líder é no client)
ALTER TABLE public.workout_boxes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.box_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "boxes_all" ON public.workout_boxes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "ex_all"    ON public.box_exercises FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "logs_all"  ON public.workout_logs  FOR ALL USING (true) WITH CHECK (true);

-- Bucket público para mídia
INSERT INTO storage.buckets (id, name, public) VALUES ('workout-media','workout-media', true);

CREATE POLICY "media_read"   ON storage.objects FOR SELECT USING (bucket_id = 'workout-media');
CREATE POLICY "media_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'workout-media');
CREATE POLICY "media_update" ON storage.objects FOR UPDATE USING (bucket_id = 'workout-media');
CREATE POLICY "media_delete" ON storage.objects FOR DELETE USING (bucket_id = 'workout-media');
