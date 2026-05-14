import Shell from "@/components/Shell";
import { getSessionFromCookies } from "@/lib/auth";

export default async function ContactPage() {
  const loggedIn = await getSessionFromCookies();
  return (
    <Shell loggedIn={loggedIn}>
      <div className="max-w-xl">
        <h1 className="font-caveat" style={{ fontSize: 56, color: "var(--ink)" }}>Contact</h1>
        <p className="mt-1 mb-8" style={{ color: "var(--dim)" }}>Get in touch</p>
        <div style={{ borderTop: "1px solid var(--line)" }} />

        <div className="mt-10 space-y-8">
          <p style={{ color: "var(--ink)", lineHeight: 1.75 }}>
            The best way to reach me is by email. I try to respond to everyone.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs w-16 shrink-0" style={{ color: "var(--dim)" }}>Email</span>
              <a
                href="mailto:arlindmetaj17@gmail.com"
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--accent)" }}
              >
                arlindmetaj17@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs w-16 shrink-0" style={{ color: "var(--dim)" }}>Phone</span>
              <a
                href="tel:+355693260462"
                className="text-sm transition-opacity hover:opacity-70"
                style={{ color: "var(--ink)" }}
              >
                +355 69 326 0462
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs w-16 shrink-0" style={{ color: "var(--dim)" }}>Location</span>
              <span className="text-sm" style={{ color: "var(--ink)" }}>Tirana, Albania</span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
