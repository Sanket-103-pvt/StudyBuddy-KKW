"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase, mayHaveSession, supabaseEnabled } from "@/lib/supabase";
import { checkIsAdmin } from "@/lib/contrib";

interface AuthState {
  enabled: boolean;
  loading: boolean;
  signedIn: boolean;
  displayName: string | null;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  enabled: false,
  loading: false,
  signedIn: false,
  displayName: null,
  isAdmin: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabaseEnabled);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!supabaseEnabled) return;
    // Anonymous visitors never download the auth library.
    if (!mayHaveSession()) {
      setLoading(false);
      return;
    }
    let unsubscribe: (() => void) | undefined;
    let active = true;
    getSupabase().then((sb) => {
      if (!sb || !active) return;
      sb.auth.getSession().then(({ data }) => {
        if (!active) return;
        setSession(data.session);
        setLoading(false);
      });
      const { data: sub } = sb.auth.onAuthStateChange((_event, next) => setSession(next));
      unsubscribe = () => sub.subscription.unsubscribe();
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const userId = session?.user.id ?? null;
  useEffect(() => {
    let active = true;
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    checkIsAdmin().then((ok) => active && setIsAdmin(ok));
    return () => {
      active = false;
    };
  }, [userId]);

  const signIn = useCallback(async () => {
    const sb = await getSupabase();
    if (!sb) return;
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
    });
  }, []);

  const signOut = useCallback(async () => {
    const sb = await getSupabase();
    await sb?.auth.signOut();
    setSession(null);
  }, []);

  const value = useMemo<AuthState>(() => {
    const meta = session?.user.user_metadata as { full_name?: string; name?: string } | undefined;
    return {
      enabled: supabaseEnabled,
      loading,
      signedIn: Boolean(session),
      displayName: session ? meta?.full_name || meta?.name || "Student" : null,
      isAdmin,
      signIn,
      signOut,
    };
  }, [session, loading, isAdmin, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
