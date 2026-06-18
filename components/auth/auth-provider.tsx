"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { firebaseAuth } from "@/lib/firebase";
import { ensureUserProfile } from "@/services/firebaseAuthService";
import type { AppUserProfile } from "@/types/onePieceCard";

interface AuthContextValue {
  user: User | null;
  profile: AppUserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await ensureUserProfile(currentUser);
        setProfile(
          userProfile ?? {
            id: currentUser.uid,
            name: currentUser.displayName ?? currentUser.email ?? "Usuario",
            email: currentUser.email ?? ""
          }
        );
      } else {
        setProfile(null);
      }

      setLoading(false);
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading
    }),
    [loading, profile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
