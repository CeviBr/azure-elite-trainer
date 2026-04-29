import { EXERCISES } from "./exercises";

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string; // ex "8-12"
  rest: number; // segundos
  note?: string;
}

export interface DayWorkout {
  day: number; // 0 = Domingo ... 6 = Sábado
  title: string;
  focus: string; // ex "Peito + Tríceps"
  rest?: boolean;
  exercises: WorkoutExercise[];
}

export const WEEK_DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
export const WEEK_DAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Plano padrão criado pelo líder (Fabrício). Pode ser editado a qualquer momento. */
export const DEFAULT_PLAN: DayWorkout[] = [
  {
    day: 1, title: "Treino A", focus: "Peito + Tríceps",
    exercises: [
      { exerciseId: "supino-reto-barra", sets: 4, reps: "8-10", rest: 90 },
      { exerciseId: "supino-inclinado-halteres", sets: 4, reps: "10-12", rest: 75 },
      { exerciseId: "crucifixo-halteres", sets: 3, reps: "12-15", rest: 60 },
      { exerciseId: "triceps-corda", sets: 4, reps: "12", rest: 60 },
      { exerciseId: "triceps-testa", sets: 3, reps: "10-12", rest: 60 },
      { exerciseId: "mergulho-banco", sets: 3, reps: "Até a falha", rest: 60 },
    ],
  },
  {
    day: 2, title: "Treino B", focus: "Costas + Bíceps",
    exercises: [
      { exerciseId: "barra-fixa", sets: 4, reps: "Máx", rest: 90 },
      { exerciseId: "remada-curvada", sets: 4, reps: "8-10", rest: 90 },
      { exerciseId: "puxada-alta", sets: 3, reps: "10-12", rest: 75 },
      { exerciseId: "remada-unilateral", sets: 3, reps: "10 cada", rest: 60 },
      { exerciseId: "rosca-direta", sets: 4, reps: "10-12", rest: 60 },
      { exerciseId: "rosca-martelo", sets: 3, reps: "12", rest: 60 },
    ],
  },
  {
    day: 3, title: "Treino C", focus: "Pernas Completo",
    exercises: [
      { exerciseId: "agachamento-livre", sets: 5, reps: "6-8", rest: 120 },
      { exerciseId: "leg-press", sets: 4, reps: "10-12", rest: 90 },
      { exerciseId: "stiff", sets: 4, reps: "10", rest: 90 },
      { exerciseId: "cadeira-extensora", sets: 3, reps: "12-15", rest: 60 },
      { exerciseId: "afundo", sets: 3, reps: "10 cada", rest: 75 },
      { exerciseId: "panturrilha-pe", sets: 4, reps: "15-20", rest: 45 },
    ],
  },
  {
    day: 4, title: "Treino D", focus: "Ombros + Core",
    exercises: [
      { exerciseId: "desenvolvimento-halteres", sets: 4, reps: "8-10", rest: 90 },
      { exerciseId: "elevacao-lateral", sets: 4, reps: "12-15", rest: 60 },
      { exerciseId: "elevacao-frontal", sets: 3, reps: "12", rest: 60 },
      { exerciseId: "face-pull", sets: 4, reps: "15", rest: 45 },
      { exerciseId: "abdominal-crunch", sets: 3, reps: "20", rest: 45 },
      { exerciseId: "prancha", sets: 3, reps: "45s", rest: 45 },
    ],
  },
  {
    day: 5, title: "Treino E", focus: "Push/Pull leve + Glúteos",
    exercises: [
      { exerciseId: "elevacao-pelvica", sets: 4, reps: "10-12", rest: 90 },
      { exerciseId: "rosca-scott", sets: 3, reps: "10-12", rest: 60 },
      { exerciseId: "triceps-corda", sets: 3, reps: "12", rest: 60 },
      { exerciseId: "elevacao-pernas", sets: 3, reps: "12", rest: 45 },
      { exerciseId: "esteira", sets: 1, reps: "20 min", rest: 0 },
    ],
  },
  { day: 6, title: "Cardio leve / Mobilidade", focus: "Recuperação ativa", rest: false,
    exercises: [{ exerciseId: "esteira", sets: 1, reps: "30 min", rest: 0 }] },
  { day: 0, title: "Descanso", focus: "Recuperação total", rest: true, exercises: [] },
];

/* ---------- Store sincronizado entre os 3 usuários ---------- */

const PLAN_KEY = "ironforge_plan_v1";
const NOTICE_KEY = "ironforge_notice_v1";

export interface PlanNotice {
  id: string;
  message: string;
  by: string;
  at: number;
}

export function loadPlan(): DayWorkout[] {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_PLAN;
}

export function savePlan(plan: DayWorkout[], by: string, message: string) {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  const notice: PlanNotice = { id: crypto.randomUUID(), message, by, at: Date.now() };
  localStorage.setItem(NOTICE_KEY, JSON.stringify(notice));
  // dispara evento para outras abas/usuários
  window.dispatchEvent(new StorageEvent("storage", { key: PLAN_KEY, newValue: JSON.stringify(plan) }));
  window.dispatchEvent(new StorageEvent("storage", { key: NOTICE_KEY, newValue: JSON.stringify(notice) }));
}

export function getLastNotice(): PlanNotice | null {
  try {
    const raw = localStorage.getItem(NOTICE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export const STORAGE_KEYS = { PLAN_KEY, NOTICE_KEY };

/** Util: nome do exercício (mostra substituição local se houver) */
export function exerciseName(id: string) {
  return EXERCISES.find((e) => e.id === id)?.name ?? id;
}