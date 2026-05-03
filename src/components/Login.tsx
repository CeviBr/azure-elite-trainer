import { useEffect, useMemo, useState } from "react";
import { USERS, login, type AppUser, type UserId, loadEntries, daysSince } from "@/lib/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, Eye, EyeOff, ArrowRight, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import sketchHero from "@/assets/sketch-hero.png";
import sketchMountain from "@/assets/sketch-mountain.png";
import gangFearNoEvil from "@/assets/gang-fearnoevil.jpg";
import gangCollage from "@/assets/gang-collage.jpg";
import gangMoney from "@/assets/gang-money.jpg";
import gangKing from "@/assets/gang-king.jpg";
import gangHood from "@/assets/gang-hood.jpg";
import gangPistola from "@/assets/gang-pistola.jpg";
import gangSoldier from "@/assets/gang-soldier.jpg";
import gangCrown from "@/assets/gang-crown.jpg";
import gangMonk from "@/assets/gang-monk.jpg";

const PHRASES = [
  ["DISCIPLINA HOJE.", "FORÇA AMANHÃ.", "CONQUISTA SEMPRE."],
  ["TREINE EM SILÊNCIO.", "DEIXE OS RESULTADOS", "FAZEREM BARULHO."],
  ["MENTE FORTE.", "CORPO FORJADO.", "MISSÃO CLARA."],
  ["NÃO É SORTE.", "É REPETIÇÃO.", "É GANST3R."],
];

export default function Login({ onLogin }: { onLogin: (u: AppUser) => void }) {
  const [selected, setSelected] = useState<UserId | null>(null);
  const [profileOpen, setProfileOpen] = useState<UserId | null>(null);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(() => Math.floor(Math.random() * PHRASES.length));
  const entries = useMemo(loadEntries, [selected, profileOpen]);

  useEffect(() => {
    const t = setInterval(() => setPhraseIdx((i) => (i + 1) % PHRASES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const sel = selected ? USERS.find((u) => u.id === selected) : USERS.find((u) => u.role === "leader")!;
  const profile = USERS.find((u) => u.id === profileOpen);
  const entryNumber = String(entries.total).padStart(3, "0");
  const nextEntry = String(entries.total + 1).padStart(3, "0");

  const submit = () => {
    if (!sel) return;
    const u = login(sel.name, password);
    if (u) {
      toast.success(`Check-in Nº ${nextEntry} — ${u.name}`);
      onLogin(u);
    } else {
      toast.error("Senha incorreta");
      setPassword("");
    }
  };

  const phrase = PHRASES[phraseIdx];
  const ordered = [...USERS].sort((a, b) => (a.role === "leader" ? -1 : 1));

  // Membros premium — só 3 reais têm acesso. Os demais são "candidatos" visuais.
  type Member = {
    id: string; name: string; image: string; tag: string;
    rank: string; status: "ACTIVE" | "LOCKED" | "PENDING";
    realId?: UserId;
  };
  const realLeader = USERS.find((u) => u.role === "leader")!;
  const realFabio = USERS.find((u) => u.id === "fabio")!;
  const realWilliam = USERS.find((u) => u.id === "william")!;
  const members: Member[] = [
    { id: realLeader.id, name: realLeader.name.toUpperCase(), image: gangCrown, tag: "EL JEFE", rank: "01", status: "ACTIVE", realId: realLeader.id },
    { id: realFabio.id, name: realFabio.name.toUpperCase(), image: gangSoldier, tag: "SOLDADO", rank: "02", status: "ACTIVE", realId: realFabio.id },
    { id: realWilliam.id, name: realWilliam.name.toUpperCase(), image: gangHood, tag: "CAPOREGIME", rank: "03", status: "ACTIVE", realId: realWilliam.id },
    { id: "kane", name: "KANE", image: gangKing, tag: "ENFORCER", rank: "04", status: "LOCKED" },
    { id: "vito", name: "VITO", image: gangFearNoEvil, tag: "CONSIGLIERE", rank: "05", status: "PENDING" },
    { id: "raven", name: "RAVEN", image: gangMonk, tag: "SHADOW", rank: "06", status: "LOCKED" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#e9e6df] text-zinc-900 font-mono"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 10%, rgba(0,0,0,0.04), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.05), transparent 50%), url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {/* OUTER FRAME */}
        <div className="border-2 border-zinc-900 p-4 sm:p-8 space-y-0">

          {/* TOP SECTION — login + hero + phrase */}
          <div className="border-b-2 border-zinc-900 pb-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-mono text-xl sm:text-2xl font-black tracking-tight">GANGST3R<span className="text-zinc-500">.</span></h1>
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">№ {entryNumber} · CHECK-IN</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* LEFT — login */}
              <div className="space-y-5">
                <h2 className="text-2xl sm:text-3xl font-black uppercase leading-tight">
                  OLÁ, {sel?.name.toUpperCase()}.<br />
                  <span className="font-normal text-zinc-700 text-xl sm:text-2xl">QUE BOM VOCÊ<br />POR AQUI NOVAMENTE.</span>
                </h2>

                <div className="space-y-3 max-w-xs">
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="SENHA"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submit()}
                      className="h-11 rounded-none bg-transparent border-2 border-zinc-900 text-zinc-900 placeholder:text-zinc-600 tracking-[0.25em] uppercase text-xs focus-visible:ring-0 focus-visible:border-zinc-900"
                    />
                    <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <button onClick={submit} className="w-full h-11 bg-zinc-900 text-[#e9e6df] uppercase tracking-[0.3em] text-xs font-bold flex items-center justify-center gap-3 hover:bg-black transition">
                    LIBERAR ACESSO <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="flex items-start gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-700 leading-relaxed">
                    <Lock className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>FOCO. DISCIPLINA. CONSTÂNCIA.<br />O RESTO É CONSEQUÊNCIA.</span>
                  </p>
                </div>
              </div>

              {/* CENTER — hero sketch */}
              <div className="flex items-center justify-center relative">
                <img src={sketchHero} alt="Ganst3r" className="max-h-72 object-contain mix-blend-multiply" />
              </div>

              {/* RIGHT — phrase + small previews */}
              <div className="space-y-4">
                <div className="text-right">
                  {phrase.map((line, i) => (
                    <p key={i} className="text-lg sm:text-xl font-black uppercase leading-tight">{line}</p>
                  ))}
                </div>
                <div className="flex justify-end items-end gap-3">
                  <img src={sketchHero} alt="" className="h-20 opacity-40 mix-blend-multiply" loading="lazy" />
                  <img src={sketchHero} alt="" className="h-20 opacity-40 mix-blend-multiply scale-x-[-1]" loading="lazy" />
                </div>
                <div className="flex justify-end items-center gap-2 text-[10px] tracking-[0.3em] text-zinc-700">
                  01 ──── 0{ordered.length}
                </div>
                <div className="flex justify-end gap-1">
                  <span className="h-2 w-2 bg-zinc-900" /><span className="h-2 w-2 border border-zinc-900" /><span className="h-2 w-2 border border-zinc-900" />
                </div>
              </div>
            </div>
          </div>

          {/* LA FAMIGLIA — premium gangster roster */}
          <div className="relative -mx-4 sm:-mx-8 mb-6 bg-black text-zinc-100 border-y-2 border-zinc-900">
            {/* film grain overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-overlay"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")` }} />
            <div className="relative px-4 sm:px-8 py-8">
              <div className="flex items-end justify-between mb-6 border-b border-amber-500/30 pb-4">
                <div>
                  <p className="text-[10px] tracking-[0.4em] text-amber-400/80 mb-1">— LA FAMIGLIA —</p>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                    A <span className="italic font-serif text-amber-400">família</span> não negocia.
                  </h3>
                </div>
                <div className="text-right text-[10px] tracking-[0.3em] text-zinc-400 hidden sm:block">
                  ROSTER · CONFIDENCIAL<br />
                  <span className="text-amber-400">03 ATIVOS</span> · 03 EM ESPERA
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                {members.map((m) => {
                  const active = m.status === "ACTIVE";
                  const realCount = m.realId ? (entries.byUser[m.realId]?.length ?? 0) : 0;
                  return (
                    <button
                      key={m.id}
                      disabled={!active}
                      onClick={() => m.realId && setProfileOpen(m.realId)}
                      onDoubleClick={() => m.realId && setSelected(m.realId)}
                      className={`group relative overflow-hidden border ${active ? "border-amber-500/50 hover:border-amber-400" : "border-zinc-700/60"} bg-zinc-950 transition-all ${active ? "hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)]" : "opacity-60 cursor-not-allowed"}`}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img src={m.image} alt={m.name} className={`w-full h-full object-cover transition duration-700 ${active ? "grayscale group-hover:grayscale-0 group-hover:scale-105" : "grayscale blur-[2px]"}`} />
                        {/* gradient bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        {/* corner gold accents */}
                        <span className="absolute top-2 left-2 h-3 w-3 border-t border-l border-amber-400" />
                        <span className="absolute top-2 right-2 h-3 w-3 border-t border-r border-amber-400" />
                        <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-amber-400" />
                        <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-amber-400" />
                        {/* rank */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.4em] text-amber-400/90 font-bold">
                          № {m.rank}
                        </div>
                        {/* status badge */}
                        <div className="absolute top-3 right-3 z-10">
                          {active ? (
                            <span className="text-[8px] tracking-[0.3em] bg-amber-400 text-black px-1.5 py-0.5 font-bold">ATIVO</span>
                          ) : m.status === "PENDING" ? (
                            <span className="text-[8px] tracking-[0.3em] bg-zinc-100 text-black px-1.5 py-0.5 font-bold">ESPERA</span>
                          ) : (
                            <span className="text-[8px] tracking-[0.3em] border border-red-500/70 text-red-400 px-1.5 py-0.5 font-bold flex items-center gap-1">
                              <Lock className="h-2.5 w-2.5" /> NEGADO
                            </span>
                          )}
                        </div>
                        {/* name block */}
                        <div className="absolute bottom-0 inset-x-0 p-3">
                          <p className="text-[9px] tracking-[0.3em] text-amber-400/80">{m.tag}</p>
                          <p className="text-lg font-black uppercase tracking-wider flex items-center gap-1.5 leading-tight">
                            {m.name}
                            {m.id === realLeader.id && <Crown className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
                          </p>
                          {active && (
                            <div className="mt-2 flex items-center justify-between text-[9px] tracking-[0.2em] text-zinc-300 border-t border-amber-400/20 pt-1.5">
                              <span>CHECK-INS <span className="text-amber-400 font-bold">{realCount + 47}</span></span>
                              <span className="text-amber-400">→</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-6 text-center text-[10px] tracking-[0.4em] text-zinc-500">
                — RESPECT IS EARNED · NOT GIVEN —
              </p>
            </div>
          </div>

          {/* BOTTOM SECTION — manifesto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
            <div className="space-y-4">
              <div className="font-black uppercase text-sm leading-tight">
                <p>TREINE EM SILÊNCIO.</p>
                <p>DEIXE SEUS RESULTADOS</p>
                <p>FAZEREM BARULHO.</p>
              </div>
              <div className="font-black uppercase text-sm leading-tight pt-2">
                <p>MENTE FORTE.</p>
                <p>CORPO FORJADO.</p>
                <p>MISSÃO CLARA.</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img src={sketchMountain} alt="" className="max-h-32 object-contain mix-blend-multiply" loading="lazy" />
            </div>
            <div className="text-right space-y-2">
              <p className="text-2xl">💀</p>
              <div className="font-black uppercase text-xs leading-tight">
                <p>NÃO É SORTE.</p>
                <p>É REPETIÇÃO.</p>
                <p>É GANGST3R.</p>
              </div>
              <div className="flex justify-end mt-3">
                <div className="flex gap-px">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} className="bg-zinc-900" style={{ width: i % 3 ? 1 : 2, height: 22 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile modal */}
      <Dialog open={!!profile} onOpenChange={(v) => !v && setProfileOpen(null)}>
        <DialogContent className="max-w-sm rounded-none bg-[#e9e6df] border-2 border-zinc-900 text-zinc-900 font-mono">
          <DialogHeader>
            <DialogTitle className="text-[10px] uppercase tracking-[0.3em] font-black">
              FICHA — ATLETA
            </DialogTitle>
          </DialogHeader>
          {profile && (
            <div className="space-y-5">
              <div className="aspect-square overflow-hidden border-2 border-zinc-900">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover grayscale contrast-125" />
              </div>
              <div>
                <h3 className="font-black uppercase text-2xl flex items-center gap-2">
                  {profile.name} {profile.role === "leader" && <Crown className="h-4 w-4" />}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-700">
                  {profile.role === "leader" ? "LÍDER · TIME GANGST3R" : "ATLETA · TIME FABRÍCIO"}
                </p>
              </div>
              <div className="grid grid-cols-3 border-y-2 border-zinc-900 divide-x-2 divide-zinc-900 text-center">
                <Stat label="CHECK-INS" value={entries.byUser[profile.id]?.length ?? 0} />
                <Stat label="DIAS" value={daysSince(entries.firstSeen[profile.id])} />
                <Stat label="ÚLTIMA" value={fmtRel(entries.byUser[profile.id]?.slice(-1)[0])} />
              </div>
              <Button
                onClick={() => { setProfileOpen(null); setSelected(profile.id); }}
                className="w-full rounded-none bg-zinc-900 hover:bg-black text-[#e9e6df] uppercase tracking-[0.3em] text-xs font-bold h-11">
                LIBERAR ACESSO →
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
      <p className="font-black text-2xl">{value}</p>
      <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-700 mt-1">{label}</p>
    </div>
  );
}

function fmtRel(ts?: number) {
  if (!ts) return "—";
  const d = daysSince(ts);
  if (d === 0) return "HOJE";
  return `${d}D`;
}
