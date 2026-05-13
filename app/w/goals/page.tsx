"use client";

import { useState, useEffect } from "react";

interface Goal {
  id: string;
  title: string;
  progress: number;
  note: string;
  order: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await fetch("/api/goals").then((r) => r.json());
      setGoals(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!input.trim()) return;
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input.trim() }),
    });
    setInput("");
    load();
  }

  async function update(id: string, data: Partial<Goal>) {
    await fetch(`/api/goals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-caveat mb-1" style={{ fontSize: 48, color: "var(--ink)" }}>Goals 2026</h1>
      <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>{goals.length} goals tracked</p>

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Add a goal…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }}
        />
        <button onClick={add} className="px-4 py-2.5 rounded-xl text-sm" style={{ background: "var(--ink)", color: "var(--bg)" }}>Add</button>
      </div>

      {loading && <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>Loading…</p>}

      {!loading && goals.length === 0 && (
        <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>No goals yet. Add one above.</p>
      )}

      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="p-5 rounded-2xl group" style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
            <div className="flex items-start justify-between gap-4 mb-3">
              {editId === goal.id ? (
                <input
                  autoFocus
                  defaultValue={goal.title}
                  onBlur={(e) => { update(goal.id, { title: e.target.value }); setEditId(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { update(goal.id, { title: (e.target as HTMLInputElement).value }); setEditId(null); } if (e.key === "Escape") setEditId(null); }}
                  className="flex-1 text-sm font-medium outline-none"
                  style={{ background: "transparent", color: "var(--ink)", borderBottom: "1px solid var(--line)" }}
                />
              ) : (
                <span
                  className="flex-1 text-sm font-medium cursor-text"
                  style={{ color: "var(--ink)" }}
                  onClick={() => setEditId(goal.id)}
                >
                  {goal.title}
                </span>
              )}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditId(goal.id)} className="text-xs" style={{ color: "var(--dim)" }} title="Edit">✎</button>
                <button onClick={() => remove(goal.id)} className="text-xs hover:text-red-400" style={{ color: "var(--dim)" }} title="Delete">✕</button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%`, background: "var(--accent)" }}
                />
              </div>
              <span className="text-xs font-mono w-8 text-right" style={{ color: "var(--dim)" }}>{goal.progress}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={goal.progress}
                onChange={(e) => update(goal.id, { progress: parseInt(e.target.value) })}
                className="w-24"
                style={{ accentColor: "var(--accent)" }}
              />
            </div>

            {/* Note */}
            <textarea
              placeholder="Add a note…"
              defaultValue={goal.note}
              onBlur={(e) => { if (e.target.value !== goal.note) update(goal.id, { note: e.target.value }); }}
              rows={1}
              className="w-full mt-3 text-xs outline-none resize-none"
              style={{ background: "transparent", color: "var(--dim)", borderTop: "1px solid var(--line)", paddingTop: 8 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
