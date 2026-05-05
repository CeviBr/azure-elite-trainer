import { useState } from "react";
import { type AppUser, getSession, logout } from "@/lib/users";
import Login from "@/components/Login";
import AppShell, { type AppTab } from "@/components/app/AppShell";
import HomeScreen from "@/components/app/HomeScreen";
import WorkoutScreen from "@/components/app/WorkoutScreen";
import CalendarScreen from "@/components/app/CalendarScreen";
import StatsScreen from "@/components/app/StatsScreen";
import EditorScreen from "@/components/app/EditorScreen";
import ProfileScreen from "@/components/app/ProfileScreen";

const Index = () => {
  const [user, setUser] = useState<AppUser | null>(() => getSession());
  const [tab, setTab] = useState<AppTab>("home");

  if (!user) return <Login onLogin={setUser} />;

  const onLogout = () => { logout(); setUser(null); };

  return (
    <AppShell user={user} tab={tab} onTab={setTab} onLogout={onLogout}>
      {tab === "home" && <HomeScreen user={user} onStartWorkout={() => setTab("workout")} />}
      {tab === "workout" && <WorkoutScreen user={user} />}
      {tab === "calendar" && <CalendarScreen user={user} />}
      {tab === "stats" && <StatsScreen user={user} />}
      {tab === "editor" && <EditorScreen user={user} />}
      {tab === "profile" && <ProfileScreen user={user} />}
    </AppShell>
  );
};

export default Index;
