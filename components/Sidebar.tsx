"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CalendarDays,
  CheckSquare,
  Target,
  Lightbulb,
  BookOpen,
  Bookmark,
  Sun,
  Moon,
  X,
} from "lucide-react";

interface SidebarProps {
  loggedIn: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const privateNav = [
  { href: "/w/week", label: "This week", Icon: CalendarDays },
  { href: "/w/todos", label: "Todos", Icon: CheckSquare },
  { href: "/w/goals", label: "Goals", Icon: Target },
  { href: "/w/ideas", label: "Ideas", Icon: Lightbulb },
  { href: "/w/books", label: "Books", Icon: BookOpen },
  { href: "/w/bookmarks", label: "Bookmarks", Icon: Bookmark },
];

export default function Sidebar({ loggedIn, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = useState(false);

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

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-full flex flex-col z-30 transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      style={{
        width: 220,
        background: "var(--bg)",
        borderRight: "1px solid var(--line)",
      }}
    >
      {/* Logo */}
      <div
        className="px-4 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-75"
        >
          <img
            src={dark ? "/logo-light.svg" : "/logo.svg"}
            alt="arlind.tech"
            width={28}
            height={28}
            style={{ borderRadius: 6 }}
          />
          <span
            style={{
              color: "var(--ink)",
              fontFamily: "'Caveat', cursive",
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            arlind.tech
          </span>
        </Link>
        <button
          className="lg:hidden flex items-center justify-center"
          onClick={onClose}
          style={{ color: "var(--dim)" }}
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p
          className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--dim)" }}
        >
          Dashboard
        </p>
        {privateNav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/w/week" && pathname === "/w");
          return (
            <button
              key={item.href}
              onClick={() => {
                onClose?.();
                router.push(item.href);
              }}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors text-left"
              style={{
                color: active ? "var(--accent)" : "var(--ink)",
                background: active ? "var(--hi)" : "transparent",
                fontWeight: active ? 500 : 400,
              }}
            >
              <item.Icon
                size={14}
                style={{
                  color: active ? "var(--accent)" : "var(--dim)",
                  flexShrink: 0,
                }}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom bar */}
      <div
        className="px-3 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <button
          onClick={toggleDark}
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-colors"
          style={{ color: "var(--dim)", background: "var(--hi)" }}
          title="Toggle dark mode"
        >
          {dark ? <Sun size={12} /> : <Moon size={12} />}
          {dark ? "Light" : "Dark"}
        </button>
        {loggedIn && (
          <button
            onClick={signOut}
            className="text-xs px-2 py-1 rounded-lg transition-colors hover:opacity-70"
            style={{ color: "var(--dim)" }}
          >
            Sign out
          </button>
        )}
      </div>
    </aside>
  );
}
