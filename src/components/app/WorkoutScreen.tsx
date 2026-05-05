import { useEffect, useMemo, useState } from "react";
import { fetchBoxes, BoxWithExercises, BoxExercise, DAYS, logSet } from "@/lib/boxes";
import { type AppUser } from "@/lib/users";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Check, Plus, Minus, Flame } from "lucide-react";
import MediaViewer from "./MediaViewer";
import { toast } from "sonner";

type SetState = { load: number; reps: number; done: boolean };

export default function WorkoutScreen({ user }: { user: AppUser }) {
  const [boxes, setBoxes] = useState<BoxWithExercises[]>([]);
  const [day, setDay] = useState(new Date().getDay());
  const [openEx, setOpenEx] = useState<string | null>(null);
  const [state, setState] = useState<Record<string, SetState[]>>({});

  useEffect(() => { fetchBoxes().then(setBoxes); }, []);

  const todayBoxes = useMemo(() => boxes.filter((b) => b.day_of_week === day), [boxes, day]);

  const ensure = (ex: BoxExercise) => {
    if (state[ex.id]) return;
    setState((s) => ({ ...s, [ex.id]: Array.from({ length: ex.sets }, () => ({ load: ex.load_kg, reps: parseInt(ex.reps) || 10, done: false })) }));
  };

  const updateSet = (eid: string, i: number, patch: Partial<SetState>) => {
    setState((s) => ({ ...s, [eid]: s[eid].map((x, j) => j === i ? { ...x, ...patch } : x) }));
  };

  const checkSet = async (ex: BoxExercise, i: number) => {
    const sets = state[ex.id];
    const cur = sets[i];
    const newDone = !cur.done;
    updateSet(ex.id, i, { done: newDone });
    if (newDone) {
      try {
        await logSet({ user_id: user.id, exercise_name: ex.name, body_part: ex.body_part, load_kg: cur.load, reps: cur.reps, set_num: i + 1, is_pr: false });
        if (navigator.vibrate) navigator.vibrate(40);
      } catch (e: any) { toast.error(e.message); }
    }
  };

  return (
    <div className="space-y-4">
      {/* Day selector */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Treino</p>
          <h2 style={{ fontFamily: "'Bebas Neue'" }} className="text-3xl tracking-[0.2em] text-white">{DAYS[day].toUpperCase()}</h2>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => setDay((d) => (d + 6) % 7)} className="border-zinc-700 text-xs">‹ ANT</Button>
          <Button size="sm" variant="outline" onClick={() => setDay((d) => (d + 1) % 7)} className="border-zinc-700 text-xs">PRÓX ›</Button>
        </div>
      </div>

      {todayBoxes.length === 0 && (
        <Card className="rounded-lg border border-zinc-800 bg-zinc-950 p-8 text-center">
          <p className="text-3xl mb-2">😶‍🌫️</p>
          <p className="text-zinc-400">Sem treino para {DAYS[day]}.</p>
          {user.role === "leader" && <p className="text-xs text-yellow-400/80 mt-2">Crie uma caixa para este dia no Editor.</p>}
        </Card>
      )}

      {todayBoxes.map((box) => (
        <div key={box.id} className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-yellow-400">{box.week_label}</p>
              <h3 style={{ fontFamily: "'Bebas Neue'" }} className="text-2xl tracking-[0.2em] text-white uppercase">{box.name}</h3>
              {box.description && <p className="text-xs text-zinc-500">{box.description}</p>}
            </div>
          </div>

          {box.exercises.map((ex) => {
            const isOpen = openEx === ex.id;
            const sets = state[ex.id];
            const allDone = sets?.every((s) => s.done);
            return (
              <Card key={ex.id} className={`rounded-lg overflow-hidden border ${allDone ? "border-green-600/60 bg-green-500/5" : "border-zinc-800 bg-zinc-950"}`}>
                <button
                  onClick={() => { ensure(ex); setOpenEx(isOpen ? null : ex.id); }}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  <div className="h-11 w-11 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl">💪</div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">{ex.name}</p>
                    <p className="text-[11px] text-zinc-500">{ex.sets}× {ex.reps} · {ex.load_kg}kg{ex.rest_seconds ? ` · ${ex.rest_seconds}s` : ""}</p>
                    {ex.body_part && <p className="text-[9px] tracking-[0.3em] uppercase text-blue-400 mt-0.5">{ex.body_part}</p>}
                  </div>
                  <span className="text-lg">{allDone ? "✅" : "⬜"}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
                </button>

                {isOpen && (
                  <div className="border-t border-zinc-800">
                    <MediaViewer items={ex.media} youtube_id={ex.youtube_id} fallbackName={ex.name} />
                    {ex.focus && (
                      <p className="text-xs text-green-400 px-3 py-2 border-b border-zinc-800/60">🎯 {ex.focus}</p>
                    )}
                    <div className="p-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 border-b border-zinc-800">
                            <th className="text-left py-1 w-8">S</th>
                            <th className="text-left py-1">Carga</th>
                            <th className="text-left py-1">Reps</th>
                            <th className="text-right py-1 w-10">✓</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(sets ?? []).map((s, i) => (
                            <tr key={i} className="border-b border-zinc-900">
                              <td className="py-1.5 text-zinc-500 font-mono text-xs">{i + 1}</td>
                              <td className="py-1.5">
                                <div className="flex items-center gap-1">
                                  <button onClick={() => updateSet(ex.id, i, { load: Math.max(0, s.load - 2.5) })} className="h-6 w-6 rounded bg-zinc-900 border border-zinc-800 text-white hover:border-green-500 flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                                  <span className="text-green-400 font-mono text-sm min-w-[3rem] text-center">{s.load}kg</span>
                                  <button onClick={() => updateSet(ex.id, i, { load: s.load + 2.5 })} className="h-6 w-6 rounded bg-zinc-900 border border-zinc-800 text-white hover:border-green-500 flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                                </div>
                              </td>
                              <td className="py-1.5">
                                <Input type="number" value={s.reps} onChange={(e) => updateSet(ex.id, i, { reps: parseInt(e.target.value) || 0 })} className="h-7 w-14 bg-zinc-900 border-zinc-800 text-center font-mono text-xs" />
                              </td>
                              <td className="py-1.5 text-right">
                                <button onClick={() => checkSet(ex, i)} className={`h-7 w-7 rounded-full border-2 flex items-center justify-center ${s.done ? "bg-green-500 border-green-500 text-black" : "bg-zinc-900 border-zinc-700 text-zinc-500"}`}>
                                  {s.done ? <Check className="h-3.5 w-3.5" /> : ""}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {ex.notes && <p className="text-xs text-zinc-500 italic mt-2">{ex.notes}</p>}
                      {ex.subs.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-1">Substitutos</p>
                          <div className="flex flex-wrap gap-1">
                            {ex.subs.map((s) => (
                              <span key={s} className="text-[11px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ))}

      {todayBoxes.length > 0 && (
        <Button onClick={() => toast.success("🔥 Treino selado! Volume registrado.")} className="w-full bg-gradient-to-b from-green-500 to-green-700 text-black tracking-[0.4em]" style={{ fontFamily: "'Bebas Neue'", fontSize: "1.2rem" }}>
          <Flame className="h-4 w-4 mr-2" /> SELAR O TREINO
        </Button>
      )}
    </div>
  );
}