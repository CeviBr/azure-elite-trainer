import { ReactNode } from "react";
import { type AppUser, logout } from "@/lib/users";
import { Crown, LogOut, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AppTab = "home" | "workout" | "calendar" | "stats" | "editor" | "profile";

const NAV: { id: AppTab; icon: string; label: string; leaderOnly?: boolean }[] = [
  { id: "home", icon: "🏠", label: "HOME" },
  { id: "workout", icon: "💪", label: "TREINO" },
  { id: "calendar", icon: "📅", label: "CAL" },
  { id: "stats", icon: "📈", label: "STATS" },
  { id: "editor", icon: "⚡", label: "EDITOR", leaderOnly: true },
  { id: "profile", icon: "👤", label: "PERFIL" },
];

export default function AppShell({
  user, tab, onTab, onLogout, children,
}: {
  user: AppUser; tab: AppTab; onTab: (t: AppTab) => void;
  onLogout: () => void; children: ReactNode;
}) {
  const isLeader = user.role === "leader";
  return (
    <div
      className="min-h-screen flex flex-col bg-[#060606] text-zinc-100"
      style={{
        fontFamily: "'Barlow Condensed','Inter',system-ui,sans-serif",
        backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(0,255,65,0.04), transparent 60%), url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;700&family=Permanent+Marker&display=swap" rel="stylesheet" />

      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{isLeader ? "👑" : <Skull className="h-4 w-4 inline" />}</span>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-2xl tracking-[0.4em] text-white">GANGST3R</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span style={{ fontFamily: "'Bebas Neue'" }} className="text-base tracking-[0.25em] uppercase leading-none text-white">{user.nickname}</span>
              {isLeader && (
                <span className="text-[9px] tracking-[0.3em] uppercase text-yellow-400 mt-0.5 flex items-center gap-1">
                  <Crown className="h-2.5 w-2.5" /> Líder
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-zinc-400 hover:text-red-400 hover:bg-zinc-900 border border-zinc-800 rounded-md text-[10px] tracking-[0.2em]">
              <LogOut className="h-3 w-3 mr-1" /> SAIR
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-5 pb-24">{children}</div>
      </main>

      <nav className="sticky bottom-0 z-40 border-t border-zinc-800 bg-black/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex">
          {NAV.filter((n) => !n.leaderOnly || isLeader).map((n) => {
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => onTab(n.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-3 border-t-2 transition-colors ${
                  active
                    ? "border-green-500 text-green-400 bg-green-500/5"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
                style={{ fontFamily: "'Bebas Neue'" }}
              >
                <span className="text-lg leading-none">{n.icon}</span>
                <span className="text-[10px] tracking-[0.2em]">{n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}