import { Suspense } from "react";
import PublicShell from "@/components/PublicShell";
import GitHubGraph from "@/components/GitHubGraph";
import SignInPopover from "@/components/SignInPopover";

const experience = [
  {
    role: "Software Engineer",
    company: "Ritech International AG",
    period: "June 2024 – Present",
    location: "Tirana, Albania",
    bullets: [
      "Develop and maintain cross-platform mobile applications using Flutter, delivering high-quality experiences across iOS and Android.",
      "Build and contribute to frontend web applications using React and Next.js, focusing on reusable components, routing, and performance.",
      "Collaborate closely with designers, backend engineers, and product stakeholders to deliver end-to-end features across mobile and web.",
      "Integrate REST APIs, implement authentication flows, and support role-based access and permissions.",
      "Emphasise clean architecture, maintainable codebases, and consistent user experience across platforms.",
    ],
  },
  {
    role: "Mobile Developer",
    company: "Crispy Bacon",
    period: "June 2022 – 2024",
    location: "Tirana, Albania",
    bullets: [
      "Developed and maintained mobile applications using Flutter and React Native, delivering cross-platform solutions for iOS and Android.",
      "Collaborated with designers and backend engineers to implement user-facing features and business logic.",
      "Integrated REST APIs and handled application state, navigation, and error handling.",
      "Focused on code quality, performance, and maintainability in a fast-paced product environment.",
      "Conducted code reviews and provided constructive feedback to enhance team performance.",
    ],
  },
  {
    role: "Mobile Developer",
    company: "Almotech",
    period: "July 2021 – June 2022",
    location: "Tirana, Albania",
    bullets: [
      "Developed a booking mobile app system using Flutter — allowing users to book appointments with hairdressers, barbers, and more.",
      "Worked closely with clients to specify project goals, build mockups, and design platform features.",
      "Responsible for consuming REST services, parsing JSON responses, and integrating them into the application.",
      "Experienced in maintaining, bug-fixing, and updating already built and released apps.",
    ],
  },
  {
    role: "Mobile Developer",
    company: "Rubik Technologies",
    period: "June 2020 – February 2021",
    location: "Tirana, Albania",
    bullets: [
      "Built a mobile e-commerce app with advanced functionalities including social features, product booking, and a token reward system.",
      "Developed a booking system that holds a product until the client decides to buy, with merchant approval/denial flow.",
      "Designed and implemented a unified system for merchants and clients to hold both roles simultaneously.",
    ],
  },
];

const stack = {
  Mobile: ["Flutter", "React Native", "Expo", "SwiftUI"],
  Frontend: ["React", "Next.js"],
  Languages: ["Dart", "Java", "JavaScript", "TypeScript"],
};

export default function HomePage() {
  return (
    <>
      <PublicShell>
        <div className="space-y-20">

          {/* ── About ──────────────────────────────────── */}
          <section id="about" className="space-y-10">
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
              {[
                "currently @ Ritech International AG",
                "based in Tirana, Albania",
                "open to chats",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: "var(--hi)",
                    color: "var(--dim)",
                    border: "1px solid var(--line)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Bio + Stack */}
            <div className="flex flex-col gap-10 sm:flex-row sm:gap-12">
              <div className="flex-1 space-y-4 min-w-0">
                <p style={{ color: "var(--ink)", lineHeight: 1.75 }}>
                  I build software, write about ideas, and spend a lot of time
                  tinkering with things.
                </p>
                <p style={{ color: "var(--dim)", lineHeight: 1.75 }}>
                  Over the past few years, I've worked across mobile and web,
                  taking products from early wireframes to production. Somewhere
                  along that process, my focus shifted. I'm still interested in
                  how things are built, but more in why they're built the way
                  they are — the decisions, trade-offs, and constraints behind
                  them.
                </p>
                <p style={{ color: "var(--dim)", lineHeight: 1.75 }}>
                  I care about simplicity. Not because minimalism is fashionable,
                  but because complexity compounds. Every extra layer is something
                  someone has to understand, maintain, and eventually remove. I
                  try to build things that are clear, predictable, and easy to
                  reason about — both in code and in product.
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

            {/* GitHub */}
            <div>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "var(--dim)" }}
              >
                GitHub
              </h2>
              <GitHubGraph username="arlindmetaj" />
              <p className="mt-2 text-xs" style={{ color: "var(--dim)" }}>
                <a
                  href="https://github.com/arlindmetaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70"
                >
                  github.com/arlindmetaj
                </a>
              </p>
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

          {/* ── Projects ───────────────────────────────── */}
          <section id="projects">
            <h2
              className="font-caveat"
              style={{ fontSize: 48, lineHeight: 1.1, color: "var(--ink)" }}
            >
              Projects
            </h2>
            <p className="mt-4 text-sm" style={{ color: "var(--dim)" }}>
              Coming soon — working on a few things worth sharing.
            </p>
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
            </div>
          </section>

        </div>
      </PublicShell>

      <Suspense>
        <SignInPopover />
      </Suspense>
    </>
  );
}
