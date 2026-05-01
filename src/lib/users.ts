export type UserId = "fabio" | "william" | "fabricio";

export interface AppUser {
  id: UserId;
  name: string;
  password: string;
  role: "leader" | "member";
  color: string;
  initials: string;
}

export const USERS: AppUser[] = [
  { id: "fabio",    name: "Fábio",    password: "senha123", role: "member", color: "from-blue-600 to-blue-900", initials: "FB" },
  { id: "william",  name: "William",  password: "senha456", role: "member", color: "from-sky-600 to-indigo-900", initials: "WL" },
  { id: "fabricio", name: "Fabrício", password: "senha789", role: "leader", color: "from-amber-500 via-yellow-400 to-amber-700", initials: "FC" },
];

export const SESSION_KEY = "ironforge_session";

export function getSession(): AppUser | null {
  try {
    const id = localStorage.getItem(SESSION_KEY) as UserId | null;
    return USERS.find((u) => u.id === id) ?? null;
  } catch {
    return null;
  }
}

export function login(name: string, password: string): AppUser | null {
  const user = USERS.find(
    (u) => u.name.toLowerCase() === name.toLowerCase() && u.password === password
  );
  if (user) {
    localStorage.setItem(SESSION_KEY, user.id);
    recordEntry(user.id);
    return user;
  }
  return null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

/* ---------- Registro de Entradas ---------- */
const ENTRIES_KEY = "ganst3r_entries_v1";

export interface EntryLog {
  total: number;                       // contador global Nº 000
  byUser: Record<UserId, number[]>;    // timestamps por usuário
  firstSeen: Record<UserId, number>;   // primeiro acesso (para "dias")
}

export function loadEntries(): EntryLog {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { total: 0, byUser: { fabio: [], william: [], fabricio: [] }, firstSeen: {} as any };
}

export function recordEntry(id: UserId) {
  const e = loadEntries();
  e.total += 1;
  e.byUser[id] = [...(e.byUser[id] ?? []), Date.now()];
  if (!e.firstSeen[id]) e.firstSeen[id] = Date.now();
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(e));
}

export function daysSince(ts?: number) {
  if (!ts) return 0;
  return Math.max(0, Math.floor((Date.now() - ts) / 86_400_000));
}