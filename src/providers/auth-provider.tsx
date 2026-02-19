"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserByUid } from "@/lib/firestore";
import type { AppUser } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  roleLoading: boolean;
  signIn: (email: string, password: string) => Promise<AppUser | null>;
  signOut: () => Promise<void>;
  createEmployeeAccount: (data: {
    email: string;
    password: string;
    displayName: string;
    department: string;
    jobTitle: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  loading: true,
  roleLoading: true,
  signIn: async () => null,
  signOut: async () => {},
  createEmployeeAccount: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        setRoleLoading(true);
        const userDoc = await getUserByUid(u.uid);
        setAppUser(userDoc);
        setRoleLoading(false);
      } else {
        setAppUser(null);
        setRoleLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AppUser | null> => {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getUserByUid(cred.user.uid);
      setAppUser(userDoc);
      return userDoc;
    },
    [],
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setAppUser(null);
  }, []);

  const createEmployeeAccount = useCallback(
    async (data: {
      email: string;
      password: string;
      displayName: string;
      department: string;
      jobTitle: string;
    }) => {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not authenticated");

      const idToken = await currentUser.getIdToken();
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create employee account");
      }
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        loading,
        roleLoading,
        signIn,
        signOut,
        createEmployeeAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
