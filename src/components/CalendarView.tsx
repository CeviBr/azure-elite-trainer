import { WEEK_DAYS_SHORT, WEEK_DAYS, type DayWorkout } from "@/lib/workouts";
import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";

export default function CalendarView({ plan, todayDow, selected, onSelect }:{
  plan: DayWorkout[]; todayDow: number; selected: number; onSelect: (d: number) => void;
}) {
  // Mostra a semana iniciando em segunda
  const order = [1,2,3,4,5,6,0];
  return (
    <Card className="bg-gradient-card border-0 shadow-soft p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">Calendário Semanal</h3>
          <p className="text-xs text-muted-foreground">Toque em um dia para ver o treino</p>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1">
          <Crown className="h-3 w-3" /> Plano do Líder
        </span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {order.map((d) => {
          const w = plan.find((p) => p.day === d);
          const isToday = d === todayDow;
          const isSelected = d === selected;
          return (
            <button
              key={d}
              onClick={() => onSelect(d)}
              className={`relative rounded-xl p-3 text-center transition-all border-2 ${
                isSelected
                  ? "bg-gradient-royal text-white border-gold shadow-royal scale-105"
                  : isToday
                  ? "bg-white border-gold text-foreground shadow-gold/40 shadow-md"
                  : "bg-white border-transparent hover:border-primary/30"
              }`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-gold" : "text-muted-foreground"}`}>
                {WEEK_DAYS_SHORT[d]}
              </p>
              <p className="text-xs font-semibold mt-1 line-clamp-2 min-h-[2rem]">
                {w?.rest ? "Descanso" : w?.focus ?? "—"}
              </p>
              {isToday && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gold animate-pulse-gold" />
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Hoje é <span className="font-bold text-foreground">{WEEK_DAYS[todayDow]}</span>.
      </p>
    </Card>
  );
}