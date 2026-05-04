import { useEffect, useMemo, useState } from "react";
import { USERS, login, type AppUser, type UserId, loadEntries, daysSince, streakDays, getSession, findByNickname, getLastNickname, setLastNickname } from "@/lib/users";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, Eye, EyeOff, ArrowRight, Crown, ChevronLeft, ChevronRight, Dumbbell, Skull, Flame } from "lucide-react";
import { toast } from "sonner";

import mLeader from "@/assets/m-leader.png";
import mShadow from "@/assets/m-shadow.png";
import mRazor from "@/assets/m-razor.png";
import mGhost from "@/assets/m-ghost.png";
import footerBack from "@/assets/footer-back.png";

const PHRASES = [
  ["DISCIPLINA HOJE.", "FORÇA AMANHÃ.", "CONQUISTA SEMPRE."],
  ["TREINE EM SILÊNCIO.", "DEIXE OS RESULTADOS", "FAZEREM BARULHO."],
  ["MENTE FORTE.", "CORPO FORJADO.", "MISSÃO CLARA."],
  ["NÃO É SORTE.", "É REPETIÇÃO.", "É GANGST3R."],
];

type Member = {
  id: string; name: string; image: string;
  level: "ELITE" | "AVANÇADO" | "INTERMEDIÁRIO";
  treinos: number; seguidores: string; streak: number; lastDays: number;
  isLeader?: boolean; realId?: UserId; locked?: boolean; bio: string;
};

export default function Login({ onLogin }: { onLogin: (u: AppUser) => void }) {
  const session = getSession();
  const [profileOpen, setProfileOpen] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const lastNick = getLastNickname();
  const initialNick = session?.nickname ?? lastNick ?? "";
  const [nickInput, setNickInput] = useState(initialNick);
  const [recognized, setRecognized] = useState<AppUser | null>(
    initialNick ? findByNickname(initialNick) ?? null : null
  );
  const entries = useMemo(loadEntries, [profileOpen]);

  useEffect(() => {
    const t = setInterval(() => setPhraseIdx((i) => (i + 1) % PHRASES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const greetName = (recognized?.name ?? "ATLETA").toUpperCase();
  const entryNumber = String(entries.total).padStart(3, "0");
  const nextEntry = String(entries.total + 1).padStart(3, "0");

  const confirmNick = () => {
    const u = findByNickname(nickInput);
    if (u) {
      setRecognized(u);
      setLastNickname(u.nickname);
    } else {
      toast.error("Nickname não reconhecido");
    }
  };

  const submit = () => {
    if (!recognized) { confirmNick(); return; }
    const u = login(recognized.nickname, password);
    if (u) {
      toast.success(`Check-in Nº ${nextEntry} — ${u.name}`);
      onLogin(u);
    } else {
      toast.error("Senha incorreta");
      setPassword("");
    }
  };

  const realLeader = USERS.find((u) => u.role === "leader")!;
  const realFabio = USERS.find((u) => u.id === "fabio")!;
  const realWilliam = USERS.find((u) => u.id === "william")!;

  const phrase = PHRASES[phraseIdx];

  const members: Member[] = [
    { id: realLeader.id, realId: realLeader.id, name: realLeader.nickname.toUpperCase(), image: mLeader, level: "ELITE", treinos: 342 + (entries.byUser[realLeader.id]?.length ?? 0), seguidores: "1.234", streak: streakDays(entries.byUser[realLeader.id]), lastDays: daysSince(entries.byUser[realLeader.id]?.slice(-1)[0]), isLeader: true, bio: "Líder temporário. Comanda a operação com disciplina cirúrgica." },
    { id: realFabio.id, realId: realFabio.id, name: realFabio.nickname.toUpperCase(), image: mShadow, level: "AVANÇADO", treinos: 248 + (entries.byUser[realFabio.id]?.length ?? 0), seguidores: "987", streak: streakDays(entries.byUser[realFabio.id]), lastDays: daysSince(entries.byUser[realFabio.id]?.slice(-1)[0]), bio: "Silencioso. Letal. Sem desculpas." },
    { id: realWilliam.id, realId: realWilliam.id, name: realWilliam.nickname.toUpperCase(), image: mRazor, level: "AVANÇADO", treinos: 267 + (entries.byUser[realWilliam.id]?.length ?? 0), seguidores: "856", streak: streakDays(entries.byUser[realWilliam.id]), lastDays: daysSince(entries.byUser[realWilliam.id]?.slice(-1)[0]), bio: "Tiro certeiro. Cada repetição é uma marca." },
  ];

  const profile = members.find((m) => m.id === profileOpen);

  return (
    <div
      className="min-h-screen w-full bg-[#0a0a0a] text-zinc-100"
      style={{
        fontFamily: "'Archivo', 'Inter', system-ui, sans-serif",
        backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05), transparent 60%), url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Bebas+Neue&family=Anton&family=Archivo:wght@400;700;900&family=Special+Elite&display=swap" rel="stylesheet" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ============ TOP ============ */}
        <section className="relative border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07] select-none">
            <span style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-[14rem] sm:text-[20rem] font-black tracking-tighter text-white blur-[1px]">GANGST3R</span>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-8 min-h-[480px]">
            {/* LEFT */}
            <div className="md:col-span-4 flex flex-col justify-between gap-6">
              <div>
                <h1 style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-5xl sm:text-6xl font-black tracking-wide text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)] leading-none">
                  GANGST3R
                </h1>
                <p className="mt-2 text-[10px] tracking-[0.4em] text-zinc-500">№ {entryNumber} · CHECK-IN</p>
              </div>

              <div>
                <h2 style={{ fontFamily: "'Anton', Impact, sans-serif" }} className="text-3xl sm:text-4xl uppercase leading-[1.05] text-white tracking-wide">
                  OLÁ, <span className="text-zinc-300">{greetName}</span>.
                </h2>
                <p className="mt-2 text-zinc-400 uppercase text-xs sm:text-sm tracking-[0.2em]">
                  Que bom você<br />por aqui novamente.
                </p>
              </div>

              <div className="space-y-3 max-w-xs">
                {!recognized ? (
                  <Input
                    placeholder="NICKNAME"
                    value={nickInput}
                    onChange={(e) => setNickInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && confirmNick()}
                    className="h-11 rounded-none bg-zinc-900/60 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 tracking-[0.3em] uppercase text-xs focus-visible:ring-0 focus-visible:border-zinc-400"
                  />
                ) : (
                  <div className="flex items-center justify-between border border-zinc-700 bg-zinc-900/60 px-3 h-11">
                    <div>
                      <p className="text-[9px] tracking-[0.3em] text-zinc-500">NICKNAME</p>
                      <p className="text-xs tracking-[0.25em] text-zinc-100 font-bold uppercase">{recognized.nickname}</p>
                    </div>
                    <button onClick={() => { setRecognized(null); setPassword(""); }} className="text-[9px] tracking-[0.25em] text-zinc-400 hover:text-white">TROCAR</button>
                  </div>
                )}
                {recognized && (
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="SENHA"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submit()}
                      autoFocus
                      className="h-11 rounded-none bg-zinc-900/60 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 tracking-[0.3em] uppercase text-xs focus-visible:ring-0 focus-visible:border-zinc-400"
                    />
                    <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                )}
                <button
                  onClick={submit}
                  className="w-full h-12 bg-zinc-200 text-black uppercase tracking-[0.3em] text-xs font-black flex items-center justify-center gap-3 hover:bg-white transition shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)]"
                >
                  {recognized ? "LIBERAR ACESSO" : "RECONHECER"} <ArrowRight className="h-4 w-4" />
                </button>
                <p className="flex items-start gap-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500 leading-relaxed pt-1">
                  <Lock className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>FOCO. DISCIPLINA. CONSTÂNCIA.</span>
                </p>
              </div>
            </div>

            {/* CENTER hero */}
            <div className="md:col-span-5 relative flex items-center justify-center min-h-[300px]">
              <img
                src={mLeader}
                alt="Ganst3r"
                className="max-h-[460px] w-full object-contain animate-[float_6s_ease-in-out_infinite]"
                style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.9))" }}
              />
            </div>

            {/* RIGHT */}
            <div className="md:col-span-3 flex flex-col justify-between gap-6">
              <div className="text-right">
                <div className="inline-block min-h-[100px]" key={phraseIdx}>
                  {phrase.map((line, i) => (
                    <p key={i} style={{ fontFamily: "'Anton', Impact, sans-serif" }}
                       className="text-xl sm:text-2xl uppercase leading-tight text-white tracking-wide animate-[slideIn_.6s_ease-out_both]"
                       data-i={i}>
                      {line}
                    </p>
                  ))}
                </div>
                <div className="mt-3 ml-auto h-px w-24 bg-zinc-600" />
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square overflow-hidden border border-zinc-800">
                    <img src={mShadow} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition" />
                  </div>
                  <div className="aspect-square overflow-hidden border border-zinc-800">
                    <img src={mGhost} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition" />
                  </div>
                </div>
                <div className="text-right text-[10px] tracking-[0.3em] text-zinc-500">01 ──── 09</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ MEMBROS ============ */}
        <section className="relative border border-zinc-800 bg-gradient-to-b from-black to-zinc-950 p-5 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <h3 style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-4xl sm:text-5xl font-black tracking-wide text-white">
              MEMBROS
            </h3>

            <div className="flex items-center gap-6 text-center text-zinc-400">
              <Stat3 icon={<Dumbbell className="h-5 w-5" />} t1="TREINAMOS" t2="JUNTOS" />
              <Stat3 icon={<Skull className="h-5 w-5" />} t1="EVOLUÍMOS" t2="JUNTOS" />
              <Stat3 icon={<Crown className="h-5 w-5" />} t1="VENCEMOS" t2="JUNTOS" />
            </div>
          </div>

          <div className="relative">
            <button className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 z-10">
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 z-10">
              <ChevronRight className="h-7 w-7" />
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-[230px] gap-3 sm:gap-4">
              {members.map((m) => (
                <MemberCard key={m.id} member={m} big={m.isLeader} onOpen={() => setProfileOpen(m.id)} />
              ))}
            </div>
          </div>
        </section>

        {/* ============ MANIFESTO ============ */}
        <section className="relative border border-zinc-800 bg-black overflow-hidden min-h-[420px]">
          <img src={footerBack} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70" />

          <div className="relative grid grid-cols-1 md:grid-cols-3 items-center gap-6 p-6 sm:p-10 min-h-[420px]">
            <div>
              <span style={{ fontFamily: "'Special Elite', monospace" }} className="text-[10px] tracking-[0.4em] text-zinc-400 block mb-3">— MANIFESTO Nº 01</span>
              <p style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-3xl sm:text-4xl uppercase leading-[1.05] text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]">
                Treine em <span className="text-zinc-400">silêncio</span>.<br />
                Deixe seus resultados<br />
                <span className="bg-zinc-100 text-black px-2">fazerem barulho</span>.
              </p>
              <div className="mt-4 h-0.5 w-16 bg-zinc-300" />
            </div>

            <div className="text-center">
              <p style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-6xl sm:text-7xl text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.9)]">
                GANGST3R
              </p>
              <p style={{ fontFamily: "'Special Elite', monospace" }} className="mt-3 text-[10px] tracking-[0.5em] text-zinc-400">EST · 2025 · LA FAMIGLIA</p>
              <div className="mt-3 flex justify-center gap-3 text-zinc-500">
                <Dumbbell className="h-4 w-4" />
                <Crown className="h-4 w-4" />
                <Skull className="h-4 w-4" />
              </div>
            </div>

            <div className="text-right">
              <span style={{ fontFamily: "'Special Elite', monospace" }} className="text-[10px] tracking-[0.4em] text-zinc-400 block mb-3">MANIFESTO Nº 02 —</span>
              <p style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-3xl sm:text-4xl uppercase leading-[1.05] text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]">
                Mente <span className="text-zinc-400">forte</span>.<br />
                Corpo <span className="bg-zinc-100 text-black px-2">forjado</span>.<br />
                Missão clara.
              </p>
              <div className="mt-4 ml-auto h-0.5 w-16 bg-zinc-300" />
            </div>
          </div>
        </section>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes slideIn { from{opacity:0; transform:translateX(20px)} to{opacity:1; transform:translateX(0)} }
      `}</style>

      {/* Modal */}
      <Dialog open={!!profile} onOpenChange={(v) => !v && setProfileOpen(null)}>
        <DialogContent className="max-w-sm rounded-none bg-zinc-950 border border-zinc-800 text-zinc-100 p-0 overflow-hidden">
          {profile && (
            <>
              <div className="relative aspect-square overflow-hidden">
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                {profile.isLeader && <Crown className="absolute top-3 right-3 h-6 w-6 text-zinc-100" />}
                <div className="absolute bottom-3 left-4">
                  <p style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-4xl text-white leading-none">{profile.name}</p>
                  <p className="text-[10px] tracking-[0.3em] text-zinc-300 uppercase mt-1">{profile.level} · {profile.locked ? "ACESSO RESTRITO" : "ATIVO"}</p>
                </div>
              </div>
              <DialogHeader className="px-5 pt-4">
                <DialogTitle className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400">FICHA — ATLETA</DialogTitle>
              </DialogHeader>
              <div className="px-5 pb-5 space-y-4">
                <p className="text-sm text-zinc-300 italic">"{profile.bio}"</p>
                <div className="grid grid-cols-3 border-y border-zinc-800 divide-x divide-zinc-800 text-center">
                  <Stat label="TREINOS" value={profile.treinos} />
                  <Stat label="STREAK" value={`${profile.streak}D`} icon={<Flame className="h-3 w-3 text-orange-400 inline" />} />
                  <Stat label="ÚLTIMA" value={profile.lastDays === 0 ? "HOJE" : `${profile.lastDays}D`} />
                </div>
                <div className="flex justify-between text-[10px] tracking-[0.25em] uppercase text-zinc-500">
                  <span>SEGUIDORES <span className="text-white font-bold">{profile.seguidores}</span></span>
                  <span>NÍVEL <span className="text-white font-bold">{profile.level}</span></span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MemberCard({ member, big, onOpen }: { member: Member; big?: boolean; onOpen: () => void }) {
  const locked = member.locked;
  return (
    <button
      onClick={onOpen}
      className={`group relative overflow-hidden border border-zinc-800 bg-zinc-950 text-left transition-all
        ${big ? "col-span-2 row-span-2" : ""}
        hover:border-zinc-400 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.9)]`}
    >
      <img src={member.image} alt={member.name} loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105 ${locked ? "grayscale" : "grayscale group-hover:grayscale-0"}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <span className="absolute top-2 left-2 h-3 w-3 border-t border-l border-zinc-300/60" />
      <span className="absolute top-2 right-2 h-3 w-3 border-t border-r border-zinc-300/60" />
      <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-zinc-300/60" />
      <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-zinc-300/60" />

      {member.isLeader && <Crown className="absolute top-3 right-3 h-5 w-5 text-zinc-100" />}
      {locked && (
        <span className="absolute top-3 left-3 z-10 text-[8px] tracking-[0.3em] border border-red-500/70 text-red-400 px-1.5 py-0.5 font-bold flex items-center gap-1 bg-black/70">
          <Lock className="h-2.5 w-2.5" /> RESTRITO
        </span>
      )}

      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4">
        <p style={{ fontFamily: "'Permanent Marker', cursive" }}
           className={`${big ? "text-5xl" : "text-2xl"} text-white leading-none drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]`}>
          {member.name}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] tracking-[0.2em] text-zinc-300 uppercase">
          <div>
            <p className="text-zinc-500">TREINOS</p>
            <p className="text-white font-bold text-sm">{member.treinos}</p>
          </div>
          <div>
            <p className="text-zinc-500">STREAK</p>
            <p className="text-white font-bold text-sm flex items-center gap-1"><Flame className="h-3 w-3 text-orange-400" />{member.streak}D</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[9px] tracking-[0.25em] uppercase">
          <div>
            <p className="text-zinc-500">NÍVEL</p>
            <p className="text-white font-bold">{member.level}</p>
          </div>
          <Skull className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="mt-2 h-0.5 w-full bg-zinc-800">
          <div className="h-full bg-zinc-300" style={{ width: `${member.level === "ELITE" ? 92 : member.level === "AVANÇADO" ? 70 : 50}%` }} />
        </div>
      </div>
    </button>
  );
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="py-3">
      <p className="font-black text-2xl text-white">{icon}{value}</p>
      <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 mt-1">{label}</p>
    </div>
  );
}

function Stat3({ icon, t1, t2 }: { icon: React.ReactNode; t1: string; t2: string }) {
  return (
    <div className="flex flex-col items-center">
      {icon}
      <span className="text-[9px] tracking-[0.25em] mt-1 leading-tight">{t1}<br />{t2}</span>
    </div>
  );
}
