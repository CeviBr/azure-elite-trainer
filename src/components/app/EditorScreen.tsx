import { useEffect, useRef, useState } from "react";
import {
  fetchBoxes, BoxWithExercises, BoxExercise, DAYS, BODY_PARTS,
  createBox, updateBox, deleteBox, addExercise, updateExercise, deleteExercise, uploadMedia,
  MediaItem,
} from "@/lib/boxes";
import { type AppUser } from "@/lib/users";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Upload, Crown, Loader2, X, ChevronDown, ChevronUp, Save } from "lucide-react";
import { toast } from "sonner";
import MediaViewer from "./MediaViewer";

export default function EditorScreen({ user }: { user: AppUser }) {
  const [boxes, setBoxes] = useState<BoxWithExercises[]>([]);
  const [loading, setLoading] = useState(true);
  const [openBox, setOpenBox] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try { setBoxes(await fetchBoxes()); } finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  if (user.role !== "leader") {
    return <Card className="p-6 bg-zinc-950 border-zinc-800 text-center text-zinc-400">Editor exclusivo do líder.</Card>;
  }

  const newBox = async () => {
    try {
      await createBox({ name: "NOVA CAIXA", day_of_week: new Date().getDay(), week_label: "S1", order_index: boxes.length });
      toast.success("Caixa criada");
      await reload();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-yellow-400 flex items-center gap-1"><Crown className="h-3 w-3" /> Painel do Líder</p>
          <h2 style={{ fontFamily: "'Bebas Neue'" }} className="text-3xl tracking-[0.2em] text-white">EDITOR DE TREINOS</h2>
        </div>
        <Button onClick={newBox} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold tracking-[0.2em]" style={{ fontFamily: "'Bebas Neue'" }}>
          <Plus className="h-4 w-4 mr-1" /> NOVA CAIXA
        </Button>
      </div>

      {loading && <p className="text-zinc-500 text-sm flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Carregando...</p>}

      {!loading && boxes.length === 0 && (
        <Card className="p-8 text-center bg-zinc-950 border-zinc-800 border-dashed">
          <p className="text-zinc-400 text-sm">Nenhuma caixa ainda. Clique em <strong className="text-yellow-400">NOVA CAIXA</strong> para começar.</p>
        </Card>
      )}

      {boxes.map((b) => (
        <BoxEditor
          key={b.id} box={b}
          open={openBox === b.id}
          onToggle={() => setOpenBox(openBox === b.id ? null : b.id)}
          onChanged={reload}
        />
      ))}
    </div>
  );
}

/* ---------- Box editor ---------- */
function BoxEditor({ box, open, onToggle, onChanged }: { box: BoxWithExercises; open: boolean; onToggle: () => void; onChanged: () => void }) {
  const [name, setName] = useState(box.name);
  const [desc, setDesc] = useState(box.description ?? "");
  const [day, setDay] = useState<number | null>(box.day_of_week);
  const [week, setWeek] = useState(box.week_label ?? "S1");
  const [parts, setParts] = useState<string[]>(box.body_parts ?? []);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await updateBox(box.id, { name, description: desc, day_of_week: day, week_label: week, body_parts: parts });
      toast.success("Caixa atualizada");
      onChanged();
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };

  const remove = async () => {
    if (!confirm("Excluir esta caixa e todos os exercícios?")) return;
    try { await deleteBox(box.id); toast.success("Caixa removida"); onChanged(); } catch (e: any) { toast.error(e.message); }
  };

  const addEx = async () => {
    try { await addExercise(box.id, { order_index: box.exercises.length }); onChanged(); } catch (e: any) { toast.error(e.message); }
  };

  const togglePart = (p: string) => setParts((arr) => arr.includes(p) ? arr.filter((x) => x !== p) : [...arr, p]);

  return (
    <Card className="bg-zinc-950 border border-yellow-600/30 rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-yellow-400">
            {day !== null ? DAYS[day] : "Sem dia"} · {week} · {box.exercises.length} ex.
          </p>
          <p style={{ fontFamily: "'Bebas Neue'" }} className="text-xl tracking-[0.2em] text-white uppercase">{box.name}</p>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
      </button>

      {open && (
        <div className="border-t border-zinc-800 p-4 space-y-4">
          {/* Box meta */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-zinc-900 border-zinc-800" />
            </div>
            <div>
              <Label>Descrição</Label>
              <Input value={desc} onChange={(e) => setDesc(e.target.value)} className="bg-zinc-900 border-zinc-800" />
            </div>
            <div>
              <Label>Dia da semana</Label>
              <Select value={day === null ? "x" : String(day)} onValueChange={(v) => setDay(v === "x" ? null : parseInt(v))}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="x">— Livre —</SelectItem>
                  {DAYS.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ciclo</Label>
              <Select value={week} onValueChange={setWeek}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {["S1 Volume","S2 Intensidade","S3 Variação","S4 Deload","S1","S2","S3","S4"].map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Grupos musculares</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {BODY_PARTS.map((p) => {
                const on = parts.includes(p);
                return (
                  <button key={p} onClick={() => togglePart(p)} className={`text-[11px] tracking-[0.15em] uppercase px-2 py-1 rounded border ${on ? "bg-yellow-500/20 border-yellow-500 text-yellow-300" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"}`}>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} disabled={busy} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold" style={{ fontFamily: "'Bebas Neue'" }}>
              <Save className="h-4 w-4 mr-1" /> SALVAR CAIXA
            </Button>
            <Button onClick={remove} variant="destructive" size="sm" className="ml-auto">
              <Trash2 className="h-4 w-4 mr-1" /> Excluir
            </Button>
          </div>

          {/* Exercises */}
          <div className="border-t border-zinc-800 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 style={{ fontFamily: "'Bebas Neue'" }} className="text-lg tracking-[0.2em] text-white">EXERCÍCIOS</h4>
              <Button onClick={addEx} size="sm" variant="outline" className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-500/10">
                <Plus className="h-3 w-3 mr-1" /> Adicionar
              </Button>
            </div>
            {box.exercises.map((ex) => (
              <ExerciseEditor key={ex.id} ex={ex} onChanged={onChanged} />
            ))}
            {box.exercises.length === 0 && <p className="text-zinc-500 text-sm italic">Nenhum exercício. Clique em "Adicionar".</p>}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ---------- Exercise editor ---------- */
function ExerciseEditor({ ex, onChanged }: { ex: BoxExercise; onChanged: () => void }) {
  const [draft, setDraft] = useState<BoxExercise>(ex);
  const [media, setMedia] = useState<MediaItem[]>(ex.media);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files?.length) return;
    setUploading(true);
    try {
      const items = await uploadMedia(files);
      const next = [...media, ...items];
      setMedia(next);
      await updateExercise(ex.id, { media: next });
      toast.success(`${items.length} arquivo(s) enviado(s)`);
    } catch (err: any) { toast.error(err.message); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const removeMedia = async (i: number) => {
    const next = media.filter((_, j) => j !== i);
    setMedia(next);
    await updateExercise(ex.id, { media: next });
  };

  const save = async () => {
    setBusy(true);
    try {
      await updateExercise(ex.id, {
        name: draft.name, body_part: draft.body_part, focus: draft.focus,
        sets: draft.sets, reps: draft.reps, load_kg: draft.load_kg, rest_seconds: draft.rest_seconds,
        notes: draft.notes, youtube_id: draft.youtube_id, subs: draft.subs,
      });
      toast.success("Exercício salvo");
      onChanged();
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };

  const remove = async () => {
    if (!confirm("Excluir este exercício?")) return;
    await deleteExercise(ex.id); onChanged();
  };

  return (
    <Card className="bg-zinc-900 border border-zinc-800 p-3 space-y-2">
      <div className="flex gap-2 items-center">
        <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Nome do exercício" className="bg-zinc-950 border-zinc-800 font-bold" />
        <Button onClick={remove} variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div><Label>Séries</Label><Input type="number" value={draft.sets} onChange={(e) => setDraft({ ...draft, sets: parseInt(e.target.value) || 1 })} className="bg-zinc-950 border-zinc-800 font-mono" /></div>
        <div><Label>Reps</Label><Input value={draft.reps} onChange={(e) => setDraft({ ...draft, reps: e.target.value })} className="bg-zinc-950 border-zinc-800 font-mono" /></div>
        <div><Label>Carga (kg)</Label><Input type="number" value={draft.load_kg} onChange={(e) => setDraft({ ...draft, load_kg: parseFloat(e.target.value) || 0 })} className="bg-zinc-950 border-zinc-800 font-mono" /></div>
        <div><Label>Descanso (s)</Label><Input type="number" value={draft.rest_seconds} onChange={(e) => setDraft({ ...draft, rest_seconds: parseInt(e.target.value) || 0 })} className="bg-zinc-950 border-zinc-800 font-mono" /></div>
        <div>
          <Label>Grupo</Label>
          <Select value={draft.body_part ?? ""} onValueChange={(v) => setDraft({ ...draft, body_part: v })}>
            <SelectTrigger className="bg-zinc-950 border-zinc-800"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">{BODY_PARTS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        <div><Label>Foco / dica</Label><Input value={draft.focus ?? ""} onChange={(e) => setDraft({ ...draft, focus: e.target.value })} className="bg-zinc-950 border-zinc-800" placeholder="ex: contração no topo" /></div>
        <div><Label>YouTube ID (opcional)</Label><Input value={draft.youtube_id ?? ""} onChange={(e) => setDraft({ ...draft, youtube_id: e.target.value })} className="bg-zinc-950 border-zinc-800 font-mono" placeholder="ex: rT7DgCr-3pg" /></div>
      </div>
      <div>
        <Label>Substitutos (separados por vírgula)</Label>
        <Input value={draft.subs.join(", ")} onChange={(e) => setDraft({ ...draft, subs: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="bg-zinc-950 border-zinc-800" />
      </div>
      <div>
        <Label>Observações</Label>
        <Textarea value={draft.notes ?? ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className="bg-zinc-950 border-zinc-800 min-h-[60px]" />
      </div>

      {/* Media manager */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label>Mídias ({media.length}) — vídeo, imagem ou GIF</Label>
          <label className="cursor-pointer">
            <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={onUpload} className="hidden" />
            <span className="inline-flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 px-3 py-1.5 rounded">
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />} Enviar arquivos
            </span>
          </label>
        </div>
        {media.length > 0 && (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
              {media.map((m, i) => (
                <div key={i} className="relative group rounded overflow-hidden border border-zinc-800 bg-black aspect-square">
                  {m.type === "video" ? (
                    <video src={m.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={m.url} className="w-full h-full object-cover" alt={m.name ?? ""} />
                  )}
                  <button onClick={() => removeMedia(i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/80 border border-red-500 text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2"><MediaViewer items={media} youtube_id={draft.youtube_id} fallbackName={draft.name} /></div>
          </>
        )}
      </div>

      <div className="flex justify-end pt-2 border-t border-zinc-800">
        <Button onClick={save} disabled={busy} size="sm" className="bg-green-500 hover:bg-green-600 text-black font-bold">
          <Save className="h-3 w-3 mr-1" /> SALVAR EXERCÍCIO
        </Button>
      </div>
    </Card>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 block mb-1">{children}</label>;
}