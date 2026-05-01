import { useMemo, useState } from "react";
import { USERS, login, type AppUser, type UserId, loadEntries, daysSince } from "@/lib/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Crown, Lock, X } from "lucide-react";
import { toast } from "sonner";

export default function Login({ onLogin }: { onLogin: (u: AppUser) => void }) {
  const [selected, setSelected] = useState<UserId | null>(null);
  const [profileOpen, setProfileOpen] = useState<UserId | null>(null);
  const [password, setPassword] = useState("");
  const entries = useMemo(loadEntries, [selected, profileOpen]);

  const sel = USERS.find((u) => u.id === selected);
  const profile = USERS.find((u) => u.id === profileOpen);

  const submit = () => {
    if (!sel) return;
    const u = login(sel.name, password);
    if (u) {
      toast.success(`Entrada registrada — ${u.name}`);
      onLogin(u);
    } else {
      toast.error("Senha incorreta");
      setPassword("");
    }
  };

  // posições do "grafo": líder no centro, membros nos lados
  const leader = USERS.find((u) => u.role === "leader")!;
  const members = USERS.filter((u) => u.role !== "leader");
  const entryNumber = String(entries.total).padStart(3, "0");

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#0e1116] relative overflow-hidden font-serif">
      {/* grain / cross pattern */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
           style={{ backgroundImage: "radial-gradient(#0e1116 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

      {/* Top editorial header */}
      <header className="relative border-b border-[#0e1116]/20 px-6 py-4 flex items-center justify-between text-[10px] uppercase tracking-[0.25em]">
        <span>Ganst3r · Edição Mensal</span>
        <span className="hidden sm:block">Rede Privada — 03 Membros</span>
        <span>Vol. 01 / Forja</span>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-10">
        {/* Title block */}
        <div className="grid grid-cols-12 gap-4 items-end mb-10">
          <div className="col-span-12 sm:col-span-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#0e1116]/60">№ {entryNumber} — Entrada</p>
            <h1 className="font-black leading-[0.85] tracking-tight text-[64px] sm:text-[120px] mt-2">
              Ganst<span className="italic">3</span>r
            </h1>
            <div className="h-px bg-[#0e1116] my-4" />
            <p className="text-sm max-w-md text-[#0e1116]/70 italic">
              Uma rede fechada de três. Disciplina forjada em silêncio. Cada entrada é registrada, cada peso lembrado.
            </p>
          </div>
          <div className="col-span-12 sm:col-span-4 text-right text-[10px] uppercase tracking-[0.25em] text-[#0e1116]/60">
            <p>Total de entradas registradas</p>
            <p className="font-mono text-3xl text-[#0e1116] mt-1">{entryNumber}</p>
          </div>
        </div>

        {/* Neural graph */}
        <section className="relative grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-7 relative aspect-[5/4] sm:aspect-[16/10] border border-[#0e1116]/15 bg-[#fbf9f3]">
            {/* SVG connecting lines */}
            <NeuralGraph
              leaderId={leader.id}
              members={members.map((m) => m.id)}
              hovered={selected ?? profileOpen}
            />
            {/* Nodes */}
            <Node user={leader} pos={{ left: "50%", top: "50%" }} size={120} isLeader
                  onSelect={() => setSelected(leader.id)} onView={() => setProfileOpen(leader.id)}
                  visits={entries.byUser[leader.id]?.length ?? 0} />
            <Node user={members[0]} pos={{ left: "12%", top: "20%" }} size={88}
                  onSelect={() => setSelected(members[0].id)} onView={() => setProfileOpen(members[0].id)}
                  visits={entries.byUser[members[0].id]?.length ?? 0} />
            <Node user={members[1]} pos={{ left: "12%", top: "78%" }} size={88}
                  onSelect={() => setSelected(members[1].id)} onView={() => setProfileOpen(members[1].id)}
                  visits={entries.byUser[members[1].id]?.length ?? 0} />

            {/* corner labels */}
            <span className="absolute top-2 left-2 text-[9px] uppercase tracking-[0.3em] text-[#0e1116]/40">Fig. 01</span>
            <span className="absolute bottom-2 right-2 text-[9px] uppercase tracking-[0.3em] text-[#0e1116]/40">Rede Neural — Liderança</span>
          </div>

          {/* Right column: password panel */}
          <aside className="col-span-12 lg:col-span-5 border border-[#0e1116]/15 bg-[#fbf9f3] p-6 flex flex-col">
            {!sel ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#0e1116]/60">Instruções</p>
                  <p className="mt-3 text-base leading-snug">
                    Selecione um nó na rede para iniciar sua entrada. Toque novamente sobre um membro para ler seu dossiê.
                  </p>
                </div>
                <div className="mt-6 space-y-2">
                  {USERS.map((u) => (
                    <button key={u.id} onClick={() => setSelected(u.id)}
                      className="w-full flex items-center justify-between border-b border-[#0e1116]/15 py-2 hover:bg-[#0e1116] hover:text-[#f4f1ea] px-2 transition group">
                      <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#0e1116] group-hover:bg-[#f4f1ea]" />
                        <span className="font-bold tracking-wide uppercase text-sm">{u.name}</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-widest opacity-60">
                        {u.role === "leader" ? "Líder" : "Membro"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between animate-slide-up">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#0e1116]/60">Acesso restrito</p>
                    <button onClick={() => { setSelected(null); setPassword(""); }} className="opacity-60 hover:opacity-100">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <h2 className="font-black text-4xl mt-3">{sel.name}</h2>
                  <p className="text-xs uppercase tracking-[0.3em] mt-1 flex items-center gap-1">
                    {sel.role === "leader" && <Crown className="h-3 w-3" />}
                    {sel.role === "leader" ? "Líder da forja" : "Membro vinculado a Fabrício"}
                  </p>
                </div>
                <div className="mt-8">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#0e1116]/60">Senha</label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0e1116]/50" />
                    <Input autoFocus type="password" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submit()}
                      className="pl-10 h-12 rounded-none border-[#0e1116]/30 bg-transparent focus-visible:ring-0 focus-visible:border-[#0e1116]" />
                  </div>
                  <Button onClick={submit} className="w-full mt-4 h-12 rounded-none bg-[#0e1116] hover:bg-[#0e1116]/90 text-[#f4f1ea] uppercase tracking-[0.3em] text-xs font-bold">
                    Registrar entrada
                  </Button>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#0e1116]/50 mt-3">
                    Esta entrada será arquivada como Nº {String(entries.total + 1).padStart(3, "0")}
                  </p>
                </div>
              </div>
            )}
          </aside>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between border-t border-[#0e1116]/20 pt-4 text-[10px] uppercase tracking-[0.3em] text-[#0e1116]/60">
          <span>Ganst3r · Confidencial</span>
          <span>03 Nós · 02 Conexões</span>
          <span>Que a forja nunca apague</span>
        </footer>
      </main>

      {/* Profile modal */}
      <Dialog open={!!profile} onOpenChange={(v) => !v && setProfileOpen(null)}>
        <DialogContent className="max-w-md rounded-none bg-[#fbf9f3] border-[#0e1116]/30">
          <DialogHeader>
            <DialogTitle className="text-[10px] uppercase tracking-[0.3em] font-normal text-[#0e1116]/60">
              Dossiê — Membro
            </DialogTitle>
          </DialogHeader>
          {profile && (
            <div className="space-y-4">
              <div className={`mx-auto h-32 w-32 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-white text-3xl font-black shadow-royal ring-4 ring-[#0e1116]/10`}>
                {profile.initials}
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-black">{profile.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] mt-1 flex items-center justify-center gap-1 text-[#0e1116]/70">
                  {profile.role === "leader" && <Crown className="h-3 w-3" />}
                  {profile.role === "leader" ? "Líder" : "Vinculado a Fabrício"}
                </p>
              </div>
              <div className="grid grid-cols-3 border-y border-[#0e1116]/20 divide-x divide-[#0e1116]/20 text-center">
                <Stat label="Entradas" value={entries.byUser[profile.id]?.length ?? 0} />
                <Stat label="Dias na forja" value={daysSince(entries.firstSeen[profile.id])} />
                <Stat label="Última" value={fmtRel(entries.byUser[profile.id]?.slice(-1)[0])} />
              </div>
              <Button onClick={() => { setProfileOpen(null); setSelected(profile.id); }}
                className="w-full rounded-none bg-[#0e1116] hover:bg-[#0e1116]/90 text-[#f4f1ea] uppercase tracking-[0.3em] text-xs">
                Iniciar entrada
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="py-3">
      <p className="font-mono text-2xl">{value}</p>
      <p className="text-[9px] uppercase tracking-[0.25em] text-[#0e1116]/60 mt-1">{label}</p>
    </div>
  );
}

function fmtRel(ts?: number) {
  if (!ts) return "—";
  const d = daysSince(ts);
  if (d === 0) return "hoje";
  if (d === 1) return "1d";
  return `${d}d`;
}

function Node({ user, pos, size, onSelect, onView, isLeader, visits }: {
  user: AppUser;
  pos: { left: string; top: string };
  size: number;
  onSelect: () => void;
  onView: () => void;
  isLeader?: boolean;
  visits: number;
}) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 group" style={{ left: pos.left, top: pos.top }}>
      <button
        onClick={onView}
        onDoubleClick={onSelect}
        className={`relative rounded-full bg-gradient-to-br ${user.color} text-white font-black shadow-royal flex items-center justify-center
          ring-2 ring-[#0e1116]/20 hover:ring-[#0e1116] transition-all hover:scale-105`}
        style={{ width: size, height: size, fontSize: size * 0.28 }}
        aria-label={`Ver perfil de ${user.name}`}
      >
        {user.initials}
        {isLeader && (
          <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-[#0e1116] text-[#f4f1ea] flex items-center justify-center">
            <Crown className="h-3.5 w-3.5" />
          </span>
        )}
        <span className="absolute inset-0 rounded-full animate-pulse-gold pointer-events-none" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 text-center whitespace-nowrap">
        <p className="font-bold text-sm uppercase tracking-wider">{user.name}</p>
        <p className="text-[9px] uppercase tracking-[0.25em] text-[#0e1116]/60 font-sans">
          {visits} entradas · clique para abrir
        </p>
      </div>
    </div>
  );
}

function NeuralGraph({ leaderId, members, hovered }: { leaderId: UserId; members: UserId[]; hovered: UserId | null }) {
  // pontos correspondem aos `pos` dos Nodes (em %)
  const leaderPt = { x: 50, y: 50 };
  const pts: Record<UserId, { x: number; y: number }> = {
    [leaderId]: leaderPt,
    [members[0]]: { x: 12, y: 20 },
    [members[1]]: { x: 12, y: 78 },
  } as any;

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="link" x1="0" x2="1">
          <stop offset="0" stopColor="#0e1116" stopOpacity="0.15" />
          <stop offset="1" stopColor="#c9a14a" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {members.map((m) => {
        const a = pts[m], b = pts[leaderId];
        const active = hovered === m || hovered === leaderId;
        return (
          <g key={m}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="url(#link)" strokeWidth={active ? 0.6 : 0.3}
              vectorEffect="non-scaling-stroke" strokeDasharray={active ? "0" : "1 1.5"} />
            <circle cx={(a.x + b.x) / 2} cy={(a.y + b.y) / 2} r="0.6" fill="#c9a14a" />
          </g>
        );
      })}
      {/* halo no líder */}
      <circle cx={leaderPt.x} cy={leaderPt.y} r="14" fill="none" stroke="#0e1116" strokeOpacity="0.08" vectorEffect="non-scaling-stroke" />
      <circle cx={leaderPt.x} cy={leaderPt.y} r="22" fill="none" stroke="#0e1116" strokeOpacity="0.05" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}