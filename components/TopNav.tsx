"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Lock, LayoutDashboard } from "lucide-react";

interface TopNavProps {
  loggedIn: boolean;
}

const sections = [
  { href: "#ai", label: "AI" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
  { href: "#github", label: "GitHub" },
];

export default function TopNav({ loggedIn }: TopNavProps) {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }

  return (
    <header
      className="sticky top-0 z-20"
      style={{ borderBottom: "1px solid var(--line)", background: "var(--bg)" }}
    >
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between"
        style={{ height: 52 }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-75"
        >
          <img
            src={dark ? "/logo-light.svg" : "/logo.svg"}
            alt="arlind.tech"
            width={24}
            height={24}
            style={{ borderRadius: 5 }}
          />
          <span
            style={{
              color: "var(--ink)",
              fontFamily: "'Caveat', cursive",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            arlind.tech
          </span>
        </Link>

        {/* Desktop right side */}
        <div className="hidden sm:flex items-center gap-1">
          {sections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="px-3 py-1.5 rounded-lg text-sm transition-opacity hover:opacity-70"
              style={{ color: "var(--dim)" }}
            >
              {s.label}
            </a>
          ))}

          <span className="mx-1.5" style={{ color: "var(--line)" }}>|</span>

          <button
            onClick={toggleDark}
            className="flex items-center justify-center p-1.5 rounded-lg transition-opacity hover:opacity-70"
            style={{ color: "var(--dim)" }}
            title="Toggle dark mode"
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {loggedIn ? (
            <Link
              href="/w"
              className="ml-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-opacity hover:opacity-70"
              style={{ color: "var(--accent)", background: "var(--hi)" }}
            >
              <LayoutDashboard size={12} />
              Dashboard
            </Link>
          ) : (
            <button
              onClick={() => router.push("/?signin=")}
              aria-label="Sign in"
              title="Sign in"
              className="ml-1 flex items-center justify-center p-1.5 rounded-lg transition-opacity"
              style={{ color: "var(--dim)", opacity: 0.25 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.25")}
            >
              <Lock size={13} />
            </button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex sm:hidden items-center gap-1">
          <button
            onClick={toggleDark}
            className="flex items-center justify-center p-1.5 rounded-lg"
            style={{ color: "var(--dim)" }}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex items-center justify-center p-1.5 rounded-lg"
            style={{ color: "var(--dim)" }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="sm:hidden px-4 pb-3 flex flex-col"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          {sections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              onClick={() => setMobileOpen(false)}
              className="px-2 py-2.5 rounded-lg text-sm"
              style={{ color: "var(--ink)" }}
            >
              {s.label}
            </a>
          ))}
          {loggedIn && (
            <Link
              href="/w"
              onClick={() => setMobileOpen(false)}
              className="mt-1 px-2 py-2.5 rounded-lg text-sm"
              style={{ color: "var(--accent)" }}
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
