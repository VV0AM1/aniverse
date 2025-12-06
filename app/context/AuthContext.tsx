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
  setNickname: (name: string | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [nickname, setNickname] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedToken = localStorage.getItem("token");
    if (storedNickname) setNickname(storedNickname);
    if (storedToken) setToken(storedToken);
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
      if (!session?.user?.email) return;
      if (token) return; 

      try {
        const res = await fetch("/api/auth/googleToken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            nickname: session.user.name ?? session.user.email,
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
        }
      } catch (err) {
        console.error("googleToken bootstrap error:", err);
      }
    };

    bootstrapFromGoogle();
  }, [session, token]);

  return (
    <AuthContext.Provider value={{ nickname, token, setNickname, setToken }}>
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
