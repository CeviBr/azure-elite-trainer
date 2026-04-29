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
    return user;
  }
  return null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}