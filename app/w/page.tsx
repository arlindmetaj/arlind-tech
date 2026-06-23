"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isToday } from "date-fns";
import { Target, CheckSquare, NotebookPen, ArrowUpRight } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  progress: number;
  category: "PROFESSIONAL" | "PERSONAL";
}

interface Todo {
  id: string;
  title: string;
  done: boolean;
}

interface Note {
  id: string;
  content: string;
  date: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/goals").then((r) => r.json()),
      fetch("/api/todos").then((r) => r.json()),
      fetch("/api/notes").then((r) => r.json()),
    ]).then(([g, t, n]) => {
      setGoals(Array.isArray(g) ? g : []);
      setTodos(Array.isArray(t) ? t : []);
      setNotes(Array.isArray(n) ? n : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const activeGoals = goals.filter((g) => g.progress < 100);
  const professionalGoals = activeGoals.filter((g) => g.category === "PROFESSIONAL");
  const personalGoals = activeGoals.filter((g) => g.category === "PERSONAL");
  const topGoal = [...activeGoals].sort((a, b) => b.progress - a.progress)[0];

  const pendingTodos = todos.filter((t) => !t.done);
  const doneTodos = todos.filter((t) => t.done);

  const lastNote = [...notes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <div
      className="fixed left-0 lg:left-[220px] right-0 bottom-0 overflow-y-auto"
      style={{ top: 40 }}
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10">

        {/* Header */}
        <div className="mb-8">
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: "var(--dim)" }}
          >
            {today}
          </p>
          <h1
            className="font-caveat leading-none"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", color: "var(--ink)" }}
          >
            {greeting}, Arlind
          </h1>
          <p className="text-sm mt-3 italic" style={{ color: "var(--dim)" }}>
            Hard work, dedication and perseverance.
          </p>
        </div>

        {loading ? (
          <p className="text-sm" style={{ color: "var(--dim)" }}>Loading…</p>
        ) : (
          <>
            {/* KPI strip */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <Kpi label="Active goals" value={activeGoals.length} />
              <Kpi label="Todos left" value={pendingTodos.length} />
              <Kpi label="Journal entries" value={notes.length} />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Goals */}
              <button
                className="dash-card rounded-2xl p-5 text-left sm:col-span-2"
                onClick={() => router.push("/w/goals")}
              >
                <CardHead Icon={Target} title="Goals" />
                {activeGoals.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--dim)" }}>No active goals.</p>
                ) : (
                  <div className="flex items-start gap-8">
                    <div className="flex gap-6 shrink-0">
                      <div>
                        <p className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>{professionalGoals.length}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--dim)" }}>professional</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>{personalGoals.length}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--dim)" }}>personal</p>
                      </div>
                    </div>
                    {topGoal && (
                      <div className="flex-1 min-w-0 pl-8" style={{ borderLeft: "1px solid var(--line)" }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs truncate" style={{ color: "var(--dim)" }}>{topGoal.title}</span>
                          <span className="text-xs font-mono ml-3" style={{ color: "var(--dim)" }}>{topGoal.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: `${topGoal.progress}%`, background: "var(--accent)" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </button>

              {/* Todos */}
              <button
                className="dash-card rounded-2xl p-5 text-left"
                onClick={() => router.push("/w/todos")}
              >
                <CardHead Icon={CheckSquare} title="Todos" />
                {todos.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--dim)" }}>Nothing here yet.</p>
                ) : (
                  <div>
                    <div className="flex items-center gap-6 mb-3">
                      <div>
                        <p className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>{pendingTodos.length}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--dim)" }}>remaining</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold" style={{ color: "var(--dim)" }}>{doneTodos.length}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--dim)" }}>done</p>
                      </div>
                    </div>
                    {pendingTodos[0] && (
                      <div className="pt-3" style={{ borderTop: "1px solid var(--line)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--dim)" }}>Next up</p>
                        <p className="text-sm truncate" style={{ color: "var(--ink)" }}>{pendingTodos[0].title}</p>
                      </div>
                    )}
                  </div>
                )}
              </button>

              {/* Journal */}
              <button
                className="dash-card rounded-2xl p-5 text-left"
                onClick={() => router.push("/w/journal")}
              >
                <CardHead Icon={NotebookPen} title="Journal" />
                {!lastNote ? (
                  <p className="text-sm" style={{ color: "var(--dim)" }}>No entries yet.</p>
                ) : (
                  <div>
                    <p className="text-xs mb-2" style={{ color: "var(--dim)" }}>
                      {isToday(parseISO(lastNote.date))
                        ? "Today"
                        : format(parseISO(lastNote.date), "MMMM d, yyyy")}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "var(--ink)",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {lastNote.content}
                    </p>
                  </div>
                )}
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="rounded-2xl px-4 py-3"
      style={{ border: "1px solid var(--line)", background: "var(--hi)" }}
    >
      <p className="text-2xl font-semibold leading-none" style={{ color: "var(--ink)" }}>{value}</p>
      <p className="text-xs mt-1.5" style={{ color: "var(--dim)" }}>{label}</p>
    </div>
  );
}

function CardHead({
  Icon,
  title,
}: {
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: "var(--dim)" }} />
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--dim)" }}
        >
          {title}
        </span>
      </div>
      <ArrowUpRight size={14} style={{ color: "var(--dim)" }} />
    </div>
  );
}
