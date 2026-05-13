import Shell from "@/components/Shell";
import { getSessionFromCookies } from "@/lib/auth";

export default async function WritingPage() {
  const loggedIn = await getSessionFromCookies();
  return (
    <Shell loggedIn={loggedIn}>
      <div>
        <h1 className="font-caveat" style={{ fontSize: 56, color: "var(--ink)" }}>Writing</h1>
        <p className="mt-2 mb-8" style={{ color: "var(--dim)" }}>Essays, notes, ideas</p>
        <div style={{ borderTop: "1px solid var(--line)" }} />
        <p className="mt-10 text-sm" style={{ color: "var(--dim)" }}>Coming soon — writing will appear here.</p>
      </div>
    </Shell>
  );
}
