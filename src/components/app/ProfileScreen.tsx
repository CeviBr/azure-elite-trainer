import { useEffect, useState } from "react";
import { type AppUser, loadEntries, streakDays } from "@/lib/users";
import { fetchLogs, WorkoutLog } from "@/lib/boxes";
import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";

export default function ProfileScreen({ user }: { user: AppUser }) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  useEffect(() => { fetchLogs(user.id).then(setLogs); }, [user.id]);

  const entries = loadEntries();
  const streak = streakDays(entries.byUser[user.id]);
  const total = entries.byUser[user.id]?.length ?? 0;
  const lastLog = logs[0];

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <Card className="bg-gradient-to-br from-zinc-950 to-black border border-zinc-800 p-6 text-center">
        <img src={user.avatar} alt={user.nickname} className="h-24 w-24 rounded-full object-cover mx-auto border-2 border-green-500" />
        <h2 style={{ fontFamily: "'Bebas Neue'" }} className="text-3xl tracking-[0.3em] text-white mt-3 uppercase">{user.nickname}</h2>
        <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 mt-1 flex items-center justify-center gap-1">
          {user.role === "leader" && <Crown className="h-3 w-3 text-yellow-400" />}
          {user.role === "leader" ? "LÍDER" : "SOLDADO"} · {user.name}
        </p>
      </Card>

      <Card className="bg-zinc-950 border-green-500/20 p-4 flex items-center gap-4">
        <div>
          <p style={{ fontFamily: "'JetBrains Mono'" }} className="text-4xl text-green-400 leading-none">{streak}</p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mt-1">Dias seguidos</p>
        </div>
        <div className="flex-1 text-sm text-zinc-300">
          {streak >= 7 ? "Semana inteira em chamas. 🔥" : streak >= 3 ? "Mantém o ritmo, sem pausa." : "Comece hoje. Sem desculpa."}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Card className="bg-zinc-950 border-zinc-800 p-3 text-center">
          <p style={{ fontFamily: "'JetBrains Mono'" }} className="text-2xl text-green-400">{total}</p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Check-ins</p>
        </Card>
        <Card className="bg-zinc-950 border-zinc-800 p-3 text-center">
          <p style={{ fontFamily: "'JetBrains Mono'" }} className="text-2xl text-green-400">{logs.length}</p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Séries totais</p>
        </Card>
      </div>

      {lastLog && (
        <Card className="bg-zinc-950 border-zinc-800 p-4">
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-1">Último registro</p>
          <p className="text-white text-sm">{lastLog.exercise_name} · <span className="text-green-400 font-mono">{lastLog.load_kg}kg × {lastLog.reps}</span></p>
          <p className="text-xs text-zinc-500 mt-1">{new Date(lastLog.performed_at!).toLocaleString("pt-BR")}</p>
        </Card>
      )}
    </div>
  );
}