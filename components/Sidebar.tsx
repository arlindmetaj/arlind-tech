"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
  loggedIn: boolean;
}

const publicNav = [
  { href: "/", label: "About", icon: "◇" },
  { href: "/work", label: "Work", icon: "◇" },
  { href: "/projects", label: "Projects", icon: "◇" },
  { href: "/writing", label: "Writing", icon: "◇" },
  { href: "/talks", label: "Talks", icon: "◇" },
  { href: "/contact", label: "Contact", icon: "◇" },
];

const privateNav = [
  { href: "/w/week", label: "This week", icon: "▦" },
  { href: "/w/todos", label: "Todos", icon: "✓" },
  { href: "/w/goals", label: "Goals", icon: "◎" },
  { href: "/w/ideas", label: "Ideas", icon: "✦" },
  { href: "/w/books", label: "Books", icon: "📖" },
  { href: "/w/bookmarks", label: "Bookmarks", icon: "↗" },
];

export default function Sidebar({ loggedIn }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
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

  function handlePrivateClick(href: string) {
    if (!loggedIn) {
      router.push(`/?signin=&next=${encodeURIComponent(href)}`);
    } else {
      router.push(href);
    }
  }

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      className="fixed top-0 left-0 h-full flex flex-col z-30"
      style={{
        width: 220,
        background: "var(--bg)",
        borderRight: "1px solid var(--line)",
      }}
    >
      {/* Logo */}
      <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--line)" }}>
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-75">
          <img
            src={dark ? "/logo-light.svg" : "/logo.svg"}
            alt="arlind.tech"
            width={28}
            height={28}
            style={{ borderRadius: 6 }}
          />
          <span style={{ color: "var(--ink)", fontFamily: "'Caveat', cursive", fontSize: 20, lineHeight: 1 }}>
            arlind.tech
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* Public */}
        <div>
          <p className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--dim)" }}>
            Public · Resume
          </p>
          {publicNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors"
                style={{
                  color: active ? "var(--accent)" : "var(--ink)",
                  background: active ? "var(--hi)" : "transparent",
                  fontWeight: active ? 500 : 400,
                }}
              >
                <span style={{ color: "var(--dim)", fontSize: 12 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Private */}
        <div>
          <p className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-widest flex items-center gap-1" style={{ color: "var(--dim)" }}>
            Private · Dashboard
            {!loggedIn && <span className="ml-1">🔒</span>}
          </p>
          {privateNav.map((item) => {
            const active = pathname === item.href || (item.href === "/w/week" && pathname === "/w");
            return (
              <button
                key={item.href}
                onClick={() => handlePrivateClick(item.href)}
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors text-left"
                style={{
                  color: active ? "var(--accent)" : loggedIn ? "var(--ink)" : "var(--dim)",
                  background: active ? "var(--hi)" : "transparent",
                  fontWeight: active ? 500 : 400,
                  opacity: loggedIn ? 1 : 0.6,
                }}
              >
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                {item.label}
                {!loggedIn && <span className="ml-auto text-xs">🔒</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom bar */}
      <div
        className="px-3 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <button
          onClick={toggleDark}
          className="text-xs px-2 py-1 rounded-lg transition-colors"
          style={{ color: "var(--dim)", background: "var(--hi)" }}
          title="Toggle dark mode"
        >
          {dark ? "☀ Light" : "☾ Dark"}
        </button>
        {loggedIn && (
          <button
            onClick={signOut}
            className="text-xs px-2 py-1 rounded-lg transition-colors"
            style={{ color: "var(--dim)" }}
          >
            Sign out
          </button>
        )}
      </div>
    </aside>
  );
}
