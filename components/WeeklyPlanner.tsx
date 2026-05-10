"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";

type Priority = "LOW" | "MEDIUM" | "HIGH";

interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  priority: Priority;
  category?: string;
}

interface Note {
  id: string;
  content: string;
  date: string;
}

interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  done: boolean;
}

interface Habit {
  id: string;
  name: string;
  logs: HabitLog[];
}

const priorityColors: Record<Priority, string> = {
  HIGH: "bg-red-100 border-red-300 text-red-700",
  MEDIUM: "bg-yellow-100 border-yellow-300 text-yellow-700",
  LOW: "bg-green-100 border-green-300 text-green-700",
};

const priorityDot: Record<Priority, string> = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-green-500",
};

export default function WeeklyPlanner() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tab, setTab] = useState<"tasks" | "notes" | "habits">("tasks");
  const [newTask, setNewTask] = useState({ title: "", priority: "MEDIUM" as Priority, category: "" });
  const [newNote, setNewNote] = useState("");
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dateStr = format(selectedDay, "yyyy-MM-dd");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [t, n, h] = await Promise.all([
      fetch(`/api/tasks?date=${dateStr}`).then((r) => r.json()),
      fetch(`/api/notes?date=${dateStr}`).then((r) => r.json()),
      fetch("/api/habits").then((r) => r.json()),
    ]);
    setTasks(t);
    setNotes(n);
    setHabits(h);
    setLoading(false);
  }, [dateStr]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function addTask() {
    if (!newTask.title.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newTask, date: dateStr }),
    });
    setNewTask({ title: "", priority: "MEDIUM", category: "" });
    fetchAll();
  }

  async function toggleTask(id: string, completed: boolean) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchAll();
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchAll();
  }

  async function addNote() {
    if (!newNote.trim()) return;
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newNote, date: dateStr }),
    });
    setNewNote("");
    fetchAll();
  }

  async function deleteNote(id: string) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    fetchAll();
  }

  async function addHabit() {
    if (!newHabit.trim()) return;
    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newHabit }),
    });
    setNewHabit("");
    fetchAll();
  }

  async function toggleHabit(habitId: string, currentDone: boolean) {
    await fetch(`/api/habits/${habitId}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: dateStr, done: !currentDone }),
    });
    fetchAll();
  }

  async function deleteHabit(id: string) {
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
    fetchAll();
  }

  function habitDoneToday(habit: Habit) {
    return habit.logs.some(
      (l) => isSameDay(parseISO(l.date), selectedDay) && l.done
    );
  }

  function taskCountForDay(day: Date) {
    return tasks.filter((t) => isSameDay(parseISO(t.date), day)).length;
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Weekly Planner</h1>
          <p className="text-sm text-slate-500">{format(new Date(), "MMMM yyyy")}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setWeekStart((w) => addDays(w, -7))}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            ← Prev
          </button>
          <button
            onClick={() => {
              const today = new Date();
              setWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
              setSelectedDay(today);
            }}
            className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700"
          >
            Today
          </button>
          <button
            onClick={() => setWeekStart((w) => addDays(w, 7))}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Next →
          </button>
        </div>
      </header>

      {/* Week strip */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex gap-2">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDay);
            const isToday = isSameDay(day, new Date());
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-colors ${
                  isSelected
                    ? "bg-slate-900 text-white"
                    : isToday
                    ? "bg-slate-100 text-slate-900"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <span className="text-xs font-medium">{format(day, "EEE")}</span>
                <span className={`text-lg font-bold leading-tight ${isSelected ? "text-white" : ""}`}>
                  {format(day, "d")}
                </span>
                {taskCountForDay(day) > 0 && (
                  <span className={`text-xs mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                    {taskCountForDay(day)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Day heading + progress */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {isSameDay(selectedDay, new Date()) ? "Today — " : ""}
              {format(selectedDay, "EEEE, MMMM d")}
            </h2>
            {tasks.length > 0 && (
              <p className="text-sm text-slate-500 mt-0.5">
                {completedCount} / {tasks.length} tasks done
              </p>
            )}
          </div>
          {tasks.length > 0 && (
            <div className="w-24 bg-slate-200 rounded-full h-2">
              <div
                className="bg-slate-900 h-2 rounded-full transition-all"
                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
          {(["tasks", "notes", "habits"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && <p className="text-slate-400 text-sm">Loading...</p>}

        {/* Tasks tab */}
        {tab === "tasks" && (
          <div className="space-y-3">
            {/* Add task */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <input
                type="text"
                placeholder="Add a task..."
                value={newTask.title}
                onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="w-full outline-none text-sm placeholder-slate-400"
              />
              <div className="flex gap-2 items-center">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value as Priority }))}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                <input
                  type="text"
                  placeholder="Category (optional)"
                  value={newTask.category}
                  onChange={(e) => setNewTask((p) => ({ ...p, category: e.target.value }))}
                  className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none placeholder-slate-400"
                />
                <button
                  onClick={addTask}
                  className="px-3 py-1 bg-slate-900 text-white text-xs rounded-lg hover:bg-slate-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Task list */}
            {tasks.length === 0 && !loading && (
              <p className="text-center text-slate-400 text-sm py-8">No tasks for this day. Add one above.</p>
            )}
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-3 bg-white border rounded-xl p-4 ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    task.completed
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "border-slate-300 hover:border-slate-500"
                  }`}
                >
                  {task.completed && <span className="text-xs">✓</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                    {task.title}
                  </p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${priorityDot[task.priority]} mr-1`} />
                      {task.priority.toLowerCase()}
                    </span>
                    {task.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-300 hover:text-red-400 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Notes tab */}
        {tab === "notes" && (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-2">
              <textarea
                placeholder="Write a note for this day..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={2}
                className="flex-1 outline-none text-sm placeholder-slate-400 resize-none"
              />
              <button
                onClick={addNote}
                className="px-3 py-1 bg-slate-900 text-white text-xs rounded-lg hover:bg-slate-700 self-end"
              >
                Add
              </button>
            </div>
            {notes.length === 0 && !loading && (
              <p className="text-center text-slate-400 text-sm py-8">No notes for this day.</p>
            )}
            {notes.map((note) => (
              <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3">
                <p className="flex-1 text-sm text-slate-700 whitespace-pre-wrap">{note.content}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-slate-300 hover:text-red-400 text-sm self-start"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Habits tab */}
        {tab === "habits" && (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-2">
              <input
                type="text"
                placeholder="Add a new habit..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHabit()}
                className="flex-1 outline-none text-sm placeholder-slate-400"
              />
              <button
                onClick={addHabit}
                className="px-3 py-1 bg-slate-900 text-white text-xs rounded-lg hover:bg-slate-700"
              >
                Add
              </button>
            </div>
            {habits.length === 0 && !loading && (
              <p className="text-center text-slate-400 text-sm py-8">No habits yet. Add one above.</p>
            )}
            {habits.map((habit) => {
              const done = habitDoneToday(habit);
              return (
                <div key={habit.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                  <button
                    onClick={() => toggleHabit(habit.id, done)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                      done
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 hover:border-emerald-400"
                    }`}
                  >
                    {done && <span className="text-sm">✓</span>}
                  </button>
                  <span className={`flex-1 text-sm font-medium ${done ? "line-through text-slate-400" : "text-slate-900"}`}>
                    {habit.name}
                  </span>
                  <div className="flex gap-1">
                    {days.map((day) => {
                      const logged = habit.logs.some(
                        (l) => isSameDay(parseISO(l.date), day) && l.done
                      );
                      return (
                        <div
                          key={day.toISOString()}
                          title={format(day, "EEE d")}
                          className={`w-4 h-4 rounded-sm ${logged ? "bg-emerald-400" : "bg-slate-100"}`}
                        />
                      );
                    })}
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-slate-300 hover:text-red-400 text-sm"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
