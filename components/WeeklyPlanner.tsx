"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO, getDay } from "date-fns";

interface ActivityCompletion {
  id: string;
  activityId: string;
  date: string;
  done: boolean;
}

interface RoutineActivity {
  id: string;
  dayOfWeek: number;
  title: string;
  order: number;
  completions: ActivityCompletion[];
}

interface Note {
  id: string;
  content: string;
  date: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function WeeklyPlanner() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [activities, setActivities] = useState<RoutineActivity[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tab, setTab] = useState<"routine" | "notes">("routine");
  const [newActivity, setNewActivity] = useState("");
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [seeded, setSeeded] = useState(false);
  const [loading, setLoading] = useState(true);

  const dayOfWeek = getDay(selectedDay);
  const dateStr = format(selectedDay, "yyyy-MM-dd");
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [a, n] = await Promise.all([
        fetch(`/api/routine?day=${dayOfWeek}`).then((r) => r.json()),
        fetch(`/api/notes?date=${dateStr}`).then((r) => r.json()),
      ]);
      setActivities(Array.isArray(a) ? a : []);
      setNotes(Array.isArray(n) ? n : []);
    } catch {
      setActivities([]);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [dayOfWeek, dateStr]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!seeded) {
      fetch("/api/seed", { method: "POST" })
        .catch(() => {})
        .finally(() => {
          setSeeded(true);
          fetchData();
        });
    }
  }, [seeded, fetchData]);

  function isDoneToday(activity: RoutineActivity) {
    return activity.completions.some(
      (c) => isSameDay(parseISO(c.date), selectedDay) && c.done
    );
  }

  async function toggleActivity(activity: RoutineActivity) {
    const done = isDoneToday(activity);
    await fetch(`/api/routine/${activity.id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: dateStr, done: !done }),
    });
    fetchData();
  }

  async function addActivity() {
    if (!newActivity.trim()) return;
    await fetch("/api/routine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newActivity.trim(), dayOfWeek }),
    });
    setNewActivity("");
    fetchData();
  }

  async function deleteActivity(id: string) {
    await fetch(`/api/routine/${id}`, { method: "DELETE" });
    fetchData();
  }

  async function saveEdit(id: string) {
    if (!editingTitle.trim()) return;
    await fetch(`/api/routine/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle.trim() }),
    });
    setEditingId(null);
    fetchData();
  }

  async function addNote() {
    if (!newNote.trim()) return;
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newNote, date: dateStr }),
    });
    setNewNote("");
    fetchData();
  }

  async function deleteNote(id: string) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    fetchData();
  }

  const doneCount = activities.filter(isDoneToday).length;
  const total = activities.length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-caveat" style={{ fontSize: 40, color: "var(--ink)" }}>This week</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--dim)" }}>{format(new Date(), "MMMM yyyy")}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setWeekStart((w) => addDays(w, -7))} className="px-3 py-1.5 text-sm rounded-lg transition-colors" style={{ border: "1px solid var(--line)", color: "var(--ink)", background: "var(--bg)" }}>← Prev</button>
          <button onClick={() => { const today = new Date(); setWeekStart(startOfWeek(today, { weekStartsOn: 1 })); setSelectedDay(today); }} className="px-3 py-1.5 text-sm rounded-lg" style={{ background: "var(--ink)", color: "var(--bg)" }}>Today</button>
          <button onClick={() => setWeekStart((w) => addDays(w, 7))} className="px-3 py-1.5 text-sm rounded-lg transition-colors" style={{ border: "1px solid var(--line)", color: "var(--ink)", background: "var(--bg)" }}>Next →</button>
        </div>
      </div>

      <div className="rounded-2xl mb-4 py-2 px-1" style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
        <div className="flex gap-2">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDay);
            const isToday = isSameDay(day, new Date());
            return (
              <button key={day.toISOString()} onClick={() => setSelectedDay(day)}
                className="flex-1 flex flex-col items-center py-2.5 px-1 rounded-xl transition-all"
                style={{
                  background: isSelected ? "var(--ink)" : isToday ? "var(--hi)" : "transparent",
                  color: isSelected ? "var(--bg)" : "var(--ink)",
                }}>
                <span className="text-xs font-medium">{DAY_NAMES[getDay(day)]}</span>
                <span className="text-xl font-bold leading-tight mt-0.5">{format(day, "d")}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="py-2">
        <div className="mb-5">
          <h2 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>
            {DAY_FULL[dayOfWeek]}
            {isSameDay(selectedDay, new Date()) && <span className="ml-2 text-sm font-normal" style={{ color: "var(--dim)" }}>— Today</span>}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--dim)" }}>{format(selectedDay, "MMMM d, yyyy")}</p>
          {total > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 rounded-full h-1.5" style={{ background: "var(--line)" }}>
                <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "#10b981" }} />
              </div>
              <span className="text-xs w-16 text-right" style={{ color: "var(--dim)" }}>{doneCount}/{total} done</span>
            </div>
          )}
        </div>

        <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: "var(--hi)" }}>
          {(["routine", "notes"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors"
              style={{
                background: tab === t ? "var(--bg)" : "transparent",
                color: tab === t ? "var(--ink)" : "var(--dim)",
                boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}>
              {t}
            </button>
          ))}
        </div>

        {tab === "routine" && (
          <div className="space-y-2">
            {loading && <p className="text-sm text-center py-8" style={{ color: "var(--dim)" }}>Loading...</p>}
            {!loading && activities.length === 0 && (
              <p className="text-center text-sm py-8" style={{ color: "var(--dim)" }}>No activities for {DAY_FULL[dayOfWeek]}. Add one below.</p>
            )}
            {activities.map((activity) => {
              const done = isDoneToday(activity);
              const isEditing = editingId === activity.id;
              return (
                <div key={activity.id} className="flex items-center gap-3 rounded-xl px-4 py-3 group transition-all"
                  style={{ border: `1px solid ${done ? "#a7f3d0" : "var(--line)"}`, background: "var(--bg)" }}>
                  <button onClick={() => toggleActivity(activity)}
                    className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                    style={{ background: done ? "#10b981" : "transparent", borderColor: done ? "#10b981" : "var(--line)", color: "#fff" }}>
                    {done && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  {isEditing ? (
                    <input autoFocus value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(activity.id); if (e.key === "Escape") setEditingId(null); }}
                      onBlur={() => saveEdit(activity.id)}
                      className="flex-1 text-sm outline-none pb-0.5" style={{ borderBottom: "1px solid var(--line)", color: "var(--ink)", background: "transparent" }} />
                  ) : (
                    <span className="flex-1 text-sm" style={{ color: done ? "var(--dim)" : "var(--ink)", textDecoration: done ? "line-through" : "none" }}>{activity.title}</span>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(activity.id); setEditingTitle(activity.title); }} className="text-xs px-1" style={{ color: "var(--dim)" }} title="Edit">✎</button>
                    <button onClick={() => deleteActivity(activity.id)} className="text-xs px-1 hover:text-red-400" style={{ color: "var(--dim)" }} title="Delete">✕</button>
                  </div>
                </div>
              );
            })}
            <div className="flex gap-2 mt-4">
              <input type="text" placeholder={`Add activity for ${DAY_FULL[dayOfWeek]}...`} value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addActivity()}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }} />
              <button onClick={addActivity} className="px-4 py-2.5 text-sm rounded-xl" style={{ background: "var(--ink)", color: "var(--bg)" }}>Add</button>
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div className="space-y-3">
            <div className="rounded-xl p-4 flex gap-3" style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
              <textarea placeholder={`Notes for ${DAY_FULL[dayOfWeek]}...`} value={newNote}
                onChange={(e) => setNewNote(e.target.value)} rows={3}
                className="flex-1 outline-none text-sm resize-none" style={{ color: "var(--ink)", background: "transparent" }} />
              <button onClick={addNote} className="px-3 py-1.5 text-xs rounded-lg self-end" style={{ background: "var(--ink)", color: "var(--bg)" }}>Save</button>
            </div>
            {notes.length === 0 && <p className="text-center text-sm py-8" style={{ color: "var(--dim)" }}>No notes for this day.</p>}
            {notes.map((note) => (
              <div key={note.id} className="rounded-xl p-4 flex gap-3" style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
                <p className="flex-1 text-sm whitespace-pre-wrap" style={{ color: "var(--ink)" }}>{note.content}</p>
                <button onClick={() => deleteNote(note.id)} className="text-sm self-start hover:text-red-400" style={{ color: "var(--dim)" }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
