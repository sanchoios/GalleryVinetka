import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthState = {
  session: Session | null;
  user: User | null;
  isOwner: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({ session: null, user: null, isOwner: false, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function resolve(next: Session | null) {
      setSession(next);
      if (!next?.user || !supabase) {
        setIsOwner(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("profiles").select("role").eq("id", next.user.id).maybeSingle();
      if (!cancelled) {
        setIsOwner(data?.role === "owner");
        setLoading(false);
      }
    }

    supabase.auth.getSession().then(({ data }) => resolve(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setLoading(true);
      void resolve(next);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(() => ({
    session,
    user: session?.user ?? null,
    isOwner,
    loading,
  }), [session, isOwner, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
