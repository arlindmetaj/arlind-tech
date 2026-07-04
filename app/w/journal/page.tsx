"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ErrorState from "@/components/ErrorState";
import { format, parseISO } from "date-fns";

interface Note {
  id: string;
  content: string;
  date: string;
  createdAt: string;
}

function toDateInput(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function formatDisplay(dateStr: string) {
  return format(parseISO(dateStr), "EEEE, MMMM d, yyyy");
}

function autoGrow(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

export default function JournalPage() {
  const [notes, setNotes]     = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [content, setContent] = useState("");
  const [date, setDate]       = useState(toDateInput(new Date()));
  const [saving, setSaving]   = useState(false);
  const [editId, setEditId]   = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const composeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { autoGrow(composeRef.current); }, [content]);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const data = await fetch("/api/notes").then((r) => r.json());
      const sorted = (Array.isArray(data) ? data : []).sort(
        (a: Note, b: Note) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setNotes(sorted);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function save() {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), date }),
      });
      setContent("");
      load();
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit(id: string) {
    if (!editContent.trim()) return;
    await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent.trim() }),
    });
    setEditId(null);
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-caveat mb-1" style={{ fontSize: 48, color: "var(--ink)" }}>Journal</h1>
      <p className="text-sm mb-8" style={{ color: "var(--dim)" }}>{notes.length} {notes.length === 1 ? "entry" : "entries"}</p>

      {/* New entry */}
      <div className="rounded-2xl p-5 mb-10" style={{ border: "1px solid var(--line)" }}>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm outline-none"
            style={{ background: "transparent", color: "var(--dim)", border: "none" }}
          />
        </div>
        <textarea
          ref={composeRef}
          placeholder="Write something…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onInput={(e) => autoGrow(e.currentTarget)}
          rows={4}
          className="w-full text-sm outline-none resize-none overflow-hidden"
          style={{ background: "transparent", color: "var(--ink)", minHeight: "6rem" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
          }}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={save}
            disabled={saving || !content.trim()}
            className="px-4 py-2 rounded-xl text-sm disabled:opacity-40"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
          >
            {saving ? "Saving…" : "Save entry"}
          </button>
        </div>
      </div>

      {/* Entries */}
      {loading && <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>Loading…</p>}
      {error && <ErrorState onRetry={load} />}

      {!loading && notes.length === 0 && (
        <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>No entries yet.</p>
      )}

      <div className="space-y-6">
        {notes.map((note) => (
          <div key={note.id} className="group">
            <p className="text-xs font-medium mb-2" style={{ color: "var(--dim)" }}>
              {formatDisplay(note.date)}
            </p>
            <div className="rounded-2xl p-5" style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
              {editId === note.id ? (
                <textarea
                  ref={autoGrow}
                  autoFocus
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onInput={(e) => autoGrow(e.currentTarget)}
                  rows={4}
                  className="w-full text-sm outline-none resize-none overflow-hidden"
                  style={{ background: "transparent", color: "var(--ink)", minHeight: "6rem" }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setEditId(null);
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveEdit(note.id);
                  }}
                />
              ) : (
                <p
                  className="text-sm whitespace-pre-wrap cursor-text"
                  style={{ color: "var(--ink)", lineHeight: 1.7 }}
                  onClick={() => { setEditId(note.id); setEditContent(note.content); }}
                >
                  {note.content}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {editId === note.id ? (
                  <>
                    <button onClick={() => setEditId(null)} className="text-xs" style={{ color: "var(--dim)" }}>Cancel</button>
                    <button
                      onClick={() => saveEdit(note.id)}
                      className="text-xs px-3 py-1 rounded-lg"
                      style={{ background: "var(--ink)", color: "var(--bg)" }}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditId(note.id); setEditContent(note.content); }}
                      className="icon-btn"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => remove(note.id)}
                      className="icon-btn danger"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
