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
              Mobile &amp; Frontend Developer
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

          {/* Bio */}
          <div className="space-y-3">
            <p style={{ color: "var(--ink)", lineHeight: 1.75 }}>
              Experienced Mobile and Frontend Developer with a strong focus on cross-platform
              development. Proficient in Flutter, React Native, React, Next.js, Expo, and SwiftUI —
              building robust and intuitive applications for mobile and web.
            </p>
            <p style={{ color: "var(--dim)", lineHeight: 1.75 }}>
              Skilled in designing, developing, and deploying scalable solutions across multiple
              platforms, with a strong emphasis on performance, maintainability, and user experience.
              Adaptable to new technologies, with a proven ability to contribute to high-quality,
              production-ready projects.
            </p>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--dim)" }}>
              Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {["Flutter", "React Native", "React", "Next.js", "Expo", "SwiftUI", "Dart", "Java"].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-sm"
                  style={{ background: "var(--hi)", color: "var(--ink)", border: "1px solid var(--line)" }}
                >
                  {skill}
                </span>
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
