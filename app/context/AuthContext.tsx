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

  return (
    <AuthContext.Provider value={{ nickname, token, isLoading, setNickname, setToken }}>
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
