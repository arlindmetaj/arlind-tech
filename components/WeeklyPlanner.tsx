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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Weekly Planner</h1>
          <p className="text-sm text-slate-400 mt-0.5">{format(new Date(), "MMMM yyyy")}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setWeekStart((w) => addDays(w, -7))} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">← Prev</button>
          <button onClick={() => { const today = new Date(); setWeekStart(startOfWeek(today, { weekStartsOn: 1 })); setSelectedDay(today); }} className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700">Today</button>
          <button onClick={() => setWeekStart((w) => addDays(w, 7))} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Next →</button>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex gap-2">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDay);
            const isToday = isSameDay(day, new Date());
            return (
              <button key={day.toISOString()} onClick={() => setSelectedDay(day)}
                className={`flex-1 flex flex-col items-center py-2.5 px-1 rounded-xl transition-all ${isSelected ? "bg-slate-900 text-white" : isToday ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50 text-slate-500"}`}>
                <span className="text-xs font-medium">{DAY_NAMES[getDay(day)]}</span>
                <span className="text-xl font-bold leading-tight mt-0.5">{format(day, "d")}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            {DAY_FULL[dayOfWeek]}
            {isSameDay(selectedDay, new Date()) && <span className="ml-2 text-sm font-normal text-slate-400">— Today</span>}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">{format(selectedDay, "MMMM d, yyyy")}</p>
          {total > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-slate-400 w-16 text-right">{doneCount}/{total} done</span>
            </div>
          )}
        </div>

        <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
          {(["routine", "notes"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "routine" && (
          <div className="space-y-2">
            {loading && <p className="text-slate-400 text-sm text-center py-8">Loading...</p>}
            {!loading && activities.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-8">No activities for {DAY_FULL[dayOfWeek]}. Add one below.</p>
            )}
            {activities.map((activity) => {
              const done = isDoneToday(activity);
              const isEditing = editingId === activity.id;
              return (
                <div key={activity.id} className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 group transition-all ${done ? "border-emerald-100" : "border-slate-200"}`}>
                  <button onClick={() => toggleActivity(activity)}
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 hover:border-emerald-400"}`}>
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
                      className="flex-1 text-sm outline-none border-b border-slate-300 pb-0.5" />
                  ) : (
                    <span className={`flex-1 text-sm ${done ? "line-through text-slate-400" : "text-slate-800"}`}>{activity.title}</span>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(activity.id); setEditingTitle(activity.title); }} className="text-slate-300 hover:text-slate-500 text-xs px-1" title="Edit">✎</button>
                    <button onClick={() => deleteActivity(activity.id)} className="text-slate-300 hover:text-red-400 text-xs px-1" title="Delete">✕</button>
                  </div>
                </div>
              );
            })}
            <div className="flex gap-2 mt-4">
              <input type="text" placeholder={`Add activity for ${DAY_FULL[dayOfWeek]}...`} value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addActivity()}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none placeholder-slate-400 focus:border-slate-400" />
              <button onClick={addActivity} className="px-4 py-2.5 bg-slate-900 text-white text-sm rounded-xl hover:bg-slate-700">Add</button>
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3">
              <textarea placeholder={`Notes for ${DAY_FULL[dayOfWeek]}...`} value={newNote}
                onChange={(e) => setNewNote(e.target.value)} rows={3}
                className="flex-1 outline-none text-sm placeholder-slate-400 resize-none" />
              <button onClick={addNote} className="px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg hover:bg-slate-700 self-end">Save</button>
            </div>
            {notes.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No notes for this day.</p>}
            {notes.map((note) => (
              <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3">
                <p className="flex-1 text-sm text-slate-700 whitespace-pre-wrap">{note.content}</p>
                <button onClick={() => deleteNote(note.id)} className="text-slate-300 hover:text-red-400 text-sm self-start">✕</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
