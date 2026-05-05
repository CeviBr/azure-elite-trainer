import { useEffect, useState } from "react";
import { fetchBoxes, BoxWithExercises, DAYS, fetchLogs, WorkoutLog } from "@/lib/boxes";
import { type AppUser } from "@/lib/users";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Dumbbell, Flame, Trophy } from "lucide-react";

export default function HomeScreen({ user, onStartWorkout }: { user: AppUser; onStartWorkout: () => void }) {
  const [boxes, setBoxes] = useState<BoxWithExercises[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const today = new Date().getDay();

  useEffect(() => {
    fetchBoxes().then(setBoxes).catch(() => {});
    fetchLogs(user.id).then(setLogs).catch(() => {});
  }, [user.id]);

  const todayBoxes = boxes.filter((b) => b.day_of_week === today);
  const totalWorkouts = new Set(logs.map((l) => new Date(l.performed_at!).toDateString())).size;
  const totalVolume = Math.round(logs.reduce((s, l) => s + l.load_kg * l.reps, 0));
  const prs = logs.filter((l) => l.is_pr).length;

  return (
    <div className="space-y-5">
      {/* Hero do dia */}
      <Card className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-black p-6">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-500 via-yellow-400 to-transparent" />
        <span style={{ fontFamily: "'Bebas Neue'" }} className="absolute -right-4 -bottom-8 text-[6rem] tracking-widest text-white/[0.025] pointer-events-none select-none font-black">GANGST3R</span>
        <p className="text-[10px] tracking-[0.4em] uppercase text-yellow-400 mb-1">Hoje</p>
        <h2 style={{ fontFamily: "'Bebas Neue'" }} className="text-4xl tracking-[0.2em] text-white">{DAYS[today].toUpperCase()}</h2>
        <p className="text-xs tracking-[0.3em] uppercase text-green-400 mt-1">
          {todayBoxes.length ? todayBoxes.map((b) => b.name).join(" · ") : "Sem treino programado"}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {todayBoxes.flatMap((b) => b.body_parts).slice(0, 6).map((p) => (
            <span key={p} style={{ fontFamily: "'Bebas Neue'" }} className="text-[10px] tracking-[0.2em] uppercase bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-0.5 rounded-full">{p}</span>
          ))}
        </div>
        {todayBoxes.length > 0 && (
          <Button onClick={onStartWorkout} className="w-full mt-4 bg-gradient-to-b from-green-400 to-green-600 hover:opacity-90 text-black font-bold tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue'", fontSize: "1.2rem" }}>
            INICIAR TREINO
          </Button>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard icon={<Dumbbell className="h-4 w-4" />} value={totalWorkouts} label="Sessões" />
        <StatCard icon={<Flame className="h-4 w-4" />} value={`${totalVolume}kg`} label="Volume" />
        <StatCard icon={<Trophy className="h-4 w-4" />} value={prs} label="Records" />
      </div>

      {/* Atalho líder */}
      {user.role === "leader" && (
        <Card className="rounded-xl border border-yellow-600/30 bg-gradient-to-br from-yellow-900/10 to-transparent p-4">
          <p className="text-[10px] tracking-[0.3em] uppercase text-yellow-400 flex items-center gap-2 mb-1">
            <Crown className="h-3 w-3" /> Painel do Líder
          </p>
          <p className="text-sm text-zinc-300">Vá em <strong className="text-yellow-400">EDITOR</strong> para criar caixas de treino, subir vídeos/imagens e definir séries.</p>
        </Card>
      )}

      {/* Próximos treinos */}
      <section>
        <h3 style={{ fontFamily: "'Bebas Neue'" }} className="text-xl tracking-[0.3em] text-white mb-3">CAIXAS DA SEMANA</h3>
        <div className="space-y-2">
          {boxes.length === 0 && (
            <p className="text-sm text-zinc-500">Nenhuma caixa de treino ainda. {user.role === "leader" ? "Crie uma no Editor." : "Aguarde o líder publicar."}</p>
          )}
          {boxes.map((b) => (
            <Card key={b.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">
                  {b.day_of_week !== null ? DAYS[b.day_of_week] : "Livre"} · {b.week_label}
                </p>
                <p style={{ fontFamily: "'Bebas Neue'" }} className="text-lg tracking-[0.2em] text-white uppercase">{b.name}</p>
              </div>
              <span className="text-xs text-zinc-400">{b.exercises.length} ex.</span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <Card className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-center">
      <div className="text-green-400 flex justify-center mb-1">{icon}</div>
      <p style={{ fontFamily: "'JetBrains Mono'" }} className="text-xl text-green-400 leading-none">{value}</p>
      <p style={{ fontFamily: "'Bebas Neue'" }} className="text-[9px] tracking-[0.3em] uppercase text-zinc-500 mt-1">{label}</p>
    </Card>
  );
}