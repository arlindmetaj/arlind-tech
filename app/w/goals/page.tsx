"use client";

import { useState, useEffect } from "react";

type GoalCategory = "PROFESSIONAL" | "PERSONAL";

interface Goal {
  id: string;
  title: string;
  progress: number;
  note: string;
  order: number;
  category: GoalCategory;
}

const TABS: { key: GoalCategory; label: string }[] = [
  { key: "PROFESSIONAL", label: "Professional" },
  { key: "PERSONAL",     label: "Personal" },
];

function GoalCard({
  goal,
  onUpdate,
  onRemove,
}: {
  goal: Goal;
  onUpdate: (id: string, data: Partial<Goal>) => void;
  onRemove: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="p-5 rounded-2xl group" style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
      <div className="flex items-start justify-between gap-4 mb-3">
        {editing ? (
          <input
            autoFocus
            defaultValue={goal.title}
            onBlur={(e) => { onUpdate(goal.id, { title: e.target.value }); setEditing(false); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { onUpdate(goal.id, { title: (e.target as HTMLInputElement).value }); setEditing(false); }
              if (e.key === "Escape") setEditing(false);
            }}
            className="flex-1 text-sm font-medium outline-none"
            style={{ background: "transparent", color: "var(--ink)", borderBottom: "1px solid var(--line)" }}
          />
        ) : (
          <span
            className="flex-1 text-sm font-medium cursor-text"
            style={{ color: "var(--ink)" }}
            onClick={() => setEditing(true)}
          >
            {goal.title}
          </span>
        )}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onUpdate(goal.id, { category: goal.category === "PROFESSIONAL" ? "PERSONAL" : "PROFESSIONAL" })}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--line)", color: "var(--dim)" }}
            title="Move to other category"
          >
            → {goal.category === "PROFESSIONAL" ? "Personal" : "Professional"}
          </button>
          <button onClick={() => setEditing(true)} className="text-xs" style={{ color: "var(--dim)" }} title="Edit">✎</button>
          <button onClick={() => onRemove(goal.id)} className="text-xs hover:text-red-400" style={{ color: "var(--dim)" }} title="Delete">✕</button>
        </div>
      </div>

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
          onChange={(e) => onUpdate(goal.id, { progress: parseInt(e.target.value) })}
          className="w-24"
          style={{ accentColor: "var(--accent)" }}
        />
      </div>

      <textarea
        placeholder="Add a note…"
        defaultValue={goal.note}
        onBlur={(e) => { if (e.target.value !== goal.note) onUpdate(goal.id, { note: e.target.value }); }}
        rows={1}
        className="w-full mt-3 text-xs outline-none resize-none"
        style={{ background: "transparent", color: "var(--dim)", borderTop: "1px solid var(--line)", paddingTop: 8 }}
      />
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals]     = useState<Goal[]>([]);
  const [tab, setTab]         = useState<GoalCategory>("PROFESSIONAL");
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(true);

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
      body: JSON.stringify({ title: input.trim(), category: tab }),
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

  const visible = goals.filter((g) => g.category === tab);

  return (
    <div>
      <h1 className="font-caveat mb-1" style={{ fontSize: 48, color: "var(--ink)" }}>Goals 2026</h1>
      <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>{goals.length} goals tracked</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 0 }}>
        {TABS.map((t) => {
          const count = goals.filter((g) => g.category === t.key).length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-4 py-2 text-sm font-medium relative transition-colors"
              style={{
                color: active ? "var(--ink)" : "var(--dim)",
                borderBottom: active ? "2px solid var(--ink)" : "2px solid transparent",
                marginBottom: -1,
                background: "transparent",
              }}
            >
              {t.label}
              <span
                className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: "var(--line)", color: "var(--dim)" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder={`Add a ${tab === "PROFESSIONAL" ? "professional" : "personal"} goal…`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }}
        />
        <button
          onClick={add}
          className="px-4 py-2.5 rounded-xl text-sm"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          Add
        </button>
      </div>

      {loading && <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>Loading…</p>}

      {!loading && visible.length === 0 && (
        <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>
          No {tab === "PROFESSIONAL" ? "professional" : "personal"} goals yet.
        </p>
      )}

      {!loading && (
        <div className="space-y-4">
          {visible.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onUpdate={update} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
