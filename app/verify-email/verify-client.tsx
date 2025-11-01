"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyClient({
  ok,
  reason,
}: {
  ok: boolean;
  reason: string | null;
}) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seconds === 0) router.replace("/");
  }, [seconds, router]);

  const title = useMemo(() => {
    if (ok) return "Email verified!";
    switch (reason) {
      case "missing": return "Verification link is missing a token.";
      case "payload": return "Invalid verification token payload.";
      case "invalid": return "This verification link is invalid.";
      case "expired": return "Your verification link has expired.";
      default: return "Verification failed.";
    }
  }, [ok, reason]);

  const subtitle = ok
    ? "Your account is now active. Redirecting to home…"
    : "Please request a new verification email and try again.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0d1a] to-[#1a1a2e] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#23252b] bg-[#151527] p-8 text-center shadow-xl">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: ok ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)" }}
        >
          {ok ? (
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-sm text-gray-300 mb-6">{subtitle}</p>

        <button
          onClick={() => router.replace("/")}
          className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition
            ${ok ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 hover:bg-gray-600"}`}
        >
          Go to Home now
        </button>

        <p className="mt-3 text-xs text-gray-400">Auto-redirect in {seconds}s</p>
      </div>
    </div>
  );
}