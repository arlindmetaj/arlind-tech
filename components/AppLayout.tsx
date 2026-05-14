"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  loggedIn: boolean;
}

export default function AppLayout({ children, loggedIn }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: "rgba(0,0,0,0.35)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        loggedIn={loggedIn}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="lg:ml-[220px]">
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6"
          style={{
            height: 40,
            borderBottom: "1px solid var(--line)",
            background: "var(--bg)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <button
              className="lg:hidden flex items-center justify-center rounded-md p-1 transition-colors"
              style={{ color: "var(--dim)" }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={16} />
            </button>
            <span className="text-xs" style={{ color: "var(--dim)" }}>
              arlind.tech
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--dim)" }}>
            {loggedIn ? "● signed in" : "○ public"}
          </span>
        </div>

        {/* Page content */}
        <main className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-3xl">
          {children}
        </main>
      </div>
    </div>
  );
}
