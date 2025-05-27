"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useQuery, useApolloClient, useMutation, NetworkStatus, ApolloError } from "@apollo/client";
import userOperations, { MeResponse, User } from "@/graphql/user-operations";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: Error | null;
};

type AuthContextType = AuthState & {
  signOut: () => Promise<void>;
  refetchUser: (forceNetwork?: boolean) => Promise<User | null>;
  signInWithGoogle: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const client = useApolloClient();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const { refetch, networkStatus, startPolling, stopPolling } = useQuery<MeResponse>(
    userOperations.Queries.me,
    {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all',
      onCompleted: (data) => {
        setState(prev => ({
          ...prev,
          user: data?.me ?? null,
          loading: false,
          error: null,
        }));
      },
      onError: (error: ApolloError) => {
        console.error('Auth error:', error);
        setState(prev => ({
          ...prev,
          user: null,
          loading: false,
          error: new Error(error.message),
        }));
      },
    }
  );

  // Start/stop polling based on network status
  useEffect(() => {
    // Only poll when the tab is visible and we have a user
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && state.user) {
        startPolling(30000); // Poll every 30 seconds when tab is visible
      } else {
        stopPolling();
      }
    };

    // Initial setup
    if (state.user) {
      startPolling(30000);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.user, startPolling, stopPolling]);

  const [logoutMutation] = useMutation(userOperations.Mutations.logout, {
    onCompleted: () => {
      client.clearStore().catch(console.error);
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  // Update loading state based on network status
  useEffect(() => {
    const isLoading = networkStatus === NetworkStatus.loading || 
                    networkStatus === NetworkStatus.refetch;
    
    setState(prev => ({
      ...prev,
      loading: isLoading && !prev.user, // Only set loading if we don't have a user
    }));
  }, [networkStatus]);

  const refetchUser = useCallback(async (forceNetwork = false) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      // Force network request if needed, otherwise use cache-first
      const options = forceNetwork 
        ? { fetchPolicy: 'network-only' as const }
        : { fetchPolicy: 'cache-first' as const };
      
      const { data, error } = await refetch(options);
      
      if (error) throw error;
      
      setState(prev => ({
        ...prev,
        user: data?.me ?? null,
        loading: false,
        error: null,
      }));
      
      return data?.me ?? null;
    } catch (error) {
      console.error('Error refetching user:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('An unknown error occurred'),
      }));
      throw error;
    }
  }, [refetch]);

  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await logoutMutation();
      setState({
        user: null,
        loading: false,
        error: null,
      });
      router.push("/authenticate");
    } catch (error) {
      console.error("Error during sign out:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('An unknown error occurred'),
      }));
    }
  }, [logoutMutation, router]);

  const signInWithGoogle = useCallback(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(
    () => ({
      user: state.user,
      loading: state.loading,
      error: state.error,
      signOut,
      refetchUser,
      signInWithGoogle,
    }),
    [state.user, state.loading, state.error, signOut, refetchUser, signInWithGoogle]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
