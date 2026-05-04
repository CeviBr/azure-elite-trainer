export type UserId = "fabio" | "william" | "fabricio";

import avatarFabio from "@/assets/avatar-fabio.jpg";
import avatarWilliam from "@/assets/avatar-william.jpg";
import avatarFabricio from "@/assets/avatar-fabricio.jpg";

export interface AppUser {
  id: UserId;
  name: string;
  nickname: string;
  password: string;
  role: "leader" | "member";
  color: string;
  initials: string;
  avatar: string;
}

export const USERS: AppUser[] = [
  { id: "fabio",    name: "Fábio",    nickname: "ElFabro",  password: "senha123", role: "member", color: "from-zinc-700 to-zinc-900", initials: "FB", avatar: avatarFabio },
  { id: "william",  name: "William",  nickname: "HeadShot", password: "senha456", role: "member", color: "from-zinc-700 to-zinc-900", initials: "WL", avatar: avatarWilliam },
  { id: "fabricio", name: "Fabrício", nickname: "ReisZo",   password: "senha789", role: "leader", color: "from-zinc-800 to-black",     initials: "FC", avatar: avatarFabricio },
];

export const SESSION_KEY = "ironforge_session";
export const LAST_NICK_KEY = "ganst3r_last_nick";

export function findByNickname(nick: string): AppUser | undefined {
  const n = nick.trim().toLowerCase();
  return USERS.find((u) => u.nickname.toLowerCase() === n);
}

export function getLastNickname(): string | null {
  try { return localStorage.getItem(LAST_NICK_KEY); } catch { return null; }
}
export function setLastNickname(nick: string) {
  try { localStorage.setItem(LAST_NICK_KEY, nick); } catch {}
}

export function getSession(): AppUser | null {
  try {
    const id = localStorage.getItem(SESSION_KEY) as UserId | null;
    return USERS.find((u) => u.id === id) ?? null;
  } catch {
    return null;
  }
}

export function login(nickOrName: string, password: string): AppUser | null {
  const key = nickOrName.trim().toLowerCase();
  const user = USERS.find(
    (u) => (u.nickname.toLowerCase() === key || u.name.toLowerCase() === key) && u.password === password
  );
  if (user) {
    localStorage.setItem(SESSION_KEY, user.id);
    localStorage.setItem(LAST_NICK_KEY, user.nickname);
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

/** Calcula sequência de dias consecutivos com check-in (streak). */
export function streakDays(timestamps?: number[]): number {
  if (!timestamps || !timestamps.length) return 0;
  const days = Array.from(new Set(timestamps.map((t) => {
    const d = new Date(t); d.setHours(0,0,0,0); return d.getTime();
  }))).sort((a,b) => b - a);
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = today.getTime() - 86_400_000;
  if (days[0] !== today.getTime() && days[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i-1] - days[i] === 86_400_000) streak++;
    else break;
  }
  return streak;
}