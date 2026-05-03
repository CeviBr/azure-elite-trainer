import { useEffect, useMemo, useState } from "react";
import { USERS, login, type AppUser, type UserId, loadEntries, daysSince } from "@/lib/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, Eye, EyeOff, ArrowRight, Crown, ChevronLeft, ChevronRight, Dumbbell, Skull, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import heroHooded from "@/assets/gang-hero-hooded.jpg";
import gangBack from "@/assets/gang-back.jpg";
import gangCrown from "@/assets/gang-crown.jpg";
import gangSoldier from "@/assets/gang-soldier.jpg";
import gangHood from "@/assets/gang-hood.jpg";
import gangKing from "@/assets/gang-king.jpg";
import gangFearNoEvil from "@/assets/gang-fearnoevil.jpg";
import gangMonk from "@/assets/gang-monk.jpg";
import gangPistola from "@/assets/gang-pistola.jpg";
import gangMoney from "@/assets/gang-money.jpg";

const PHRASES = [
  ["DISCIPLINA HOJE.", "FORÇA AMANHÃ.", "CONQUISTA SEMPRE."],
  ["TREINE EM SILÊNCIO.", "DEIXE OS RESULTADOS", "FAZEREM BARULHO."],
  ["MENTE FORTE.", "CORPO FORJADO.", "MISSÃO CLARA."],
  ["NÃO É SORTE.", "É REPETIÇÃO.", "É GANGST3R."],
];

type Member = {
  id: string; name: string; image: string;
  level: "ELITE" | "AVANÇADO" | "INTERMEDIÁRIO";
  treinos: number; seguidores: string;
  isLeader?: boolean; realId?: UserId; locked?: boolean;
};

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

  const realLeader = USERS.find((u) => u.role === "leader")!;
  const realFabio = USERS.find((u) => u.id === "fabio")!;
  const realWilliam = USERS.find((u) => u.id === "william")!;

  const sel = selected ? USERS.find((u) => u.id === selected) : realLeader;
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

  const members: Member[] = [
    { id: realLeader.id, realId: realLeader.id, name: "LÍDER", image: gangCrown, level: "ELITE", treinos: 342, seguidores: "1.234", isLeader: true },
    { id: realFabio.id, realId: realFabio.id, name: "SHADOW", image: gangSoldier, level: "AVANÇADO", treinos: 248, seguidores: "987" },
    { id: realWilliam.id, realId: realWilliam.id, name: "RAZOR", image: gangHood, level: "AVANÇADO", treinos: 267, seguidores: "856" },
    { id: "ghost", name: "GHOST", image: gangFearNoEvil, level: "ELITE", treinos: 310, seguidores: "1.102", locked: true },
    { id: "venom", name: "VENOM", image: gangKing, level: "AVANÇADO", treinos: 275, seguidores: "889", locked: true },
    { id: "ice", name: "ICE", image: gangMonk, level: "INTERMEDIÁRIO", treinos: 248, seguidores: "765", locked: true },
    { id: "brutal", name: "BRUTAL", image: gangPistola, level: "ELITE", treinos: 320, seguidores: "1.340", locked: true },
    { id: "killa", name: "KILLA", image: gangSoldier, level: "AVANÇADO", treinos: 290, seguidores: "934", locked: true },
    { id: "maligno", name: "MALIGNO", image: gangHood, level: "ELITE", treinos: 305, seguidores: "1.015", locked: true },
  ];

  return (
    <div
      className="min-h-screen w-full bg-[#0d0d0d] text-zinc-100 font-sans"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04), transparent 60%), url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ============ TOP BLOCK ============ */}
        <section className="relative border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black overflow-hidden">
          {/* faded graffiti behind */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none">
            <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }} className="text-[18rem] font-black tracking-tighter text-white blur-[1px]">GANGST3R</span>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-8 min-h-[480px]">
            {/* LEFT — login */}
            <div className="md:col-span-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="h-3 w-3 text-zinc-300" />
                </div>
                <h1
                  style={{ fontFamily: "'Permanent Marker', 'Bebas Neue', Impact, sans-serif" }}
                  className="text-4xl sm:text-5xl font-black tracking-wide text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]"
                >
                  GANGST3R
                </h1>
                <p className="mt-1 text-[10px] tracking-[0.4em] text-zinc-500">№ {entryNumber} · CHECK-IN</p>
              </div>

              <div className="my-6">
                <h2 className="text-2xl sm:text-3xl font-black uppercase leading-[1.05] text-white">
                  OLÁ, {sel?.name.toUpperCase()}.
                </h2>
                <p className="mt-2 text-zinc-400 uppercase text-sm tracking-wide">
                  Que bom você<br />por aqui novamente.
                </p>
              </div>

              <div className="space-y-3 max-w-xs">
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder="SENHA"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    className="h-11 rounded-none bg-zinc-900/60 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 tracking-[0.3em] uppercase text-xs focus-visible:ring-0 focus-visible:border-zinc-400"
                  />
                  <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <button
                  onClick={submit}
                  className="w-full h-12 bg-zinc-200 text-black uppercase tracking-[0.3em] text-xs font-black flex items-center justify-center gap-3 hover:bg-white transition shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)]"
                >
                  LIBERAR ACESSO <ArrowRight className="h-4 w-4" />
                </button>
                <p className="flex items-start gap-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500 leading-relaxed pt-1">
                  <Lock className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>FOCO. DISCIPLINA. CONSTÂNCIA.</span>
                </p>
              </div>
            </div>

            {/* CENTER — hero */}
            <div className="md:col-span-5 relative flex items-center justify-center">
              <img
                src={heroHooded}
                alt="Ganst3r"
                className="max-h-[460px] object-contain"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))" }}
              />
            </div>

            {/* RIGHT — phrase + previews */}
            <div className="md:col-span-3 flex flex-col justify-between">
              <div className="text-right">
                {phrase.map((line, i) => (
                  <p key={i} className="text-lg sm:text-xl font-black uppercase leading-tight text-white">{line}</p>
                ))}
                <div className="mt-3 ml-auto h-px w-24 bg-zinc-600" />
              </div>

              <div className="mt-6 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square overflow-hidden border border-zinc-800">
                    <img src={heroHooded} alt="" className="w-full h-full object-cover grayscale" loading="lazy" />
                  </div>
                  <div className="aspect-square overflow-hidden border border-zinc-800">
                    <img src={heroHooded} alt="" className="w-full h-full object-cover grayscale scale-x-[-1]" loading="lazy" />
                  </div>
                </div>
                <div className="text-right text-[10px] tracking-[0.3em] text-zinc-500">01 ──── 07</div>
                <div className="flex justify-end gap-1.5">
                  <span className="h-2 w-2 bg-zinc-300" />
                  <span className="h-2 w-2 border border-zinc-600" />
                  <span className="h-2 w-2 border border-zinc-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ MEMBROS ============ */}
        <section className="relative border border-zinc-800 bg-gradient-to-b from-black to-zinc-950 p-5 sm:p-8">
          {/* header */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <h3
              style={{ fontFamily: "'Permanent Marker', 'Bebas Neue', Impact, sans-serif" }}
              className="text-3xl sm:text-4xl font-black tracking-wide text-white"
            >
              MEMBROS
            </h3>

            <div className="flex items-center gap-6 text-center text-zinc-400">
              <div className="flex flex-col items-center">
                <Dumbbell className="h-5 w-5" />
                <span className="text-[9px] tracking-[0.25em] mt-1">TREINAMOS<br />JUNTOS</span>
              </div>
              <div className="flex flex-col items-center">
                <Skull className="h-5 w-5" />
                <span className="text-[9px] tracking-[0.25em] mt-1">EVOLUÍMOS<br />JUNTOS</span>
              </div>
              <div className="flex flex-col items-center">
                <Crown className="h-5 w-5" />
                <span className="text-[9px] tracking-[0.25em] mt-1">VENCEMOS<br />JUNTOS</span>
              </div>
            </div>

            <button className="text-[10px] uppercase tracking-[0.3em] text-zinc-300 border border-zinc-700 px-3 py-1.5 flex items-center gap-2 hover:border-zinc-400">
              FILTRAR <SlidersHorizontal className="h-3 w-3" />
            </button>
          </div>

          {/* grid with chevrons */}
          <div className="relative">
            <button className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 z-10">
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 z-10">
              <ChevronRight className="h-7 w-7" />
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[210px] gap-3 sm:gap-4">
              {members.map((m) => {
                const big = m.isLeader;
                return (
                  <MemberCard
                    key={m.id}
                    member={m}
                    big={big}
                    onOpen={() => m.realId && setProfileOpen(m.realId)}
                    onSelect={() => m.realId && setSelected(m.realId)}
                  />
                );
              })}
            </div>

            <div className="flex justify-center gap-1.5 mt-6">
              <span className="h-1.5 w-6 bg-zinc-300" />
              <span className="h-1.5 w-1.5 bg-zinc-700 rounded-full" />
              <span className="h-1.5 w-1.5 bg-zinc-700 rounded-full" />
            </div>
          </div>
        </section>

        {/* ============ MANIFESTO ============ */}
        <section className="relative border border-zinc-800 bg-black overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center min-h-[280px]">
            <div className="p-6 sm:p-8 z-10">
              <p
                style={{ fontFamily: "'Permanent Marker', cursive" }}
                className="text-2xl sm:text-3xl font-black uppercase leading-tight text-white"
              >
                TREINE EM SILÊNCIO.<br />DEIXE SEUS RESULTADOS<br />FAZEREM BARULHO.
              </p>
            </div>

            <div className="relative h-[280px] md:h-full">
              <img src={gangBack} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  style={{ fontFamily: "'Permanent Marker', cursive" }}
                  className="text-3xl sm:text-4xl font-black tracking-wider text-white/80 drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]"
                >
                  GANGST3R
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 text-right z-10">
              <p
                style={{ fontFamily: "'Permanent Marker', cursive" }}
                className="text-2xl sm:text-3xl font-black uppercase leading-tight text-white"
              >
                MENTE FORTE.<br />CORPO FORJADO.<br />MISSÃO CLARA.
              </p>
              <div className="mt-4 flex justify-end items-center gap-2 text-zinc-500">
                <Dumbbell className="h-4 w-4" />
                <Skull className="h-4 w-4" />
                <Dumbbell className="h-4 w-4" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* google fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Bebas+Neue&display=swap" rel="stylesheet" />

      {/* Profile modal */}
      <Dialog open={!!profile} onOpenChange={(v) => !v && setProfileOpen(null)}>
        <DialogContent className="max-w-sm rounded-none bg-zinc-950 border border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400">
              FICHA — ATLETA
            </DialogTitle>
          </DialogHeader>
          {profile && (
            <div className="space-y-5">
              <div className="aspect-square overflow-hidden border border-zinc-800">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover grayscale contrast-125" />
              </div>
              <div>
                <h3 className="font-black uppercase text-2xl flex items-center gap-2 text-white">
                  {profile.name} {profile.role === "leader" && <Crown className="h-4 w-4 text-zinc-300" />}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  {profile.role === "leader" ? "LÍDER · TIME GANGST3R" : "ATLETA · TIME FABRÍCIO"}
                </p>
              </div>
              <div className="grid grid-cols-3 border-y border-zinc-800 divide-x divide-zinc-800 text-center">
                <Stat label="CHECK-INS" value={entries.byUser[profile.id]?.length ?? 0} />
                <Stat label="DIAS" value={daysSince(entries.firstSeen[profile.id])} />
                <Stat label="ÚLTIMA" value={fmtRel(entries.byUser[profile.id]?.slice(-1)[0])} />
              </div>
              <Button
                onClick={() => { setProfileOpen(null); setSelected(profile.id); }}
                className="w-full rounded-none bg-zinc-200 hover:bg-white text-black uppercase tracking-[0.3em] text-xs font-black h-11"
              >
                LIBERAR ACESSO →
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MemberCard({ member, big, onOpen, onSelect }: { member: Member; big?: boolean; onOpen: () => void; onSelect: () => void }) {
  const locked = member.locked;
  return (
    <button
      onClick={onOpen}
      onDoubleClick={onSelect}
      disabled={locked}
      className={`group relative overflow-hidden border border-zinc-800 bg-zinc-950 text-left transition-all
        ${big ? "col-span-2 row-span-2" : ""}
        ${locked ? "opacity-70 cursor-not-allowed" : "hover:border-zinc-500 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)]"}
      `}
    >
      <img
        src={member.image}
        alt={member.name}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover grayscale contrast-110 ${locked ? "blur-[1px]" : "group-hover:scale-105"} transition duration-700`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* corner accents */}
      <span className="absolute top-2 left-2 h-3 w-3 border-t border-l border-zinc-300/60" />
      <span className="absolute top-2 right-2 h-3 w-3 border-t border-r border-zinc-300/60" />

      {/* leader crown */}
      {member.isLeader && (
        <Crown className="absolute top-3 right-3 h-5 w-5 text-zinc-200 fill-zinc-200/80" />
      )}

      {/* content bottom */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4">
        <p
          style={{ fontFamily: "'Permanent Marker', cursive" }}
          className={`${big ? "text-4xl" : "text-2xl"} font-black tracking-wide text-white leading-none`}
        >
          {member.name}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] tracking-[0.2em] text-zinc-300 uppercase">
          <div>
            <p className="text-zinc-500">TREINOS</p>
            <p className="text-white font-bold text-sm">{member.treinos}</p>
          </div>
          <div>
            <p className="text-zinc-500">SEGUIDORES</p>
            <p className="text-white font-bold text-sm">{member.seguidores}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[9px] tracking-[0.25em] uppercase">
          <div>
            <p className="text-zinc-500">NÍVEL</p>
            <p className="text-white font-bold">{member.level}</p>
          </div>
          <Skull className="h-4 w-4 text-zinc-400" />
        </div>
        {/* progress bar */}
        <div className="mt-2 h-0.5 w-full bg-zinc-800">
          <div
            className="h-full bg-zinc-300"
            style={{ width: `${member.level === "ELITE" ? 92 : member.level === "AVANÇADO" ? 70 : 50}%` }}
          />
        </div>
      </div>

      {locked && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[8px] tracking-[0.3em] border border-red-500/70 text-red-400 px-1.5 py-0.5 font-bold flex items-center gap-1 bg-black/60">
            <Lock className="h-2.5 w-2.5" /> NEGADO
          </span>
        </div>
      )}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="py-3">
      <p className="font-black text-2xl text-white">{value}</p>
      <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 mt-1">{label}</p>
    </div>
  );
}

function fmtRel(ts?: number) {
  if (!ts) return "—";
  const d = daysSince(ts);
  if (d === 0) return "HOJE";
  return `${d}D`;
}
