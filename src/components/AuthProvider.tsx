"use client";

import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type User,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth } from "@/lib/firebase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithEmail(email: string, password: string): Promise<void>;
  signUpWithEmail(email: string, password: string): Promise<void>;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signInWithEmail(email: string, password: string) {
    if (!auth) throw new Error("Auth not ready");
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUpWithEmail(email: string, password: string) {
    if (!auth) throw new Error("Auth not ready");
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle() {
    if (!auth) throw new Error("Auth not ready");
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function handleSignOut() {
    if (!auth) return;
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

