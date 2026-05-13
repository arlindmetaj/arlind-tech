import Sidebar from "./Sidebar";

interface ShellProps {
  children: React.ReactNode;
  loggedIn?: boolean;
}

export default function Shell({ children, loggedIn = false }: ShellProps) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar loggedIn={loggedIn} />
      <div style={{ marginLeft: 220 }}>
        {/* Top bar */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-6"
          style={{
            height: 40,
            borderBottom: "1px solid var(--line)",
            background: "var(--bg)",
          }}
        >
          <span className="text-xs" style={{ color: "var(--dim)" }}>
            arlind.tech
          </span>
          <span className="text-xs" style={{ color: "var(--dim)" }}>
            {loggedIn ? "● signed in" : "○ public"}
          </span>
        </div>
        {/* Main content */}
        <main className="px-10 py-8 max-w-3xl">
          {children}
        </main>
      </div>
    </div>
  );
}
