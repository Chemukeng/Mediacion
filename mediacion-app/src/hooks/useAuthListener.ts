import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";

export const useAuthListener = () => {
  const { setSession, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (mounted && profile) {
          setProfile(profile);
        }
      } catch {
        // Profile table may not exist yet — not critical, app still works
        if (mounted) setProfile(null);
      }
    };

    // 1. Check current session on app load
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          setSession(session.user);
          await fetchProfile(session.user.id);
        } else {
          setSession(null);
          setProfile(null);
        }
      } catch (err) {
        console.warn("Auth init error:", err);
        if (mounted) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for future auth changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setSession(session.user);
        await fetchProfile(session.user.id);
      } else {
        setSession(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setProfile, setLoading]);
};
