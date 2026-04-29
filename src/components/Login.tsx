import { useState } from "react";
import { USERS, login, type AppUser } from "@/lib/users";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Crown, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Login({ onLogin }: { onLogin: (u: AppUser) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const sel = USERS.find((u) => u.id === selected);

  const submit = () => {
    if (!sel) return;
    const u = login(sel.name, password);
    if (u) {
      toast.success(`Bem-vindo, ${u.name}`);
      onLogin(u);
    } else {
      toast.error("Senha incorreta");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, hsl(var(--gold)/0.4), transparent 40%), radial-gradient(circle at 80% 80%, hsl(var(--primary-glow)/0.3), transparent 40%)" }} />
      <div className="relative w-full max-w-3xl">
        <header className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold">
              <Crown className="h-7 w-7 text-gold-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white">
            Iron<span className="text-gradient-gold">Forge</span>
          </h1>
          <p className="text-blue-100/80 mt-3 tracking-wide">Forje sua disciplina. Registre cada repetição.</p>
        </header>

        {!sel ? (
          <div className="grid sm:grid-cols-3 gap-5 animate-slide-up">
            {USERS.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelected(u.id)}
                className="group relative rounded-2xl p-[2px] bg-gradient-to-br from-white/30 to-white/5 hover:from-gold hover:to-gold/40 transition-all"
              >
                <Card className="bg-gradient-card rounded-2xl p-6 h-full flex flex-col items-center text-center shadow-royal border-0">
                  <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${u.color} flex items-center justify-center text-white text-2xl font-black shadow-soft`}>
                    {u.initials}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground">{u.name}</h3>
                  {u.role === "leader" ? (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gold">
                      <Crown className="h-3 w-3" /> Líder
                    </span>
                  ) : (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <Shield className="h-3 w-3" /> Membro
                    </span>
                  )}
                </Card>
              </button>
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-card max-w-md mx-auto p-8 shadow-royal animate-slide-up border-0">
            <div className="flex items-center gap-4 mb-6">
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${sel.color} flex items-center justify-center text-white font-black shadow-soft`}>
                {sel.initials}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entrando como</p>
                <p className="text-xl font-bold">{sel.name}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  type="password"
                  placeholder="Sua senha"
                  className="pl-10 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setSelected(null); setPassword(""); }}>
                  Voltar
                </Button>
                <Button onClick={submit} className="flex-1 h-11 bg-gradient-royal hover:opacity-95 text-white shadow-royal font-bold">
                  Entrar na forja
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}