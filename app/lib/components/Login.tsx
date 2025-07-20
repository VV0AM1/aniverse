"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const { setNickname: setAuthNickname, setToken: setAuthToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const passwordIsValid = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    if (!passwordIsValid) {
      setMessage("Password must be at least 8 characters long and include an uppercase letter and a number.");
      return;
    }

    try {
      const res = await axios.post(`/api/${mode}`, {
        nickname,
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("userId", user._id);
      localStorage.setItem("nickname", user.nickname);
      localStorage.setItem("token", token);
      setAuthNickname(user.nickname);
      setAuthToken(token);
      router.push("/");
    } catch (err: any) {
      console.error("❌ Login/Register failed:", err.response?.data || err);
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src={
            mode === "register"
              ? "/img/anime-register.mp4"
              : "/img/anime-login.mp4"
          }
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-md z-10" />

      <div className="relative z-20 flex items-center justify-center h-full perspective">
        <div
          className={`relative w-[90%] max-w-5xl h-[600px] transform-style preserve-3d duration-700 transition-transform ${
            mode === "register" ? "rotate-y-180" : ""
          }`}
        >
          <div className="absolute w-full h-full bg-white/5 backdrop-blur-lg rounded-xl shadow-lg flex flex-col md:flex-row backface-hidden">
            <div className="w-full md:w-1/2 p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full justify-center">
                <h1 className="text-2xl font-bold">Sign In</h1>
                <p className="text-sm">Welcome back, shadow warrior.</p>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="p-2 bg-white/10 rounded placeholder-white text-white focus:outline-none"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="p-2 bg-white/10 rounded placeholder-white text-white focus:outline-none"
                />

                <button type="submit" className="bg-purple-600 hover:bg-purple-700 py-2 rounded">
                  Sign In
                </button>

                {message && (
                  <p className="text-sm text-red-400 text-center">{message}</p>
                )}
              </form>
            </div>

            <div className="w-full md:w-1/2 bg-purple-900/80 p-8 flex flex-col items-center justify-center gap-4">
              <h2 className="text-xl font-semibold">Join Us</h2>
              <p className="text-sm text-center">
                Enter the shadows and become part of our world.
              </p>
              <button
                onClick={() => setMode("register")}
                className="bg-white text-purple-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="absolute w-full h-full bg-white/5 backdrop-blur-lg rounded-xl shadow-lg flex flex-col md:flex-row backface-hidden rotate-y-180">
            <div className="w-full md:w-1/2 p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full justify-center">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-sm">Join the army of shadows now.</p>

                <input
                  type="text"
                  placeholder="Nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  className="p-2 bg-white/10 rounded placeholder-white text-white focus:outline-none"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="p-2 bg-white/10 rounded placeholder-white text-white focus:outline-none"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="p-2 bg-white/10 rounded placeholder-white text-white focus:outline-none"
                />

                <button type="submit" className="bg-purple-600 hover:bg-purple-700 py-2 rounded mb-4">
                  Sign Up
                </button>

                {message && (
                  <p className="text-sm mb-4 text-red-400 text-center">{message}</p>
                )}
              </form>
            </div>

            <div className="w-full md:w-1/2 bg-purple-900/80 p-8 overflow-hidden flex flex-col items-center justify-center gap-4">
              <h2 className="text-xl font-semibold">Welcome Back</h2>
              <p className="text-sm text-center">
                You remember our deal, don’t you?
              </p>
              <button
                onClick={() => setMode("login")}
                className="bg-white text-purple-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}