import { useState } from "react";
import { type AppUser, getSession, logout } from "@/lib/users";
import Login from "@/components/Login";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<AppUser | null>(() => getSession());

  if (!user) return <Login onLogin={setUser} />;

  const handleLogout = () => { logout(); setUser(null); };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="absolute top-3 right-3 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={handleLogout}
          className="bg-black/70 border-zinc-700 text-zinc-200 hover:bg-zinc-900 rounded-none uppercase tracking-[0.25em] text-[10px]"
        >
          <LogOut className="h-3 w-3 mr-1" /> Sair
        </Button>
      </div>
      <iframe
        src={`/app.html?u=${user.id}`}
        title="GANGST3R"
        className="flex-1 w-full border-0 bg-black"
      />
    </div>
  );
};

export default Index;
