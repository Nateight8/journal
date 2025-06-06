"use client";
import { useAuth } from "@/contexts/auth-context";

export default function Welcome() {
  const { user } = useAuth();

  return (
    <div className="">
      <p className="text-muted-foreground">Welcome back,</p>
      <h3 className="text-xl md:text-3xl xl:text-6xl">{user?.name}</h3>
    </div>
  );
}
