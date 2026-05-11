
-- ============ leader_notices ============
CREATE TABLE public.leader_notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  kind text NOT NULL DEFAULT 'info',
  by text NOT NULL DEFAULT 'fabricio',
  read_by text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.leader_notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY notices_all ON public.leader_notices FOR ALL USING (true) WITH CHECK (true);

-- ============ exercise_media ============
CREATE TABLE public.exercise_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  box_exercise_id uuid,
  exercise_name text NOT NULL,
  user_id text NOT NULL,
  kind text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.exercise_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY exmedia_all ON public.exercise_media FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX idx_exmedia_name ON public.exercise_media(exercise_name);

-- ============ user_substitutions ============
CREATE TABLE public.user_substitutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  box_exercise_id uuid,
  exercise_name text NOT NULL,
  new_name text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_name)
);
ALTER TABLE public.user_substitutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY usub_all ON public.user_substitutions FOR ALL USING (true) WITH CHECK (true);

-- ============ calendar_entries ============
CREATE TABLE public.calendar_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  day text NOT NULL,
  note text DEFAULT '',
  media jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, day)
);
ALTER TABLE public.calendar_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY calentries_all ON public.calendar_entries FOR ALL USING (true) WITH CHECK (true);

-- ============ realtime ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.leader_notices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.exercise_media;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_substitutions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workout_boxes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.box_exercises;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workout_logs;

ALTER TABLE public.leader_notices REPLICA IDENTITY FULL;
ALTER TABLE public.exercise_media REPLICA IDENTITY FULL;
ALTER TABLE public.user_substitutions REPLICA IDENTITY FULL;
ALTER TABLE public.calendar_entries REPLICA IDENTITY FULL;
ALTER TABLE public.workout_boxes REPLICA IDENTITY FULL;
ALTER TABLE public.box_exercises REPLICA IDENTITY FULL;
ALTER TABLE public.workout_logs REPLICA IDENTITY FULL;

-- ============ storage bucket exec-media ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('exec-media', 'exec-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "execmedia_read" ON storage.objects FOR SELECT USING (bucket_id = 'exec-media');
CREATE POLICY "execmedia_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'exec-media');
CREATE POLICY "execmedia_update" ON storage.objects FOR UPDATE USING (bucket_id = 'exec-media');
CREATE POLICY "execmedia_delete" ON storage.objects FOR DELETE USING (bucket_id = 'exec-media');
