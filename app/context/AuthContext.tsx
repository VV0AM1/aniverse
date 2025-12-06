"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";

interface AuthContextType {
  nickname: string | null;
  token: string | null;
  isLoading: boolean;
  setNickname: (name: string | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [nickname, setNickname] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, status } = useSession();

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedToken = localStorage.getItem("token");
    if (storedNickname) setNickname(storedNickname);
    if (storedToken) setToken(storedToken);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (nickname) {
      localStorage.setItem("nickname", nickname);
    } else {
      localStorage.removeItem("nickname");
    }

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [nickname, token]);

  useEffect(() => {
    const bootstrapFromGoogle = async () => {
      if (status === "authenticated" && session?.user?.email) {
        if (token) return; // Already have token

        console.log("Bootstrapping Google Token...");
        try {
          const res = await fetch("/api/auth/googleToken", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              nickname: session.user.name ?? session.user.email.split("@")[0],
            }),
          });

          if (!res.ok) {
            console.error("Failed to bootstrap Google JWT", await res.text());
            return;
          }

          const data = await res.json();
          if (data.token) {
            setToken(data.token);
            if (data.nickname) setNickname(data.nickname);
            console.log("Google Token bootstrapped successfully");
          }
        } catch (err) {
          console.error("googleToken bootstrap error:", err);
        }
      } else if (status === "unauthenticated") {

      }
    };

    bootstrapFromGoogle();
  }, [session, status, token]);

  // Calculate effective loading state
  // We are loading if:
  // 1. Local storage check is pending (isLoading state)
  // 2. NextAuth session is loading (status === "loading")
  // 3. NextAuth is authenticated but we haven't bootstrapped our token yet (status === "authenticated" && !token)
  const isBootstrapping = status === "authenticated" && !token;
  const effectiveLoading = isLoading || status === "loading" || isBootstrapping;

  return (
    <AuthContext.Provider value={{ nickname, token, isLoading: effectiveLoading, setNickname, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
