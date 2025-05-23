"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useQuery, useApolloClient, useMutation } from "@apollo/client";
import userOperations, { MeResponse, User } from "@/graphql/user-operations";

// Define User and Context types

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

// Create Context with default undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const client = useApolloClient();

  const { loading: queryLoading, refetch } = useQuery<MeResponse>(
    userOperations.Queries.me,
    {
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        setUser(data?.me ?? null);
        setLoading(false);
      },
      onError: () => {
        setUser(null);
        setLoading(false);
      },
    }
  );

  const [logoutMutation] = useMutation(userOperations.Mutations.logout);

  useEffect(() => {
    setLoading(queryLoading);
  }, [queryLoading]);

  const refetchUser = async () => {
    try {
      const { data } = await refetch();
      setUser(data?.me ?? null);
    } catch (error) {
      console.error("Error refetching user:", error);
      setUser(null);
    }
  };

  const signOut = async () => {
    try {
      // Clear Apollo cache first
      await client.clearStore();

      // Call the backend logout endpoint
      await logoutMutation();

      // Clear local state
      setUser(null);

      // Redirect to sign-in page
      router.push("/sign-in");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  // Provide context value
  const value: AuthContextType = {
    user,
    loading,
    signOut,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to consume the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
