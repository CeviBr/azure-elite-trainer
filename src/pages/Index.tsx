import { useEffect, useState } from "react";
import { type AppUser, getSession, logout } from "@/lib/users";
import Login from "@/components/Login";

const Index = () => {
  const [user, setUser] = useState<AppUser | null>(() => getSession());

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data === "gangster:logout" || (e.data && e.data.type === "gangster:logout")) {
        logout();
        setUser(null);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="fixed inset-0 bg-black">
      <iframe
        src={`/app.html?u=${user.id}`}
        title="GANGST3R"
        className="w-full h-full border-0 bg-black"
      />
    </div>
  );
};

export default Index;
