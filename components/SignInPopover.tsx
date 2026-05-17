"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPopover() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const show = searchParams.has("signin");
  const next = searchParams.get("next") || "/w/week";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [show]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && show) dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]); // eslint-disable-line react-hooks/exhaustive-deps

  function dismiss() {
    const url = new URL(window.location.href);
    url.searchParams.delete("signin");
    url.searchParams.delete("next");
    router.replace(url.pathname + (url.search !== "?" ? url.search : ""));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = next;
      } else {
        setError("Wrong password.");
        setPassword("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(20,19,15,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4"
        style={{ border: "1px solid #e2e0d8" }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold" style={{ color: "#1c1b18" }}>Sign in</h2>
          <p className="text-sm mt-1" style={{ color: "#6a675f" }}>Private area — enter password to continue</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            ref={inputRef}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              border: "1px solid #e2e0d8",
              background: "#f8fafc",
              color: "#1c1b18",
            }}
            disabled={loading}
          />
          {error && <p className="text-sm" style={{ color: "#c2410c" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ background: "#1c1b18", color: "#ece9df" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="text-xs text-center mt-4" style={{ color: "#6a675f" }}>esc to dismiss</p>
      </div>
    </div>
  );
}
