"use client";

import { useState, useEffect, useRef } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import ErrorState from "@/components/ErrorState";

interface Todo {
  id: string;
  title: string;
  done: boolean;
  order: number;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dragId = useRef<string | null>(null);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const data = await fetch("/api/todos").then((r) => r.json());
      setTodos(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!input.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input.trim() }),
    });
    setInput("");
    load();
  }

  async function toggle(todo: Todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    load();
  }

  function onDragStart(id: string) {
    dragId.current = id;
  }

  function onDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault();
    if (!dragId.current || dragId.current === overId) return;
    const from = todos.findIndex((t) => t.id === dragId.current);
    const to   = todos.findIndex((t) => t.id === overId);
    if (from === -1 || to === -1) return;
    const reordered = [...todos];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setTodos(reordered);
  }

  async function onDrop() {
    if (!dragId.current) return;
    // Persist new order for all open todos
    const open = todos.filter((t) => !t.done);
    await Promise.all(
      open.map((t, i) =>
        fetch(`/api/todos/${t.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        })
      )
    );
    dragId.current = null;
  }

  const open = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);

  return (
    <div>
      <h1 className="font-caveat mb-1" style={{ fontSize: 48, color: "var(--ink)" }}>Todos</h1>
      <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>{open.length} remaining</p>

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Add a todo… (Enter)"
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
      {error && <ErrorState onRetry={load} />}

      {!loading && !error && (
        <div className="space-y-2">
          {open.length === 0 && done.length === 0 && (
            <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>No todos yet. Add one above.</p>
          )}

          {open.map((todo) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              draggable
              onDragStart={() => onDragStart(todo.id)}
              onDragOver={(e) => onDragOver(e, todo.id)}
              onDrop={onDrop}
              onToggle={toggle}
              onDelete={remove}
            />
          ))}

          {done.length > 0 && (
            <>
              <p className="text-xs pt-4 pb-1 font-semibold uppercase tracking-widest" style={{ color: "var(--dim)" }}>
                Done ({done.length})
              </p>
              {done.map((todo) => (
                <TodoRow key={todo.id} todo={todo} onToggle={toggle} onDelete={remove} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TodoRow({
  todo,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
  onToggle: (t: Todo) => void;
  onDelete: (id: string) => void;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable={draggable}
      onDragStart={() => { setDragging(true); onDragStart?.(); }}
      onDragEnd={() => setDragging(false)}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="flex items-center gap-3 px-4 py-3 rounded-xl group transition-all"
      style={{
        border: "1px solid var(--line)",
        background: "var(--bg)",
        opacity: dragging ? 0.4 : 1,
        cursor: draggable ? "grab" : "default",
      }}
    >
      {draggable && (
        <span className="opacity-0 group-hover:opacity-40 transition-opacity select-none flex items-center" style={{ color: "var(--dim)" }}>
          <GripVertical size={14} />
        </span>
      )}
      <button
        onClick={() => onToggle(todo)}
        className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
        style={{
          background: todo.done ? "#10b981" : "transparent",
          borderColor: todo.done ? "#10b981" : "var(--line)",
          color: "#fff",
        }}
      >
        {todo.done && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span
        className="flex-1 text-sm"
        style={{
          color: todo.done ? "var(--dim)" : "var(--ink)",
          textDecoration: todo.done ? "line-through" : "none",
        }}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="icon-btn danger opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
