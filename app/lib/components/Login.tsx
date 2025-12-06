"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Pusher from "pusher-js";
import { AnimatePresence, motion } from "framer-motion";
import "@/app/globals.css";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [pollEmail, setPollEmail] = useState<string | null>(null);

  const router = useRouter();
  const { setNickname: setAuthNickname, setToken: setAuthToken, nickname: authNickname, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && authNickname) {
      router.replace("/");
    }
  }, [isLoading, authNickname, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const passwordIsValid = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    if (!passwordIsValid) {
      setMessage("Password must be at least 8 characters long and include an uppercase letter and a number.");
      return;
    }

    try {
      if (mode === "register") {
        await axios.post("/api/register", { nickname, email, password });
        setIsVerifyingEmail(true);
        setMessage("✅ Registration successful! Check your email to verify your account.");
        setPollEmail(email);
        return;
      }

      if (mode === "login") {
        const otpRes = await axios.post("/api/otp/generate", { email, password });
        if (otpRes.status === 200) {
          setIsVerifyingOtp(true);
          setMessage("📩 OTP code sent to your email!");
        }
      }
    } catch (err: any) {
      console.error("❌ Auth failed:", err.response?.data || err);
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/otp/verify", { email, otp });
      const { token, user } = res.data;
      localStorage.setItem("userId", user._id);
      localStorage.setItem("nickname", user.nickname);
      localStorage.setItem("token", token);
      setAuthNickname(user.nickname);
      setAuthToken(token);
      router.push("/");
    } catch (err: any) {
      console.error("OTP verification failed:", err.response?.data || err);
      setMessage(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      console.error("Google login failed", err);
      setMessage("Google sign-in failed");
    }
  };

  useEffect(() => {
    if (!pollEmail) return;
    let stopped = false;
    let timer: any;

    const tick = async () => {
      try {
        const res = await fetch(`/api/user/isVerified?email=${encodeURIComponent(pollEmail)}`, { cache: "no-store" });
        const j = await res.json();
        if (!stopped && j.verified) {
          router.replace("/");
          return;
        }
      } catch { }
      if (!stopped) timer = setTimeout(tick, 3000);
    };

    tick();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [pollEmail, router]);

  useEffect(() => {
    if (!pollEmail) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
    });

    const channelName = channelForEmail(pollEmail);
    const ch = pusher.subscribe(channelName);
    const onVerified = () => router.replace("/");

    ch.bind("verified", onVerified);

    return () => {
      ch.unbind("verified", onVerified);
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [pollEmail, router]);

  function channelForEmail(email: string) {
    return `verify-${email.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      {/* Background video */}
      <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover z-0">
        <source
          src={mode === "register" ? "/img/anime-register.mp4" : "/img/anime-login.mp4"}
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-md z-10" />

      <div className="relative z-20 flex items-center justify-center h-full md:hidden">
        <div className="w-[90%] max-w-lg">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login-mobile"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="bg-white/5 backdrop-blur-lg rounded-xl shadow-lg p-6"
              >
                {!isVerifyingOtp ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="bg-purple-800 hover:bg-purple-900 py-2 rounded flex items-center justify-center gap-2"
                    >
                      <FcGoogle className="w-5 h-5" />
                      Sign in with Google
                    </button>

                    {message && <p className="text-sm text-red-400 text-center">{message}</p>}
                  </form>
                ) : (
                  <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Verify OTP</h1>
                    <p className="text-sm">Enter the code sent to your email.</p>
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Enter OTP code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="p-2 bg-white/10 rounded placeholder-white text-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 py-2 rounded transition"
                      >
                        Verify OTP
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsVerifyingOtp(false)}
                        className="text-sm text-gray-400 hover:text-white mt-2 text-center"
                      >
                        Back to Login
                      </button>
                    </form>
                    {message && <p className="text-sm text-red-400 text-center">{message}</p>}
                  </div>
                )}

                <div className="mt-6 bg-purple-900/80 rounded-lg p-4 text-center">
                  <h2 className="text-lg font-semibold mb-1">Join Us</h2>
                  <p className="text-sm mb-3">Enter the shadows and become part of our world.</p>
                  <button
                    onClick={() => setMode("register")}
                    className="bg-white text-purple-700 px-4 py-2 rounded hover:bg-gray-200"
                  >
                    Sign Up
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register-mobile"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="bg-white/5 backdrop-blur-lg rounded-xl shadow-lg p-6"
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

                  <button type="submit" className="bg-purple-600 hover:bg-purple-700 py-2 rounded">
                    Sign Up
                  </button>

                  {message && <p className="text-sm text-red-400 text-center">{message}</p>}
                </form>

                <div className="mt-6 bg-purple-900/80 rounded-lg p-4 text-center">
                  <h2 className="text-lg font-semibold mb-1">Welcome Back</h2>
                  <p className="text-sm mb-3">You remember our deal, don’t you?</p>
                  <button
                    onClick={() => setMode("login")}
                    className="bg-white text-purple-700 px-4 py-2 rounded hover:bg-gray-200"
                  >
                    Sign In
                  </button>

                  {isVerifyingEmail && (
                    <p className="text-sm text-green-400 text-center mt-3">
                      ✅ Check your email inbox to verify your account before logging in.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-20 hidden md:flex items-center justify-center h-full">
        <div
          className={`relative w-[90%] max-w-5xl h-[600px] duration-700 transition-transform ${mode === "register" ? "rotate-y-180" : ""
            }`}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-xl shadow-lg flex flex-col md:flex-row backface-hidden">
            <div className="w-full md:w-1/2 p-8 relative">
              <AnimatePresence mode="wait">
                {!isVerifyingOtp ? (
                  <motion.form
                    key="desktop-login-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 h-full justify-center"
                  >
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

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="bg-purple-800 hover:bg-purple-900 py-2 rounded flex items-center justify-center gap-2"
                    >
                      <FcGoogle className="w-5 h-5" />
                      Sign in with Google
                    </button>

                    {message && <p className="text-sm text-red-400 text-center">{message}</p>}
                  </motion.form>
                ) : (
                  <motion.div
                    key="desktop-otp-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full justify-center gap-4"
                  >
                    <h1 className="text-2xl font-bold">Verify OTP</h1>
                    <p className="text-sm">Enter the code sent to your email.</p>
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3 w-full">
                      <input
                        type="text"
                        placeholder="Enter OTP code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="p-2 bg-white/10 rounded placeholder-white text-white focus:outline-none w-full"
                      />
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 py-2 rounded transition w-full"
                      >
                        Verify OTP
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsVerifyingOtp(false)}
                        className="text-sm text-gray-400 hover:text-white mt-2"
                      >
                        Back to Login
                      </button>
                    </form>
                    {message && <p className="text-sm text-red-400 text-center">{message}</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-full md:w-1/2 bg-purple-900/80 p-8 flex flex-col items-center justify-center gap-4">
              <h2 className="text-xl font-semibold">Join Us</h2>
              <p className="text-sm text-center">Enter the shadows and become part of our world.</p>
              <button
                onClick={() => setMode("register")}
                className="bg-white text-purple-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Sign Up
              </button>
              {isVerifyingEmail && (
                <p className="text-sm text-green-400 text-center">
                  ✅ Check your email inbox to verify your account before logging in.
                </p>
              )}
            </div>
          </div>

          <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-xl shadow-lg flex flex-col md:flex-row backface-hidden [transform:rotateY(180deg)]">
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

                {message && <p className="text-sm mb-4 text-red-400 text-center">{message}</p>}
              </form>
            </div>

            <div className="w-full md:w-1/2 bg-purple-900/80 p-8 overflow-hidden flex flex-col items-center justify-center gap-4">
              <h2 className="text-xl font-semibold">Welcome Back</h2>
              <p className="text-sm text-center">You remember our deal, don’t you?</p>
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