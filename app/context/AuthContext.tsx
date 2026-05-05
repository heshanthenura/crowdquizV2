"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "@/app/utils/supabase";
import type { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAdminStatus = async (u: User | null) => {
    if (!u) {
      setIsAdmin(false);
      return;
    }

    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;
      if (!token) {
        setIsAdmin(false);
        return;
      }

      const res = await fetch("/api/auth/isAdmin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setIsAdmin(false);
        return;
      }

      const json = await res.json();
      setIsAdmin(json.data?.isAdmin === true);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      await loadAdminStatus(currentUser);

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        await loadAdminStatus(currentUser);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          globalThis.window === undefined
            ? undefined
            : `${globalThis.location.origin}/auth/callback`,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAdmin, signInWithGoogle, signOut }),
    [user, loading, isAdmin, signInWithGoogle, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
