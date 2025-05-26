"use client";
import { useAuth } from "@/contexts/auth-context";

export default function Page() {
  const { user, signInWithGoogle } = useAuth();
  console.log(user);

  if (!user) {
    return (
      <div>
        <button onClick={() => signInWithGoogle()}>sign in</button>
      </div>
    );
  }

  return <div>{user.email}</div>;
}
