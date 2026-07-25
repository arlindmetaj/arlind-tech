import { Suspense } from "react";
import { Download } from "lucide-react";
import PublicShell from "@/components/PublicShell";
import GitHubGraph from "@/components/GitHubGraph";
import SignInPopover from "@/components/SignInPopover";
import { getSessionFromCookies } from "@/lib/auth";

const experience = [
  {
    role: "Software Engineer",
    company: "Ritech International AG",
    period: "June 2024 – Present",
    location: "Tirana, Albania",
    bullets: [
      "Worked closely with product and operations teams to study, analyse, and validate features before development begins, ensuring solutions are grounded in real business needs and user behaviour.",
      "Contributed to product discovery and decision-making by evaluating use cases, surfacing edge cases early, and challenging assumptions to reduce rework downstream.",
      "Translated validated product requirements into clean, maintainable technical implementations delivered across multiple platforms.",
      "Collaborated with designers to review and refine interfaces, ensuring proposed solutions are both technically sound and aligned with user experience goals.",
      "Acted as a bridge between engineering and non-engineering stakeholders, making technical trade-offs visible and helping the team move with clarity and confidence.",
      "Drove feature quality end-to-end — from early scoping and design validation through to implementation, testing, and release.",
    ],
    projects: [
      { name: "PayByPhone — Back Office Rewrite (SouthernCross)", description: "Part of the frontend team responsible for rewriting a legacy back office platform. Owned one of the most complex modules (Rates), working closely with Product, Operations, Commercial, and Engineering teams." },
      { name: "PayByPhone — NorthStar", description: "Contributed to the migration of a native app to a Flutter module, involved from the early stages through to successful shipment." },
      { name: "CVP", description: "Built a Flutter module integrated into PayByPhone for the UK market, enabling customers to pay for MOT, SMR services, and charge their electric vehicles." },
    ],
  },
  {
    role: "Mobile Engineer",
    company: "Crispy Bacon",
    period: "June 2022 – June 2024",
    location: "Tirana, Albania",
    bullets: [
      "Established Flutter and React Native development standards and code review practices across the engineering team, driving measurable improvements in consistency, quality, and reliability in production.",
      "Defined state management patterns, navigation architecture, and error handling strategies adopted across the mobile codebase.",
      "Collaborated with designers and backend engineers to implement user-facing features, owning delivery from technical scoping through to release.",
      "Led technical planning discussions and shaped implementation approaches for key product features.",
    ],
    projects: [
      { name: "MyCampy 3.0", description: "Flutter hybrid app to manage bikes and components, monitor wear, control EPS electronic gear shifting and track sessions in real time. 5/5 Play Store rating · Red Dot Winner 2024." },
      { name: "Cup4You", description: "Flutter app for managing orders and recipes for La Cimbali fully automatic coffee machines. Enables drink customisation, recipe saving, and machine pairing via QR code." },
      { name: "ConTe.it Loans", description: "Flutter app for a 100% digital personal loan platform, simplifying applications through digital signatures and Open Banking integration." },
      { name: "Facile.it", description: "Led the full React Native rewrite of one of Italy's most recognised financial comparison platforms, rebuilding the mobile app from the ground up." },
      { name: "LiuJo", description: "Rebuilt the mobile app for the established Italian fashion brand from scratch in React Native, delivering a modernised experience across iOS and Android." },
    ],
  },
  {
    role: "Mobile Engineer",
    company: "Almotech",
    period: "July 2021 – June 2022",
    location: "Tirana, Albania",
    bullets: [
      "Built and shipped a production Flutter application from the ground up, owning the full development lifecycle from requirements gathering through to app store release.",
      "Worked directly with clients to define project goals, translate business requirements into technical specifications, and align platform features with product vision.",
      "Managed ongoing maintenance, bug fixing, and iterative feature development across live production applications.",
      "Operated effectively in a small, fast-paced team, adapting quickly to shifting priorities and contributing across multiple areas of the product.",
    ],
    projects: [],
  },
  {
    role: "Software Developer",
    company: "Rubik Technologies",
    period: "June 2020 – February 2021",
    location: "Tirana, Albania",
    bullets: [
      "Contributed to the development of a mobile e-commerce platform, building out a product booking flow, social features, and a token-based rewards system for merchants and clients.",
      "Designed and implemented a merchant approval system that controlled product availability based on purchase intent, reducing premature stock conflicts.",
      "Built a unified dual-role account model, allowing users to seamlessly switch between merchant and client roles within the same session.",
    ],
    projects: [],
  },
];

const stack = {
  Mobile: ["Flutter", "React Native"],
  Frontend: ["React", "Next.js", "TypeScript", "JavaScript"],
  Architecture: ["Clean Architecture", "BLoC", "Riverpod", "MVVM"],
};

export default async function HomePage() {
  const loggedIn = await getSessionFromCookies();

  return (
    <>
      <PublicShell>
        <div className="space-y-20">

          {/* ── About ──────────────────────────────────── */}
          <section id="about" className="space-y-10">
            {/* Hero */}
            <div className="relative">
              <div className="relative space-y-6" style={{ zIndex: 1 }}>
                <div>
                  <h1
                    className="font-caveat hero-reveal hero-d1"
                    style={{
                      fontSize: "clamp(3rem, 9vw, 5rem)",
                      lineHeight: 1.02,
                      color: "var(--ink)",
                    }}
                  >
                    Arlind Metaj
                  </h1>
                  <p
                    className="hero-reveal hero-d2 mt-3 text-base"
                    style={{ color: "var(--dim)" }}
                  >
                    engineer · writer · maker of things — based in Tirana, Albania
                  </p>
                </div>

                {/* CTAs */}
                <div className="hero-reveal hero-d3 flex flex-wrap gap-3">
                  <a
                    href="#contact"
                    className="cta-primary px-5 py-2.5 rounded-xl text-sm font-medium"
                  >
                    Get in touch
                  </a>
                  <a
                    href="#work"
                    className="cta-secondary px-5 py-2.5 rounded-xl text-sm font-medium"
                  >
                    View work
                  </a>
                  <a
                    href="/Arlind_Metaj_CV.pdf"
                    download
                    className="cta-secondary px-5 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2"
                  >
                    <Download size={15} />
                    Download CV
                  </a>
                </div>
              </div>
            </div>

            {/* Bio + Stack */}
            <div className="flex flex-col gap-10 sm:flex-row sm:gap-12">
              <div className="flex-1 space-y-4 min-w-0">
                <p style={{ color: "var(--ink)", lineHeight: 1.75 }}>
                  Software Engineer with experience designing and delivering
                  high-quality digital products across multiple platforms. Known
                  for combining strong engineering fundamentals with a sharp
                  product sensibility — thinking beyond implementation to
                  understand user needs, business goals, and long-term
                  maintainability.
                </p>
                <p style={{ color: "var(--dim)", lineHeight: 1.75 }}>
                  Comfortable owning complex problems end-to-end, from early
                  architecture decisions through to production. Thrives in
                  collaborative environments where engineering, design, and
                  product thinking intersect.
                </p>
                <p style={{ color: "var(--dim)", lineHeight: 1.75 }}>
                  Most of my time goes into reading, thinking, and trying to
                  understand how things work — from systems to decisions to
                  product. I travel when I can, notice details others skip, and
                  write occasionally to make sense of ideas.
                </p>
              </div>

              {/* Stack */}
              <div className="shrink-0 space-y-5 sm:w-40">
                {Object.entries(stack).map(([label, items]) => (
                  <div key={label}>
                    <h2
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: "var(--dim)" }}
                    >
                      {label}
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg text-xs"
                          style={{
                            background: "var(--hi)",
                            color: "var(--ink)",
                            border: "1px solid var(--line)",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

          <div style={{ borderTop: "1px solid var(--line)" }} />

          {/* ── Work ───────────────────────────────────── */}
          <section id="work" className="space-y-10">
            <h2
              className="font-caveat"
              style={{ fontSize: 48, lineHeight: 1.1, color: "var(--ink)" }}
            >
              Work
            </h2>

            <div className="space-y-12">
              {experience.map((job, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3
                        className="font-semibold text-base"
                        style={{ color: "var(--ink)" }}
                      >
                        {job.role}
                      </h3>
                      <p
                        className="text-sm mt-0.5"
                        style={{ color: "var(--accent)" }}
                      >
                        {job.company}
                      </p>
                    </div>
                    <div
                      className="text-right text-sm shrink-0"
                      style={{ color: "var(--dim)" }}
                    >
                      <div>{job.period}</div>
                      <div>{job.location}</div>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {job.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="flex gap-2 text-sm"
                        style={{ color: "var(--dim)", lineHeight: 1.65 }}
                      >
                        <span
                          className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                          style={{ background: "var(--line)" }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {job.projects.length > 0 && (
                    <div className="mt-6">
                      <h4
                        className="text-xs font-semibold uppercase tracking-widest mb-3"
                        style={{ color: "var(--dim)" }}
                      >
                        Selected projects
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {job.projects.map((p, j) => (
                          <div key={j} className="proj-card rounded-xl p-4">
                            <p
                              className="text-sm font-medium flex items-baseline gap-2"
                              style={{ color: "var(--ink)" }}
                            >
                              <span
                                className="inline-block w-1.5 h-1.5 rounded-full shrink-0 translate-y-[-1px]"
                                style={{ background: "var(--accent)" }}
                              />
                              <span className="min-w-0">{p.name}</span>
                            </p>
                            <p
                              className="text-xs mt-2"
                              style={{ color: "var(--dim)", lineHeight: 1.65 }}
                            >
                              {p.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Education */}
            <div
              style={{ borderTop: "1px solid var(--line)", paddingTop: "2rem" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "var(--dim)" }}
              >
                Education
              </h3>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="font-semibold" style={{ color: "var(--ink)" }}>
                    Bachelor in Informatics and Economics
                  </p>
                  <p
                    className="text-sm mt-0.5"
                    style={{ color: "var(--accent)" }}
                  >
                    Luarasi University
                  </p>
                </div>
                <p className="text-sm shrink-0" style={{ color: "var(--dim)" }}>
                  2018 – 2021
                </p>
              </div>
            </div>
          </section>

          <div style={{ borderTop: "1px solid var(--line)" }} />

          {/* ── AI ─────────────────────────────────────── */}
          <section id="ai" className="space-y-6">
            <h2
              className="font-caveat"
              style={{ fontSize: 48, lineHeight: 1.1, color: "var(--ink)" }}
            >
              AI
            </h2>
            <div className="space-y-4">
              <p style={{ color: "var(--ink)", lineHeight: 1.75 }}>
                I'm less interested in what AI can do today and more in where it's heading. The
                trajectory feels significant, not just as a new category of tool, but as a shift
                in how software gets built and what becomes worth building. I think most people are
                still calibrating to the current moment rather than the direction.
              </p>
              <p style={{ color: "var(--dim)", lineHeight: 1.75 }}>
                For anyone building software, the interesting question isn't whether to engage with
                it, it's how to think about it clearly enough to make good decisions with it.
              </p>
            </div>
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--dim)" }}
              >
                Tools I use
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Claude Code", "GitHub Copilot", "Cursor", "Codex"].map((tool) => (
                  <span
                    key={tool}
                    className="px-2.5 py-1 rounded-lg text-sm"
                    style={{
                      background: "var(--hi)",
                      color: "var(--ink)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <div style={{ borderTop: "1px solid var(--line)" }} />

          {/* ── Contact ────────────────────────────────── */}
          <section id="contact" className="space-y-6">
            <h2
              className="font-caveat"
              style={{ fontSize: 48, lineHeight: 1.1, color: "var(--ink)" }}
            >
              Contact
            </h2>
            <p style={{ color: "var(--ink)", lineHeight: 1.75 }}>
              The best way to reach me is by email. I try to respond to everyone.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span
                  className="text-xs w-16 shrink-0"
                  style={{ color: "var(--dim)" }}
                >
                  Email
                </span>
                <a
                  href="mailto:arlindmetaj17@gmail.com"
                  className="text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--accent)" }}
                >
                  arlindmetaj17@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs w-16 shrink-0"
                  style={{ color: "var(--dim)" }}
                >
                  Phone
                </span>
                <a
                  href="tel:+355693260462"
                  className="text-sm transition-opacity hover:opacity-70"
                  style={{ color: "var(--ink)" }}
                >
                  +355 69 326 0462
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs w-16 shrink-0"
                  style={{ color: "var(--dim)" }}
                >
                  Location
                </span>
                <span className="text-sm" style={{ color: "var(--ink)" }}>
                  Tirana, Albania
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs w-16 shrink-0"
                  style={{ color: "var(--dim)" }}
                >
                  Résumé
                </span>
                <a
                  href="/Arlind_Metaj_CV.pdf"
                  download
                  className="text-sm font-medium inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
                  style={{ color: "var(--accent)" }}
                >
                  <Download size={14} />
                  Download CV (PDF)
                </a>
              </div>
            </div>
          </section>

          {loggedIn && (
            <>
              <div style={{ borderTop: "1px solid var(--line)" }} />

              {/* ── GitHub ─────────────────────────────────── */}
              <section id="github" className="space-y-4">
                <h2
                  className="font-caveat"
                  style={{ fontSize: 48, lineHeight: 1.1, color: "var(--ink)" }}
                >
                  GitHub
                </h2>
                <GitHubGraph username="arlindmetaj" />
                <p className="text-xs" style={{ color: "var(--dim)" }}>
                  <a
                    href="https://github.com/arlindmetaj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-70"
                  >
                    github.com/arlindmetaj
                  </a>
                </p>
              </section>
            </>
          )}

        </div>
      </PublicShell>

      <Suspense>
        <SignInPopover />
      </Suspense>
    </>
  );
}
