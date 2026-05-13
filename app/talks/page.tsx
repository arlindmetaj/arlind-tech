import Shell from "@/components/Shell";
import { getSessionFromCookies } from "@/lib/auth";

export default async function TalksPage() {
  const loggedIn = await getSessionFromCookies();
  return (
    <Shell loggedIn={loggedIn}>
      <div>
        <h1 className="font-caveat" style={{ fontSize: 56, color: "var(--ink)" }}>Talks</h1>
        <p className="mt-2 mb-8" style={{ color: "var(--dim)" }}>Presentations & conferences</p>
        <div style={{ borderTop: "1px solid var(--line)" }} />
        <p className="mt-10 text-sm" style={{ color: "var(--dim)" }}>Coming soon — talks will be listed here.</p>
      </div>
    </Shell>
  );
}
