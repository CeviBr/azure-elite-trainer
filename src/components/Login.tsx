import { useEffect, useMemo, useState } from "react";
import { USERS, login, type AppUser, type UserId, loadEntries, daysSince } from "@/lib/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, X, Crown } from "lucide-react";
import { toast } from "sonner";
import bgStatue from "@/assets/bg-statue.jpg";
import bgFear from "@/assets/bg-fearnoevil.jpg";
import bgCollage from "@/assets/bg-collage.jpg";
import bgKing from "@/assets/bg-king.jpg";
import bgCrown from "@/assets/bg-crown.jpg";
import bgSoldier from "@/assets/bg-soldier.jpg";

const BACKGROUNDS = [bgStatue, bgFear, bgCollage, bgKing, bgCrown, bgSoldier];
const PHRASES = [
  "O ferro não mente. A repetição revela.",
  "Body of an athlete. Mind of a stoic.",
  "Disciplina pesa menos que arrependimento.",
  "Fear no evil. Treine como se devesse.",
  "Conquer. Dominate. Repeat.",
  "Sem atalho. Só série, descanso e progresso.",
  "Forjado em silêncio, exibido em ação.",
  "I refuse to lose. This chapter is called my turn.",
];

export default function Login({ onLogin }: { onLogin: (u: AppUser) => void }) {
  const [selected, setSelected] = useState<UserId | null>(null);
  const [profileOpen, setProfileOpen] = useState<UserId | null>(null);
  const [password, setPassword] = useState("");
  const [bgIndex, setBgIndex] = useState(() => Math.floor(Math.random() * BACKGROUNDS.length));
  const [phrase] = useState(() => PHRASES[Math.floor(Math.random() * PHRASES.length)]);
  const entries = useMemo(loadEntries, [selected, profileOpen]);

  useEffect(() => {
    const t = setInterval(() => setBgIndex((i) => (i + 1) % BACKGROUNDS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const sel = USERS.find((u) => u.id === selected);
  const profile = USERS.find((u) => u.id === profileOpen);
  const entryNumber = String(entries.total).padStart(3, "0");
  const nextEntry = String(entries.total + 1).padStart(3, "0");

  const submit = () => {
    if (!sel) return;
    const u = login(sel.name, password);
    if (u) {
      toast.success(`Check-in Nº ${nextEntry} — ${u.name} no ginásio`);
      onLogin(u);
    } else {
      toast.error("Senha incorreta");
      setPassword("");
    }
  };

  // ordena: líder primeiro
  const ordered = [...USERS].sort((a, b) => (a.role === "leader" ? -1 : 1));

  return (
    <div className="relative min-h-screen text-zinc-200 font-mono overflow-hidden bg-black">
      {/* Rotating background */}
      <div className="absolute inset-0">
        {BACKGROUNDS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1800ms] ease-in-out ${
              i === bgIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* contrast overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-12 pt-6 text-[10px] uppercase tracking-[0.3em]">
        <span className="flex items-center gap-2 text-lime-400">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
          Acesso Restrito · Ginásio
        </span>
        <span className="text-zinc-500">Ganst3r · Iron Vol. 01</span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col px-6 sm:px-12 lg:px-16 py-10 min-h-[calc(100vh-3rem)]">
        <div className="flex-1 max-w-md w-full flex flex-col">
          {!sel ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.4em] text-lime-400">
                № {entryNumber} — Check-in
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl mt-4 leading-none text-white">
                Ganst<span className="italic font-light text-zinc-400">3</span>r
              </h1>
              <p className="text-zinc-300 text-sm mt-4 max-w-sm leading-relaxed italic">
                "{phrase}"
              </p>
              <p className="text-zinc-500 text-xs mt-3 max-w-sm leading-relaxed">
                Plano de treino da equipe. Selecione seu nome para registrar o check-in da sessão.
              </p>

              {/* Members — round avatars with neural lines */}
              <div className="mt-10">
                <div className="relative flex items-center justify-between gap-2">
                  {/* connecting line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <line x1="50" y1="50" x2="14" y2="50" stroke="#84cc16" strokeOpacity="0.4" strokeWidth="0.3" strokeDasharray="1 1.5" vectorEffect="non-scaling-stroke" />
                    <line x1="50" y1="50" x2="86" y2="50" stroke="#84cc16" strokeOpacity="0.4" strokeWidth="0.3" strokeDasharray="1 1.5" vectorEffect="non-scaling-stroke" />
                  </svg>
                  {ordered.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setProfileOpen(u.id)}
                      onDoubleClick={() => setSelected(u.id)}
                      className={`relative group ${u.role === "leader" ? "order-2" : ""}`}
                    >
                      <span className={`block rounded-full overflow-hidden ring-2 transition-all
                        ${u.role === "leader"
                          ? "h-28 w-28 ring-lime-400 shadow-[0_0_30px_rgba(132,204,22,0.35)]"
                          : "h-20 w-20 ring-zinc-700 group-hover:ring-lime-400"}`}>
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition" />
                      </span>
                      {u.role === "leader" && (
                        <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-lime-400 text-black flex items-center justify-center">
                          <Crown className="h-3 w-3" />
                        </span>
                      )}
                      <p className="text-center mt-2 text-[10px] uppercase tracking-[0.25em] text-zinc-300">{u.name}</p>
                      <p className="text-center text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                        {u.role === "leader" ? "Coach" : "Atleta"}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 text-center mt-4">
                  toque para o perfil · 2× para treinar
                </p>
              </div>

              {/* bg indicator */}
              <div className="mt-10 flex gap-1.5">
                {BACKGROUNDS.map((_, i) => (
                  <span key={i} className={`h-0.5 transition-all ${i === bgIndex ? "w-6 bg-lime-400" : "w-3 bg-zinc-700"}`} />
                ))}
              </div>

              <div className="mt-auto pt-10 text-[10px] uppercase tracking-[0.3em] text-zinc-500 flex justify-between">
                <span>Ganst3r Training</span>
                <span>Iron Edition</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.4em] text-lime-400">
                  № {nextEntry} — Check-in
                </p>
                <button onClick={() => { setSelected(null); setPassword(""); }} className="text-zinc-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl mt-4 leading-none text-white">
                Iron<span className="italic font-light text-zinc-400">/Lock</span>
              </h1>
              <p className="text-zinc-400 text-sm mt-4 max-w-sm leading-relaxed">
                O treino é pessoal. Insira a senha de <span className="text-white">{sel.name}</span> para liberar o ficha de hoje.
              </p>

              <div className="flex items-center gap-4 mt-8">
                <span className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-lime-400">
                  <img src={sel.avatar} alt={sel.name} className="w-full h-full object-cover" />
                </span>
                <div>
                  <p className="font-serif text-2xl text-white">{sel.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-1">
                    {sel.role === "leader" && <Crown className="h-3 w-3 text-lime-400" />}
                    {sel.role === "leader" ? "Coach do time" : "Atleta · time Fabrício"}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    autoFocus
                    type="password"
                    placeholder="Digite a senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    className="pl-11 h-14 rounded-none bg-black/40 backdrop-blur border border-zinc-700 text-white tracking-[0.2em] placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:border-lime-400"
                  />
                </div>
                <Button onClick={submit}
                  className="mt-3 w-full h-14 rounded-none bg-lime-600 hover:bg-lime-500 text-black uppercase tracking-[0.4em] text-xs font-bold">
                  Iniciar treino
                </Button>
              </div>

              <div className="mt-auto pt-10 text-[10px] uppercase tracking-[0.3em] text-zinc-500 flex justify-between">
                <span>Iron Lock</span>
                <span>Sessão segura</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile modal */}
      <Dialog open={!!profile} onOpenChange={(v) => !v && setProfileOpen(null)}>
        <DialogContent className="max-w-sm rounded-none bg-zinc-950 border-zinc-800 text-zinc-200 font-mono">
          <DialogHeader>
            <DialogTitle className="text-[10px] uppercase tracking-[0.3em] font-normal text-lime-400">
              Ficha — Atleta
            </DialogTitle>
          </DialogHeader>
          {profile && (
            <div className="space-y-5">
              <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden ring-2 ring-lime-400 shadow-[0_0_40px_rgba(132,204,22,0.3)]">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                {profile.role === "leader" && (
                  <span className="absolute top-2 right-2 h-7 w-7 rounded-full bg-lime-400 text-black flex items-center justify-center">
                    <Crown className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <div className="text-center">
                <h3 className="font-serif text-3xl text-white">{profile.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] mt-1 text-zinc-500">
                  {profile.role === "leader" ? "Coach · Time Ganst3r" : "Atleta · Time Fabrício"}
                </p>
              </div>
              <div className="grid grid-cols-3 border-y border-zinc-800 divide-x divide-zinc-800 text-center">
                <Stat label="Check-ins" value={entries.byUser[profile.id]?.length ?? 0} />
                <Stat label="Dias" value={daysSince(entries.firstSeen[profile.id])} />
                <Stat label="Última" value={fmtRel(entries.byUser[profile.id]?.slice(-1)[0])} />
              </div>
              <Button
                onClick={() => { setProfileOpen(null); setSelected(profile.id); }}
                className="w-full rounded-none bg-lime-600 hover:bg-lime-500 text-black uppercase tracking-[0.3em] text-xs font-bold h-12">
                Iniciar treino
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
      <p className="font-serif text-2xl text-white">{value}</p>
      <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600 mt-1">{label}</p>
    </div>
  );
}

function fmtRel(ts?: number) {
  if (!ts) return "—";
  const d = daysSince(ts);
  if (d === 0) return "hoje";
  return `${d}d`;
}
