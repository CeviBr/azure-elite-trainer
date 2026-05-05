import { useEffect, useMemo, useState } from "react";
import { fetchLogs, WorkoutLog } from "@/lib/boxes";
import { type AppUser } from "@/lib/users";
import { Card } from "@/components/ui/card";

export default function StatsScreen({ user }: { user: AppUser }) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  useEffect(() => { fetchLogs(user.id).then(setLogs); }, [user.id]);

  const stats = useMemo(() => {
    const now = new Date();
    const todayK = now.toDateString();
    const weekAgo = now.getTime() - 7 * 86400000;
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const today = logs.filter((l) => new Date(l.performed_at!).toDateString() === todayK);
    const week = logs.filter((l) => new Date(l.performed_at!).getTime() >= weekAgo);
    const month = logs.filter((l) => new Date(l.performed_at!).getTime() >= monthStart);
    const avg = (a: WorkoutLog[]) => a.length ? Math.round(a.reduce((s, l) => s + l.load_kg, 0) / a.length) : 0;
    return {
      avgToday: avg(today), avgWeek: avg(week), avgMonth: avg(month),
      volWeek: Math.round(week.reduce((s, l) => s + l.load_kg * l.reps, 0)),
      sessions: new Set(logs.map((l) => new Date(l.performed_at!).toDateString())).size,
      prs: logs.filter((l) => l.is_pr).length,
    };
  }, [logs]);

  const byExercise = useMemo(() => {
    const map: Record<string, WorkoutLog[]> = {};
    logs.forEach((l) => { (map[l.exercise_name] ??= []).push(l); });
    return Object.entries(map).map(([name, arr]) => ({
      name, best: Math.max(...arr.map((l) => l.load_kg)), sets: arr.length,
    })).sort((a, b) => b.best - a.best).slice(0, 10);
  }, [logs]);

  return (
    <div className="space-y-4">
      <h2 style={{ fontFamily: "'Bebas Neue'" }} className="text-3xl tracking-[0.3em] text-white">EVOLUÇÃO</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <Stat label="Sessões" value={stats.sessions} />
        <Stat label="PRs" value={stats.prs} />
        <Stat label="Vol. semana" value={`${stats.volWeek}kg`} />
        <Stat label="Carga média (hoje)" value={`${stats.avgToday}kg`} />
        <Stat label="Carga média (semana)" value={`${stats.avgWeek}kg`} />
        <Stat label="Carga média (mês)" value={`${stats.avgMonth}kg`} />
      </div>

      <Card className="bg-zinc-950 border-zinc-800 p-4">
        <h3 style={{ fontFamily: "'Bebas Neue'" }} className="text-lg tracking-[0.2em] text-white mb-3">TOP EXERCÍCIOS</h3>
        {byExercise.length === 0 ? (
          <p className="text-zinc-500 text-sm">Sem dados ainda. Treine para registrar.</p>
        ) : (
          <div className="space-y-1">
            {byExercise.map((e) => (
              <div key={e.name} className="flex items-center justify-between text-sm border-b border-zinc-900 py-1.5">
                <span className="text-white">{e.name}</span>
                <span className="text-green-400 font-mono text-xs">{e.best}kg <span className="text-zinc-500">· {e.sets}s</span></span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="bg-zinc-950 border-zinc-800 p-3 text-center">
      <p style={{ fontFamily: "'JetBrains Mono'" }} className="text-2xl text-green-400">{value}</p>
      <p style={{ fontFamily: "'Bebas Neue'" }} className="text-[9px] tracking-[0.3em] uppercase text-zinc-500 mt-1">{label}</p>
    </Card>
  );
}