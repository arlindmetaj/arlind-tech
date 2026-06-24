"use client";

import { useState, useEffect, useRef } from "react";
import { Pin, Pencil, Trash2 } from "lucide-react";
import ErrorState from "@/components/ErrorState";
import { format } from "date-fns";

interface Memo {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const titleRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const data = await fetch("/api/memos").then((r) => r.json());
      setMemos(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        titleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function add() {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/memos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      setTitle("");
      setContent("");
      load();
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit(id: string) {
    await fetch(`/api/memos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle.trim(), content: editContent.trim() }),
    });
    setEditId(null);
    load();
  }

  async function togglePin(memo: Memo) {
    await fetch(`/api/memos/${memo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !memo.pinned }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/memos/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-caveat mb-1" style={{ fontSize: 48, color: "var(--ink)" }}>Notes</h1>
      <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>
        {memos.length} {memos.length === 1 ? "note" : "notes"} · ⌘N to start a new one
      </p>

      {/* Compose */}
      <div className="mb-8 p-4 rounded-2xl space-y-2" style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
        <input
          ref={titleRef}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-sm font-medium outline-none"
          style={{ background: "transparent", color: "var(--ink)" }}
        />
        <textarea
          placeholder="Write a note…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full text-sm outline-none resize-none"
          style={{ background: "transparent", color: "var(--ink)", lineHeight: 1.6 }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) add();
          }}
        />
        <div className="flex justify-end">
          <button
            onClick={add}
            disabled={saving || (!title.trim() && !content.trim())}
            className="px-4 py-1.5 rounded-xl text-sm disabled:opacity-40"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
          >
            {saving ? "Saving…" : "Add note"}
          </button>
        </div>
      </div>

      {loading && <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>Loading…</p>}
      {error && <ErrorState onRetry={load} />}

      {!loading && !error && memos.length === 0 && (
        <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>No notes yet. Add one above.</p>
      )}

      {/* Masonry-style columns */}
      <div className="gap-4" style={{ columnCount: 1, columnGap: "1rem" }}>
        <style>{`@media (min-width: 640px) { .notes-cols { column-count: 2; } } @media (min-width: 1024px) { .notes-cols { column-count: 3; } }`}</style>
        <div className="notes-cols">
          {memos.map((memo) => (
            <div
              key={memo.id}
              className="mb-4 rounded-2xl p-4 group"
              style={{
                border: "1px solid var(--line)",
                background: "var(--bg)",
                breakInside: "avoid",
                boxShadow: memo.pinned ? "inset 3px 0 0 0 var(--accent)" : "none",
              }}
            >
              {editId === memo.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full text-sm font-medium outline-none"
                    style={{ background: "transparent", color: "var(--ink)" }}
                  />
                  <textarea
                    autoFocus
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="w-full text-sm outline-none resize-none"
                    style={{ background: "transparent", color: "var(--ink)", lineHeight: 1.6 }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setEditId(null);
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveEdit(memo.id);
                    }}
                  />
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => setEditId(null)} className="text-xs" style={{ color: "var(--dim)" }}>Cancel</button>
                    <button
                      onClick={() => saveEdit(memo.id)}
                      className="text-xs px-3 py-1 rounded-lg"
                      style={{ background: "var(--ink)", color: "var(--bg)" }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {memo.title && (
                    <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--ink)" }}>{memo.title}</p>
                  )}
                  {memo.content && (
                    <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--dim)", lineHeight: 1.6 }}>{memo.content}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs" style={{ color: "var(--dim)" }}>
                      {format(new Date(memo.updatedAt), "MMM d")}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => togglePin(memo)}
                        className="icon-btn"
                        title={memo.pinned ? "Unpin" : "Pin"}
                        style={memo.pinned ? { color: "var(--accent)" } : undefined}
                      >
                        <Pin size={13} fill={memo.pinned ? "var(--accent)" : "none"} />
                      </button>
                      <button
                        onClick={() => { setEditId(memo.id); setEditTitle(memo.title); setEditContent(memo.content); }}
                        className="icon-btn"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => remove(memo.id)} className="icon-btn danger" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
