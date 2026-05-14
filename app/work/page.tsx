import Shell from "@/components/Shell";
import { getSessionFromCookies } from "@/lib/auth";

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
      "Contributed to improving user experience through iterative development and feedback.",
      "Conducted code reviews and provided constructive feedback to enhance team performance.",
      "Actively participated in brainstorming sessions and technical discussions to innovate and optimise features.",
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
      "Proactive in a small, fast-paced team to work towards problem solutions while adapting to existing processes and tools.",
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
      "Developed list components, tables, pages, and other platform features.",
    ],
  },
];

const education = {
  degree: "Bachelor in Informatics and Economics",
  school: "Luarasi University",
  period: "2018 – 2021",
};

const skills = {
  professional: ["ReactJS", "Flutter", "Java", "Dart", "Swift UI", "React Native", "Next.js", "Expo"],
  soft: ["Communication", "Team collaboration", "Time management", "Empathy", "Problem solving"],
};

export default async function WorkPage() {
  const loggedIn = await getSessionFromCookies();
  return (
    <Shell loggedIn={loggedIn}>
      <div className="max-w-2xl">
        <h1 className="font-caveat" style={{ fontSize: 56, color: "var(--ink)" }}>Work</h1>
        <div className="mt-1 mb-8" style={{ borderTop: "1px solid var(--line)" }} />

        {/* Experience */}
        <div className="mt-10 space-y-12">
          {experience.map((job, i) => (
            <div key={i}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-semibold text-base" style={{ color: "var(--ink)" }}>{job.role}</h2>
                  <p className="text-sm mt-0.5" style={{ color: "var(--accent)" }}>{job.company}</p>
                </div>
                <div className="text-right text-sm shrink-0" style={{ color: "var(--dim)" }}>
                  <div>{job.period}</div>
                  <div>{job.location}</div>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {job.bullets.map((b, j) => (
                  <li key={j} className="flex gap-2 text-sm" style={{ color: "var(--dim)", lineHeight: 1.65 }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: "var(--line)" }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12" style={{ borderTop: "1px solid var(--line)" }} />

        {/* Skills */}
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--dim)" }}>
              Professional Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.professional.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-lg text-sm"
                  style={{ background: "var(--hi)", color: "var(--ink)", border: "1px solid var(--line)" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--dim)" }}>
              Soft Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.soft.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-lg text-sm"
                  style={{ background: "var(--hi)", color: "var(--ink)", border: "1px solid var(--line)" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12" style={{ borderTop: "1px solid var(--line)" }} />

        {/* Education */}
        <div className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--dim)" }}>
            Education
          </h2>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold" style={{ color: "var(--ink)" }}>{education.degree}</p>
              <p className="text-sm mt-0.5" style={{ color: "var(--accent)" }}>{education.school}</p>
            </div>
            <p className="text-sm shrink-0" style={{ color: "var(--dim)" }}>{education.period}</p>
          </div>
        </div>

        <div className="mt-12" style={{ borderTop: "1px solid var(--line)" }} />

        {/* Languages & Interests */}
        <div className="mt-10 grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--dim)" }}>
              Languages
            </h2>
            <p className="text-sm" style={{ color: "var(--ink)" }}>English <span style={{ color: "var(--dim)" }}>(Professional)</span></p>
            <p className="text-sm mt-1" style={{ color: "var(--ink)" }}>Albanian <span style={{ color: "var(--dim)" }}>(Native)</span></p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--dim)" }}>
              Interests
            </h2>
            {["Reading", "Design", "Travelling"].map((i) => (
              <p key={i} className="text-sm" style={{ color: "var(--ink)" }}>{i}</p>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
