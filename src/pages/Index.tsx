import { useEffect, useMemo, useState } from "react";
import { type AppUser, getSession, logout } from "@/lib/users";
import Login from "@/components/Login";
import { usePlan } from "@/hooks/usePlan";
import { WEEK_DAYS, type DayWorkout } from "@/lib/workouts";
import ExerciseCard from "@/components/ExerciseCard";
import CalendarView from "@/components/CalendarView";
import LeaderEditor from "@/components/LeaderEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, LogOut, Dumbbell, CalendarDays, Settings2, BellRing, Skull } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [user, setUser] = useState<AppUser | null>(() => getSession());
  const { plan, setPlan, notice } = usePlan();
  const [seenNoticeId, setSeenNoticeId] = useState<string | null>(() => localStorage.getItem("ironforge_seen_notice"));

  // Cálculo do dia atual SEMPRE em tempo real
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  const todayDow = now.getDay();

  const [selectedDay, setSelectedDay] = useState<number>(todayDow);
  // Sempre que o dia real mudar, reposiciona seleção pra hoje
  useEffect(() => { setSelectedDay(todayDow); }, [todayDow]);

  // Notificação de atualização do líder
  useEffect(() => {
    if (!user || !notice) return;
    if (notice.id === seenNoticeId) return;
    // Não notifica o próprio autor
    if (notice.by !== user.name) {
      toast(`${notice.by} atualizou o treino`, {
        description: notice.message,
        icon: <BellRing className="h-4 w-4 text-gold" />,
        duration: 7000,
      });
    }
    setSeenNoticeId(notice.id);
    localStorage.setItem("ironforge_seen_notice", notice.id);
  }, [notice, user, seenNoticeId]);

  if (!user) return <Login onLogin={setUser} />;

  const isLeader = user.role === "leader";
  const dayPlan = plan.find((d) => d.day === selectedDay);
  const todayPlan = plan.find((d) => d.day === todayDow);

  const replaceExercise = (dayNum: number, idx: number, newId: string) => {
    const next = plan.map((d) =>
      d.day === dayNum
        ? { ...d, exercises: d.exercises.map((e, i) => i === idx ? { ...e, exerciseId: newId } : e) }
        : d
    );
    setPlan(next, user.name, `${user.name} substituiu um exercício em ${WEEK_DAYS[dayNum]}`);
    toast.success("Exercício substituído para todo o grupo.");
  };

  const handleLogout = () => { logout(); setUser(null); };

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-zinc-100"
      style={{
        fontFamily: "'Archivo','Inter',system-ui,sans-serif",
        backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05), transparent 60%), url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Anton&family=Archivo:wght@400;700;900&family=Special+Elite&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 border border-zinc-700 bg-zinc-950 flex items-center justify-center">
              <Skull className="h-5 w-5 text-zinc-200" />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-2xl text-white leading-none tracking-wide">GANGST3R</h1>
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 mt-1 uppercase">
                {WEEK_DAYS[todayDow]} · {now.toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] tracking-[0.3em] text-zinc-500 uppercase">Acesso</span>
              <span className="text-sm font-bold flex items-center gap-1 tracking-[0.2em] uppercase">
                {user.nickname}
                {isLeader && <Crown className="h-3 w-3 text-zinc-200" />}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-none border border-zinc-800">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Banner de hoje */}
        <Card className="relative overflow-hidden rounded-none border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black text-zinc-100 p-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none">
            <span style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-[10rem] font-black tracking-tighter text-white">TREINO</span>
          </div>
          <div className="relative flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Treino de Hoje · {WEEK_DAYS[todayDow]}</p>
              <h2 style={{ fontFamily: "'Anton', Impact, sans-serif" }} className="text-4xl uppercase mt-2 tracking-wide text-white">{todayPlan?.title ?? "Sem treino"}</h2>
              <p className="text-zinc-400 mt-1 tracking-wider uppercase text-xs">{todayPlan?.focus}</p>
              <div className="flex gap-4 mt-3 text-xs text-zinc-400 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2"><Dumbbell className="h-4 w-4 text-zinc-200" /> {todayPlan?.exercises.length ?? 0} exercícios</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Líder atual</p>
              <p style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-2xl flex items-center gap-2 justify-end text-white mt-1">
                <Crown className="h-5 w-5" /> ReisZo
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid grid-cols-3 sm:w-auto sm:inline-grid sm:grid-flow-col bg-zinc-950 border border-zinc-800 rounded-none p-0 h-auto">
            <TabsTrigger value="today"><Dumbbell className="h-4 w-4 mr-1" />Treino</TabsTrigger>
            <TabsTrigger value="calendar"><CalendarDays className="h-4 w-4 mr-1" />Calendário</TabsTrigger>
            {isLeader && <TabsTrigger value="leader"><Settings2 className="h-4 w-4 mr-1" />Líder</TabsTrigger>}
          </TabsList>

          <TabsContent value="today" className="mt-4">
            <DayDetail
              dayPlan={todayPlan}
              dayLabel={`Hoje · ${WEEK_DAYS[todayDow]}`}
              isLeader={isLeader}
              onReplace={(i, newId) => replaceExercise(todayDow, i, newId)}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-4 space-y-4">
            <CalendarView plan={plan} todayDow={todayDow} selected={selectedDay} onSelect={setSelectedDay} />
            <DayDetail
              dayPlan={dayPlan}
              dayLabel={`Detalhe do dia · ${WEEK_DAYS[selectedDay]}`}
              isLeader={isLeader}
              onReplace={(i, newId) => replaceExercise(selectedDay, i, newId)}
            />
          </TabsContent>

          {isLeader && (
            <TabsContent value="leader" className="mt-4">
              <LeaderEditor plan={plan} leaderName={user.name} onSave={(next, msg) => setPlan(next, user.name, msg)} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

function DayDetail({ dayPlan, dayLabel, isLeader, onReplace }:{
  dayPlan: DayWorkout | undefined;
  dayLabel: string;
  isLeader: boolean;
  onReplace: (i: number, newId: string) => void;
}) {
  if (!dayPlan) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{dayLabel}</p>
          <h3 style={{ fontFamily: "'Anton', Impact, sans-serif" }} className="text-3xl uppercase tracking-wide text-white">{dayPlan.title} <span className="text-zinc-500 font-medium text-base normal-case"> — {dayPlan.focus}</span></h3>
        </div>
      </div>
      {dayPlan.rest ? (
        <Card className="rounded-none border border-zinc-800 bg-zinc-950 text-zinc-200 p-10 text-center">
          <p className="text-5xl">😴</p>
          <p style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-2xl mt-3 text-white">Dia de descanso</p>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mt-1">Recuperação é parte do treino.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {dayPlan.exercises.map((it, i) => (
            <ExerciseCard
              key={i + it.exerciseId}
              item={it}
              index={i}
              isLeader={isLeader}
              onReplace={(newId) => onReplace(i, newId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Index;
