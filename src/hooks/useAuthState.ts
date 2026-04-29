import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { AuthState, Profile } from "../types";

export function useAuthState(): AuthState & { refreshProfile: () => Promise<void> } {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (nextSession: Session | null) => {
    if (!nextSession?.user) {
      setProfile(null);
      return;
    }

    let data: Profile | null = null;
    let errorMessage: string | null = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const result = await supabase
        .from("profiles")
        .select("id,email,full_name,role,created_at")
        .eq("id", nextSession.user.id)
        .maybeSingle();

      if (result.error) {
        errorMessage = result.error.message;
        break;
      }

      data = result.data as Profile | null;
      if (data) break;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    if (errorMessage) {
      console.warn(errorMessage);
    }
    setProfile(data);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      await loadProfile(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void loadProfile(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  return {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    refreshProfile: () => loadProfile(session)
  };
}
