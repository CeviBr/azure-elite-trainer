import { useEffect, useState } from "react";
import { loadPlan, savePlan, STORAGE_KEYS, getLastNotice, type DayWorkout, type PlanNotice } from "@/lib/workouts";

export function usePlan() {
  const [plan, setPlan] = useState<DayWorkout[]>(() => loadPlan());
  const [notice, setNotice] = useState<PlanNotice | null>(() => getLastNotice());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PLAN_KEY) setPlan(loadPlan());
      if (e.key === STORAGE_KEYS.NOTICE_KEY) setNotice(getLastNotice());
    };
    window.addEventListener("storage", onStorage);
    // poll leve para mesma aba (savePlan já dispara, mas mantém robusto)
    const t = setInterval(() => {
      const n = getLastNotice();
      if (n && (!notice || n.id !== notice.id)) setNotice(n);
    }, 2000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (next: DayWorkout[], by: string, message: string) => {
    setPlan(next);
    savePlan(next, by, message);
  };

  return { plan, setPlan: update, notice };
}