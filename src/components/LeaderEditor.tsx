import { useState } from "react";
import type { DayWorkout, WorkoutExercise } from "@/lib/workouts";
import { EXERCISES } from "@/lib/exercises";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WEEK_DAYS } from "@/lib/workouts";
import { Plus, Trash2, Crown, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function LeaderEditor({ plan, onSave, leaderName }:{
  plan: DayWorkout[]; onSave: (next: DayWorkout[], message: string) => void; leaderName: string;
}) {
  const [draft, setDraft] = useState<DayWorkout[]>(JSON.parse(JSON.stringify(plan)));
  const [activeDay, setActiveDay] = useState<number>(plan.find(p=>!p.rest)?.day ?? 1);

  const day = draft.find((d) => d.day === activeDay)!;

  const updateDay = (mut: (d: DayWorkout) => void) => {
    const rebuilt = draft.map((d) => {
      if (d.day !== activeDay) return d;
      const copy: DayWorkout = { ...d, exercises: d.exercises.map((e)=>({...e})) };
      mut(copy);
      return copy;
    });
    setDraft(rebuilt);
  };

  const addExercise = () => updateDay((d) => {
    d.exercises.push({ exerciseId: EXERCISES[0].id, sets: 3, reps: "10-12", rest: 60 });
  });

  const removeExercise = (i: number) => updateDay((d) => { d.exercises.splice(i, 1); });

  const updateExercise = (i: number, patch: Partial<WorkoutExercise>) =>
    updateDay((d) => { d.exercises[i] = { ...d.exercises[i], ...patch }; });

  const setFocus = (focus: string) => updateDay((d) => { d.focus = focus; });
  const setTitle = (title: string) => updateDay((d) => { d.title = title; });

  const save = () => {
    onSave(draft, `${leaderName} atualizou ${WEEK_DAYS[activeDay]} — ${day.focus}`);
    toast.success("Treino atualizado e enviado ao grupo!");
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-soft p-5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-gold" />
          <h3 className="font-bold text-lg">Painel do Líder</h3>
        </div>
        <Button onClick={save} className="bg-gradient-gold text-gold-foreground font-bold shadow-gold hover:opacity-95">
          <Save className="h-4 w-4 mr-1" /> Salvar e enviar ao grupo
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {draft.map((d) => (
          <Button
            key={d.day}
            size="sm"
            variant={activeDay === d.day ? "default" : "outline"}
            onClick={() => setActiveDay(d.day)}
            className={activeDay === d.day ? "bg-gradient-royal text-white" : ""}
          >
            {WEEK_DAYS[d.day]}
          </Button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Título</label>
          <Input value={day.title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Foco</label>
          <Input value={day.focus} onChange={(e) => setFocus(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        {day.exercises.map((ex, i) => (
          <div key={i} className="rounded-xl border bg-white p-3 grid sm:grid-cols-12 gap-2 items-center">
            <div className="sm:col-span-5">
              <Select value={ex.exerciseId} onValueChange={(v) => updateExercise(i, { exerciseId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {EXERCISES.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.group} — {e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input className="sm:col-span-2" type="number" min={1} value={ex.sets}
              onChange={(e) => updateExercise(i, { sets: Number(e.target.value) || 1 })} placeholder="Séries" />
            <Input className="sm:col-span-2" value={ex.reps}
              onChange={(e) => updateExercise(i, { reps: e.target.value })} placeholder="Reps" />
            <Input className="sm:col-span-2" type="number" min={0} value={ex.rest}
              onChange={(e) => updateExercise(i, { rest: Number(e.target.value) || 0 })} placeholder="Descanso" />
            <Button variant="ghost" size="icon" className="sm:col-span-1 text-destructive" onClick={() => removeExercise(i)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={addExercise} className="w-full border-dashed">
          <Plus className="h-4 w-4 mr-1" /> Adicionar exercício
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-gold" /> Ao salvar, todos os usuários receberão um aviso em tempo real.
      </p>
    </Card>
  );
}