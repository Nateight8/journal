"use client";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const { user, signOut } = useAuth();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {user ? <p>Logged in as {user.name}</p> : <p>Not logged in</p>}
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
