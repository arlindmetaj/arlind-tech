import { Suspense } from "react";
import Shell from "@/components/Shell";
import SignInPopover from "@/components/SignInPopover";
import { getSessionFromCookies } from "@/lib/auth";

export default async function AboutPage() {
  const loggedIn = await getSessionFromCookies();

  return (
    <>
      <Shell loggedIn={loggedIn}>
        <div className="space-y-10 max-w-2xl">
          {/* Hero */}
          <div>
            <h1
              className="font-caveat"
              style={{ fontSize: 72, lineHeight: 1.05, color: "var(--ink)" }}
            >
              Arlind Metaj
            </h1>
            <p className="mt-2 text-lg" style={{ color: "var(--dim)" }}>
              engineer · writer · maker of things
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {["currently @ Ritech International AG", "based in Tirana, Albania", "open to chats"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm"
                style={{ background: "var(--hi)", color: "var(--dim)", border: "1px solid var(--line)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bio + Stack */}
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-12">
            {/* Bio */}
            <div className="flex-1 space-y-4 min-w-0">
              <p style={{ color: "var(--ink)", lineHeight: 1.75 }}>
                I build software, write about ideas, and spend a lot of time tinkering with things.
              </p>
              <p style={{ color: "var(--dim)", lineHeight: 1.75 }}>
                Over the past few years, I've worked across mobile and web, taking products from early
                wireframes to production. Somewhere along that process, my focus shifted. I'm still
                interested in how things are built, but more in why they're built the way they are,
                the decisions, trade-offs, and constraints behind them.
              </p>
              <p style={{ color: "var(--dim)", lineHeight: 1.75 }}>
                I care about simplicity. Not because minimalism is fashionable, but because complexity
                compounds. Every extra layer is something someone has to understand, maintain, and
                eventually remove. I try to build things that are clear, predictable, and easy to
                reason about, both in code and in product.
              </p>
              <p style={{ color: "var(--dim)", lineHeight: 1.75 }}>
                Most of my time goes into reading, thinking, and trying to understand how things work,
                from systems to decisions to product. I travel when I can, notice details others skip,
                and write occasionally to make sense of ideas.
              </p>
            </div>

            {/* Stack */}
            <div className="shrink-0 space-y-5 sm:w-40">
              {[
                { label: "Mobile", items: ["Flutter", "React Native", "Expo", "SwiftUI"] },
                { label: "Frontend", items: ["React", "Next.js"] },
                { label: "Languages", items: ["Dart", "Java"] },
              ].map(({ label, items }) => (
                <div key={label}>
                  <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--dim)" }}>
                    {label}
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs"
                        style={{ background: "var(--hi)", color: "var(--ink)", border: "1px solid var(--line)" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--line)" }} />

          {/* Pinned cards */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--dim)" }}>
              Pinned
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href="/work"
                className="block p-5 rounded-2xl transition-all hover:shadow-sm"
                style={{ border: "1px solid var(--line)", background: "var(--bg)" }}
              >
                <div className="text-xs mb-1" style={{ color: "var(--accent)" }}>Current role</div>
                <div className="font-medium" style={{ color: "var(--ink)" }}>Mobile &amp; Frontend Developer</div>
                <div className="text-sm mt-1" style={{ color: "var(--dim)" }}>Ritech International AG · June 2024 – Present</div>
              </a>
              <a
                href="/contact"
                className="block p-5 rounded-2xl transition-all hover:shadow-sm"
                style={{ border: "1px solid var(--line)", background: "var(--bg)" }}
              >
                <div className="text-xs mb-1" style={{ color: "var(--accent)" }}>Get in touch</div>
                <div className="font-medium" style={{ color: "var(--ink)" }}>arlindmetaj17@gmail.com</div>
                <div className="text-sm mt-1" style={{ color: "var(--dim)" }}>+355 69 326 0462 · Tirana, Albania</div>
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
