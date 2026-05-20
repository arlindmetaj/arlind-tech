"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isToday } from "date-fns";

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

  const pendingTodos = todos.filter((t) => !t.done);
  const doneTodos = todos.filter((t) => t.done);

  const lastNote = [...notes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  return (
    <div
      className="fixed left-0 lg:left-[220px] right-0 bottom-0 overflow-y-auto"
      style={{ top: 40 }}
    >
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Quote */}
        <p
          className="font-caveat leading-tight mb-12"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "var(--ink)" }}
        >
          Hard work,<br />dedication<br />and perseverance.
        </p>

        {loading ? (
          <p className="text-sm" style={{ color: "var(--dim)" }}>Loading…</p>
        ) : (
          <div className="space-y-3">

            {/* Goals */}
            <div
              className="rounded-2xl p-5 cursor-pointer transition-opacity hover:opacity-80"
              style={{ border: "1px solid var(--line)", background: "var(--bg)" }}
              onClick={() => router.push("/w/goals")}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--dim)" }}>Goals</p>
              {activeGoals.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--dim)" }}>No active goals.</p>
              ) : (
                <div className="space-y-2">
                  {professionalGoals.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "var(--ink)" }}>Professional</span>
                      <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>{professionalGoals.length} active</span>
                    </div>
                  )}
                  {personalGoals.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "var(--ink)" }}>Personal</span>
                      <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>{personalGoals.length} active</span>
                    </div>
                  )}
                  {/* Top goal by progress */}
                  {activeGoals.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--line)" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs truncate" style={{ color: "var(--dim)" }}>
                          {activeGoals.sort((a, b) => b.progress - a.progress)[0].title}
                        </span>
                        <span className="text-xs font-mono ml-3" style={{ color: "var(--dim)" }}>
                          {activeGoals.sort((a, b) => b.progress - a.progress)[0].progress}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                        <div
                          className="h-1 rounded-full"
                          style={{
                            width: `${activeGoals.sort((a, b) => b.progress - a.progress)[0].progress}%`,
                            background: "var(--accent)",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Todos */}
            <div
              className="rounded-2xl p-5 cursor-pointer transition-opacity hover:opacity-80"
              style={{ border: "1px solid var(--line)", background: "var(--bg)" }}
              onClick={() => router.push("/w/todos")}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--dim)" }}>Todos</p>
              {todos.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--dim)" }}>Nothing here yet.</p>
              ) : (
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>{pendingTodos.length}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--dim)" }}>remaining</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold" style={{ color: "var(--dim)" }}>{doneTodos.length}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--dim)" }}>done</p>
                  </div>
                  {pendingTodos[0] && (
                    <div className="flex-1 min-w-0 pl-4" style={{ borderLeft: "1px solid var(--line)" }}>
                      <p className="text-xs mb-1" style={{ color: "var(--dim)" }}>Next up</p>
                      <p className="text-sm truncate" style={{ color: "var(--ink)" }}>{pendingTodos[0].title}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Journal */}
            <div
              className="rounded-2xl p-5 cursor-pointer transition-opacity hover:opacity-80"
              style={{ border: "1px solid var(--line)", background: "var(--bg)" }}
              onClick={() => router.push("/w/journal")}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--dim)" }}>Journal</p>
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
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {lastNote.content}
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
