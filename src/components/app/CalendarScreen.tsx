import { useEffect, useMemo, useState } from "react";
import { fetchLogs, WorkoutLog } from "@/lib/boxes";
import { type AppUser } from "@/lib/users";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WD = ["D","S","T","Q","Q","S","S"];

export default function CalendarScreen({ user }: { user: AppUser }) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => { fetchLogs(user.id).then(setLogs); }, [user.id]);

  const trainedDays = useMemo(() => {
    const map: Record<string, { count: number; pr: boolean }> = {};
    logs.forEach((l) => {
      const k = new Date(l.performed_at!).toDateString();
      map[k] = map[k] ?? { count: 0, pr: false };
      map[k].count += 1;
      if (l.is_pr) map[k].pr = true;
    });
    return map;
  }, [logs]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = new Date().toDateString();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const dayLogs = selected ? logs.filter((l) => new Date(l.performed_at!).toDateString() === selected) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="h-9 w-9 rounded border border-zinc-800 bg-zinc-950 text-white hover:border-green-500 flex items-center justify-center"><ChevronLeft className="h-4 w-4" /></button>
        <h2 style={{ fontFamily: "'Bebas Neue'" }} className="text-2xl tracking-[0.3em] text-white uppercase">{MONTHS[month]} {year}</h2>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="h-9 w-9 rounded border border-zinc-800 bg-zinc-950 text-white hover:border-green-500 flex items-center justify-center"><ChevronRight className="h-4 w-4" /></button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WD.map((w, i) => <div key={i} className="text-center text-[10px] tracking-[0.2em] text-zinc-500 uppercase py-1">{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const k = d.toDateString();
          const t = trainedDays[k];
          const isToday = k === todayKey;
          const isSel = k === selected;
          return (
            <button
              key={i}
              onClick={() => setSelected(k)}
              className={`aspect-square rounded border text-xs font-mono flex flex-col items-center justify-center gap-0.5 transition-colors
                ${isSel ? "border-green-500 ring-2 ring-green-500/40" : "border-zinc-800"}
                ${isToday ? "bg-green-500/10 text-green-400" : t?.pr ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/40" : t ? "bg-green-500/5 text-white border-green-700/40" : "bg-zinc-950 text-zinc-500"}`}
            >
              <span>{d.getDate()}</span>
              {t && <span className={`h-1 w-1 rounded-full ${t.pr ? "bg-yellow-400" : "bg-green-400"}`} />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 text-[10px] text-zinc-400 tracking-[0.15em] uppercase">
        <span className="flex items-center gap-1"><span className="h-2 w-2 bg-green-400 inline-block rounded-sm" /> Treinou</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 bg-yellow-400 inline-block rounded-sm" /> PR</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 border border-green-500 inline-block rounded-sm" /> Hoje</span>
      </div>

      {selected && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <p style={{ fontFamily: "'Bebas Neue'" }} className="text-lg tracking-[0.2em] text-white mb-2">{new Date(selected).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).toUpperCase()}</p>
          {dayLogs.length === 0 ? (
            <p className="text-zinc-500 text-sm">Sem treino registrado.</p>
          ) : (
            <div className="space-y-1">
              {dayLogs.map((l, i) => (
                <div key={i} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm">
                  <span className="text-white">{l.exercise_name} <span className="text-zinc-500 text-xs">· s{l.set_num}</span></span>
                  <span className="font-mono text-green-400 text-xs">{l.load_kg}kg × {l.reps}{l.is_pr && " 🏅"}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}