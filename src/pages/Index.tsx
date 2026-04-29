import { useEffect, useMemo, useState } from "react";
import { type AppUser, getSession, logout } from "@/lib/users";
import Login from "@/components/Login";
import { usePlan } from "@/hooks/usePlan";
import { WEEK_DAYS, exerciseName } from "@/lib/workouts";
import ExerciseCard from "@/components/ExerciseCard";
import CalendarView from "@/components/CalendarView";
import LeaderEditor from "@/components/LeaderEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, LogOut, Dumbbell, CalendarDays, Settings2, BellRing } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-white shadow-royal">
        <div className="container py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
              <Crown className="h-5 w-5 text-gold-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-black leading-none">Iron<span className="text-gradient-gold">Forge</span></h1>
              <p className="text-xs text-blue-100/80 mt-0.5">
                {WEEK_DAYS[todayDow]} · {now.toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-blue-100/70">Logado como</span>
              <span className="font-bold flex items-center gap-1">
                {user.name}
                {isLeader && <Crown className="h-3 w-3 text-gold" />}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white hover:bg-white/10">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Banner de hoje */}
        <Card className="bg-gradient-royal text-white border-0 shadow-royal p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-gold/20 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Treino de Hoje · {WEEK_DAYS[todayDow]}</p>
              <h2 className="text-3xl font-black mt-1">{todayPlan?.title ?? "Sem treino"}</h2>
              <p className="text-blue-100/90 mt-1">{todayPlan?.focus}</p>
              <div className="flex gap-4 mt-3 text-sm text-blue-100/80">
                <span className="flex items-center gap-1"><Dumbbell className="h-4 w-4 text-gold" /> {todayPlan?.exercises.length ?? 0} exercícios</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-blue-100/70">Líder atual</p>
              <p className="text-xl font-bold flex items-center gap-1 justify-end text-gold">
                <Crown className="h-4 w-4" /> Fabrício
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid grid-cols-3 sm:w-auto sm:inline-grid sm:grid-flow-col">
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
  dayPlan: ReturnType<typeof exerciseName> extends never ? never : any;
  dayLabel: string;
  isLeader: boolean;
  onReplace: (i: number, newId: string) => void;
}) {
  if (!dayPlan) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{dayLabel}</p>
          <h3 className="text-2xl font-black">{dayPlan.title} <span className="text-muted-foreground font-medium text-base">— {dayPlan.focus}</span></h3>
        </div>
      </div>
      {dayPlan.rest ? (
        <Card className="bg-gradient-card border-0 shadow-soft p-10 text-center">
          <p className="text-5xl">😴</p>
          <p className="text-lg font-bold mt-3">Dia de descanso</p>
          <p className="text-muted-foreground text-sm">Recuperação é parte do treino.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {dayPlan.exercises.map((it: any, i: number) => (
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
