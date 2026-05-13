import Shell from "@/components/Shell";
import { getSessionFromCookies } from "@/lib/auth";

export default async function ContactPage() {
  const loggedIn = await getSessionFromCookies();
  return (
    <Shell loggedIn={loggedIn}>
      <div>
        <h1 className="font-caveat" style={{ fontSize: 56, color: "var(--ink)" }}>Contact</h1>
        <p className="mt-2 mb-8" style={{ color: "var(--dim)" }}>Get in touch</p>
        <div style={{ borderTop: "1px solid var(--line)" }} />
        <div className="mt-10 space-y-4">
          <p style={{ color: "var(--ink)", lineHeight: 1.7 }}>
            The best way to reach me is by email. I try to respond to everyone.
          </p>
          <a
            href="mailto:arlindmetaj17@gmail.com"
            className="inline-block text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            arlindmetaj17@gmail.com →
          </a>
        </div>
      </div>
    </Shell>
  );
}
