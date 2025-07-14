"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  nickname: string | null;
  token: string | null;
  setNickname: (name: string | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  nickname: null,
  token: null,
  setNickname: () => {},
  setToken: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [nickname, setNickname] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

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

  return (
    <AuthContext.Provider value={{ nickname, token, setNickname, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);