import { MediaItem } from "@/lib/boxes";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MediaViewer({ items, youtube_id, fallbackName }:{
  items: MediaItem[]; youtube_id?: string | null; fallbackName?: string;
}) {
  const all: MediaItem[] = [...items];
  if (youtube_id) all.push({ url: `https://www.youtube.com/embed/${youtube_id}?rel=0&modestbranding=1`, type: "youtube" });
  const [idx, setIdx] = useState(0);

  if (!all.length) {
    const q = encodeURIComponent((fallbackName ?? "exercício") + " execução academia");
    return (
      <a
        href={`https://www.youtube.com/results?search_query=${q}`}
        target="_blank" rel="noreferrer"
        className="flex flex-col items-center justify-center h-32 bg-zinc-900 border-y border-zinc-800 text-zinc-500 hover:text-green-400 transition-colors"
      >
        <span className="text-2xl">▶</span>
        <span className="text-[10px] tracking-[0.3em] uppercase mt-1">Buscar no YouTube</span>
      </a>
    );
  }

  const cur = all[idx];
  return (
    <div className="relative bg-black border-y border-zinc-800">
      {cur.type === "youtube" ? (
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe className="absolute inset-0 w-full h-full" src={cur.url} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
      ) : cur.type === "video" ? (
        <video src={cur.url} controls autoPlay loop muted playsInline className="w-full max-h-72 object-contain bg-black" />
      ) : (
        <img src={cur.url} alt={cur.name ?? ""} className="w-full max-h-72 object-contain bg-black" />
      )}
      {all.length > 1 && (
        <>
          <button onClick={() => setIdx((i) => (i - 1 + all.length) % all.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 border border-zinc-700 p-1 rounded text-white hover:bg-black">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setIdx((i) => (i + 1) % all.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 border border-zinc-700 p-1 rounded text-white hover:bg-black">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {all.map((_, i) => (
              <span key={i} className={`h-1 w-4 rounded ${i === idx ? "bg-green-400" : "bg-zinc-600"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}