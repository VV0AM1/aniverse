"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";  // 👈

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
  const { data: session } = useSession(); // 👈

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedToken = localStorage.getItem("token");
    if (storedNickname) setNickname(storedNickname);
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    nickname ? localStorage.setItem("nickname", nickname) : localStorage.removeItem("nickname");
    token ? localStorage.setItem("token", token) : localStorage.removeItem("token");
  }, [nickname, token]);

  useEffect(() => {
    if (session?.user?.name || session?.user?.email) {
      setNickname(session.user.name ?? session.user.email ?? null);
    }
  }, [session]);

  return (
    <AuthContext.Provider value={{ nickname, token, setNickname, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};