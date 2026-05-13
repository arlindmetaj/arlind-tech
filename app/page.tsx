import { Suspense } from "react";
import Shell from "@/components/Shell";
import SignInPopover from "@/components/SignInPopover";
import { getSessionFromCookies } from "@/lib/auth";

export default async function AboutPage() {
  const loggedIn = await getSessionFromCookies();

  return (
    <>
      <Shell loggedIn={loggedIn}>
        <div className="space-y-10">
          {/* Hero */}
          <div>
            <h1
              className="font-caveat"
              style={{ fontSize: 72, lineHeight: 1.05, color: "var(--ink)" }}
            >
              Arlind
            </h1>
            <p className="mt-2 text-lg" style={{ color: "var(--dim)" }}>
              engineer · writer · maker of things
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {["currently @ studio", "based in tirana", "open to chats"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm"
                style={{ background: "var(--hi)", color: "var(--dim)", border: "1px solid var(--line)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bio */}
          <div className="max-w-xl space-y-3">
            <p style={{ color: "var(--ink)", lineHeight: 1.7 }}>
              I build software, write about ideas, and tinker with things. Currently working on
              products at the intersection of design and engineering.
            </p>
            <p style={{ color: "var(--dim)", lineHeight: 1.7 }}>
              I care about simplicity, craft, and making things that actually work. Sometimes I
              give talks, sometimes I write. This is my corner of the internet.
            </p>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--line)" }} />

          {/* Pinned cards */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--dim)" }}>
              Pinned
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href="/projects"
                className="block p-5 rounded-2xl transition-all hover:shadow-sm"
                style={{ border: "1px solid var(--line)", background: "var(--bg)" }}
              >
                <div className="text-xs mb-1" style={{ color: "var(--accent)" }}>Recent project</div>
                <div className="font-medium" style={{ color: "var(--ink)" }}>arlind.tech</div>
                <div className="text-sm mt-1" style={{ color: "var(--dim)" }}>This personal site — built with Next.js, Tailwind, Prisma.</div>
              </a>
              <a
                href="/writing"
                className="block p-5 rounded-2xl transition-all hover:shadow-sm"
                style={{ border: "1px solid var(--line)", background: "var(--bg)" }}
              >
                <div className="text-xs mb-1" style={{ color: "var(--accent)" }}>Recent post</div>
                <div className="font-medium" style={{ color: "var(--ink)" }}>On building in public</div>
                <div className="text-sm mt-1" style={{ color: "var(--dim)" }}>Why sharing the process matters more than the result.</div>
              </a>
            </div>
          </div>
        </div>
      </Shell>

      <Suspense>
        <SignInPopover />
      </Suspense>
    </>
  );
}
