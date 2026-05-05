import { supabase } from "@/integrations/supabase/client";

export type MediaType = "image" | "video" | "gif" | "youtube";
export interface MediaItem { url: string; type: MediaType; name?: string }

export interface WorkoutBox {
  id: string;
  name: string;
  description: string | null;
  day_of_week: number | null;
  week_label: string | null;
  body_parts: string[];
  order_index: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BoxExercise {
  id: string;
  box_id: string;
  name: string;
  body_part: string | null;
  focus: string | null;
  sets: number;
  reps: string;
  load_kg: number;
  rest_seconds: number;
  order_index: number;
  notes: string | null;
  media: MediaItem[];
  youtube_id: string | null;
  subs: string[];
  created_at: string;
}

export interface BoxWithExercises extends WorkoutBox {
  exercises: BoxExercise[];
}

export const DAYS = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
export const DAYS_SHORT = ["DOM","SEG","TER","QUA","QUI","SEX","SÁB"];
export const BODY_PARTS = ["Peito","Costas","Ombros","Bíceps","Tríceps","Perna","Glúteo","Core","Cardio"] as const;

export async function fetchBoxes(): Promise<BoxWithExercises[]> {
  const { data: boxes, error } = await supabase
    .from("workout_boxes")
    .select("*")
    .order("day_of_week", { ascending: true })
    .order("order_index", { ascending: true });
  if (error) throw error;
  if (!boxes?.length) return [];
  const ids = boxes.map((b) => b.id);
  const { data: exs, error: e2 } = await supabase
    .from("box_exercises")
    .select("*")
    .in("box_id", ids)
    .order("order_index", { ascending: true });
  if (e2) throw e2;
  return boxes.map((b: any) => ({
    ...b,
    exercises: (exs ?? []).filter((e: any) => e.box_id === b.id).map((e: any) => ({
      ...e,
      media: Array.isArray(e.media) ? e.media : [],
      subs: e.subs ?? [],
    })),
  }));
}

export async function createBox(input: Partial<WorkoutBox>): Promise<WorkoutBox> {
  const { data, error } = await supabase.from("workout_boxes").insert({
    name: input.name ?? "NOVA CAIXA",
    description: input.description ?? "",
    day_of_week: input.day_of_week ?? null,
    week_label: input.week_label ?? "S1",
    body_parts: input.body_parts ?? [],
    order_index: input.order_index ?? 0,
    created_by: input.created_by ?? "fabricio",
  }).select().single();
  if (error) throw error;
  return data as WorkoutBox;
}

export async function updateBox(id: string, patch: Partial<WorkoutBox>) {
  const { error } = await supabase.from("workout_boxes").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function deleteBox(id: string) {
  const { error } = await supabase.from("workout_boxes").delete().eq("id", id);
  if (error) throw error;
}

export async function addExercise(box_id: string, input: Partial<BoxExercise>): Promise<BoxExercise> {
  const { data, error } = await supabase.from("box_exercises").insert({
    box_id,
    name: input.name ?? "NOVO EXERCÍCIO",
    body_part: input.body_part ?? null,
    focus: input.focus ?? null,
    sets: input.sets ?? 3,
    reps: input.reps ?? "10-12",
    load_kg: input.load_kg ?? 0,
    rest_seconds: input.rest_seconds ?? 60,
    order_index: input.order_index ?? 0,
    notes: input.notes ?? null,
    media: (input.media ?? []) as any,
    youtube_id: input.youtube_id ?? null,
    subs: input.subs ?? [],
  }).select().single();
  if (error) throw error;
  return data as any;
}

export async function updateExercise(id: string, patch: Partial<BoxExercise>) {
  const payload: any = { ...patch };
  if (patch.media) payload.media = patch.media;
  const { error } = await supabase.from("box_exercises").update(payload).eq("id", id);
  if (error) throw error;
}

export async function deleteExercise(id: string) {
  const { error } = await supabase.from("box_exercises").delete().eq("id", id);
  if (error) throw error;
}

/** Sobe vários arquivos para a bucket pública e devolve MediaItems prontos */
export async function uploadMedia(files: FileList | File[]): Promise<MediaItem[]> {
  const arr = Array.from(files);
  const out: MediaItem[] = [];
  for (const f of arr) {
    const ext = f.name.split(".").pop() ?? "bin";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
    const { error } = await supabase.storage.from("workout-media").upload(path, f, { upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("workout-media").getPublicUrl(path);
    const type: MediaType =
      f.type.startsWith("video/") ? "video" :
      f.type === "image/gif" ? "gif" : "image";
    out.push({ url: data.publicUrl, type, name: f.name });
  }
  return out;
}

/* Logs de execução */
export interface WorkoutLog {
  id?: string; user_id: string; exercise_name: string; body_part: string | null;
  load_kg: number; reps: number; set_num: number; is_pr: boolean; performed_at?: string;
}

export async function logSet(l: WorkoutLog) {
  const { error } = await supabase.from("workout_logs").insert(l as any);
  if (error) throw error;
}

export async function fetchLogs(user_id?: string): Promise<WorkoutLog[]> {
  let q = supabase.from("workout_logs").select("*").order("performed_at", { ascending: false }).limit(500);
  if (user_id) q = q.eq("user_id", user_id);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as any;
}