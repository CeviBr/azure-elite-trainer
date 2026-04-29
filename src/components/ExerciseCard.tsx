import { useState } from "react";
import { findExercise, EXERCISES } from "@/lib/exercises";
import { type WorkoutExercise } from "@/lib/workouts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Replace, Play, Dumbbell, Timer, Repeat, Crown } from "lucide-react";

interface Props {
  item: WorkoutExercise;
  index: number;
  isLeader: boolean;
  onReplace?: (newExerciseId: string) => void;
}

export default function ExerciseCard({ item, index, isLeader, onReplace }: Props) {
  const ex = findExercise(item.exerciseId);
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState(false);

  if (!ex) return null;

  const alts = ex.alternatives;

  return (
    <Card className="bg-gradient-card border-0 shadow-soft p-5 animate-slide-up">
      <div className="flex gap-4">
        <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-secondary cursor-pointer group" onClick={() => setMedia(true)}>
          <img src={ex.media} alt={ex.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" loading="lazy" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Play className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-wider text-gold uppercase">#{index + 1} · {ex.group}</p>
              <h3 className="font-bold text-lg leading-tight truncate">{ex.name}</h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="gap-1"><Dumbbell className="h-3 w-3" />{item.sets} séries</Badge>
            <Badge variant="secondary" className="gap-1"><Repeat className="h-3 w-3" />{item.reps}</Badge>
            {item.rest > 0 && <Badge variant="secondary" className="gap-1"><Timer className="h-3 w-3" />{item.rest}s descanso</Badge>}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={() => setMedia(true)}>
              <Play className="h-3.5 w-3.5 mr-1" /> Ver execução
            </Button>
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              <Replace className="h-3.5 w-3.5 mr-1" /> Substituir
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog substituições */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Replace className="h-5 w-5 text-gold" /> Substituir "{ex.name}"
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Não conseguiu fazer este exercício? Escolha uma alternativa equivalente.
          </p>
          <div className="space-y-2 mt-2 max-h-80 overflow-auto">
            {alts.map((altName) => {
              const found = EXERCISES.find((e) => e.name === altName);
              return (
                <button
                  key={altName}
                  onClick={() => {
                    if (found && onReplace && isLeader) {
                      onReplace(found.id);
                    }
                    setOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-lg border bg-card hover:border-gold hover:shadow-gold/30 hover:shadow-md transition flex items-center gap-3"
                >
                  {found && <img src={found.media} className="h-12 w-12 rounded object-cover" alt={altName} />}
                  <div className="flex-1">
                    <p className="font-semibold">{altName}</p>
                    <p className="text-xs text-muted-foreground">{found?.group ?? ex.group}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {!isLeader && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
              <Crown className="h-3 w-3 text-gold" /> Apenas o líder substitui o treino do grupo. Você pode usá-lo só hoje.
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Mídia */}
      <Dialog open={media} onOpenChange={setMedia}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{ex.name}</DialogTitle></DialogHeader>
          <div className="rounded-xl overflow-hidden bg-black">
            <img src={ex.media} alt={ex.name} className="w-full h-auto" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gold uppercase tracking-wider">Variações sugeridas</p>
            <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
              {alts.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}