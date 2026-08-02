"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

type BookStatus = "READING" | "FINISHED" | "WANT";

interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  progress: number;
  createdAt: string;
}

const TABS: { status: BookStatus | "ALL"; label: string }[] = [
  { status: "ALL",      label: "All" },
  { status: "READING",  label: "Reading" },
  { status: "WANT",     label: "Want to read" },
  { status: "FINISHED", label: "Finished" },
];

const STATUS_LABELS: Record<BookStatus, string> = {
  READING:  "Reading",
  WANT:     "Want to read",
  FINISHED: "Finished",
};

const COVER_COLORS = [
  "#3B5BDB", "#1098AD", "#0CA678", "#F76707",
  "#E03131", "#7048E8", "#D6336C", "#4263EB",
  "#2F9E44", "#E8590C", "#1C7ED6", "#862E9C",
];

function coverColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length];
}

export default function BooksPage() {
  const [books, setBooks]       = useState<Book[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<BookStatus | "ALL">("ALL");
  const [showAdd, setShowAdd]   = useState(false);
  const [selected, setSelected] = useState<Book | null>(null);

  const [titleInput,  setTitleInput]  = useState("");
  const [authorInput, setAuthorInput] = useState("");
  const [statusInput, setStatusInput] = useState<BookStatus>("WANT");

  async function load() {
    try {
      const res = await fetch("/api/books");
      if (!res.ok) { setLoading(false); return; }
      const text = await res.text();
      if (!text) { setLoading(false); return; }
      const data = JSON.parse(text);
      setBooks(Array.isArray(data) ? data : []);
    } catch {
      // DB not available or network error — show empty state
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = tab === "ALL" ? books : books.filter((b) => b.status === tab);

  async function add() {
    if (!titleInput.trim()) return;
    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title:  titleInput.trim(),
        author: authorInput.trim(),
        status: statusInput,
      }),
    });
    setTitleInput("");
    setAuthorInput("");
    setStatusInput("WANT");
    setShowAdd(false);
    load();
  }

  async function update(id: string, data: Partial<Book>) {
    await fetch(`/api/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSelected(null);
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-caveat mb-1" style={{ fontSize: 48, color: "var(--ink)" }}>
          Books
        </h1>
        <p className="text-sm" style={{ color: "var(--dim)" }}>
          {books.length} book{books.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.status}
            onClick={() => setTab(t.status)}
            className="px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{
              color:      tab === t.status ? "var(--accent)" : "var(--dim)",
              background: tab === t.status ? "var(--hi)"    : "transparent",
              fontWeight: tab === t.status ? 500             : 400,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>Loading…</p>
      )}

      {/* Card grid */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Add tile */}
          <button
            onClick={() => setShowAdd(true)}
            className="aspect-[2/3] rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors"
            style={{ border: "1px dashed var(--line)", color: "var(--dim)" }}
          >
            <Plus size={20} />
            <span className="text-xs font-medium">Add book</span>
          </button>

          {filtered.map((book) => {
            const color = coverColor(book.title);
            return (
              <button
                key={book.id}
                onClick={() => setSelected(book)}
                className="group text-left rounded-2xl overflow-hidden transition-all duration-150 hover:-translate-y-1"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              >
                <div
                  className="aspect-[2/3] relative flex flex-col justify-end p-3"
                  style={{ background: color }}
                >
                  {/* Status badge */}
                  <span
                    className="absolute top-2.5 left-2.5 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(0,0,0,0.22)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {STATUS_LABELS[book.status]}
                  </span>

                  {/* Progress bar — reading only */}
                  {book.status === "READING" && (
                    <div
                      className="mb-2 h-1 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.2)" }}
                    >
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${book.progress}%`,
                          background: "rgba(255,255,255,0.8)",
                        }}
                      />
                    </div>
                  )}

                  {/* Title + author */}
                  <p
                    className="text-sm font-semibold leading-snug"
                    style={{ color: "rgba(255,255,255,0.95)" }}
                  >
                    {book.title}
                  </p>
                  {book.author && (
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {book.author}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Add modal ─────────────────────────────── */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowAdd(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold" style={{ color: "var(--ink)" }}>Add a book</h2>
              <button onClick={() => setShowAdd(false)} style={{ color: "var(--dim)" }}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-widest block mb-1"
                  style={{ color: "var(--dim)" }}
                >
                  Title
                </label>
                <input
                  autoFocus
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && add()}
                  placeholder="Book title"
                  className="w-full text-sm outline-none rounded-lg px-3 py-2"
                  style={{
                    background: "var(--hi)",
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                  }}
                />
              </div>
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-widest block mb-1"
                  style={{ color: "var(--dim)" }}
                >
                  Author
                </label>
                <input
                  type="text"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && add()}
                  placeholder="Author name"
                  className="w-full text-sm outline-none rounded-lg px-3 py-2"
                  style={{
                    background: "var(--hi)",
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                  }}
                />
              </div>
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-widest block mb-1"
                  style={{ color: "var(--dim)" }}
                >
                  Status
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as BookStatus)}
                  className="w-full text-sm outline-none rounded-lg px-3 py-2"
                  style={{
                    background: "var(--hi)",
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                  }}
                >
                  <option value="WANT">Want to read</option>
                  <option value="READING">Reading</option>
                  <option value="FINISHED">Finished</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={add}
                className="flex-1 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-75"
                style={{ background: "var(--ink)", color: "var(--bg)" }}
              >
                Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-xl text-sm"
                style={{ color: "var(--dim)", background: "var(--hi)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail / edit modal ───────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover preview */}
            <div
              className="h-36 relative flex flex-col justify-end p-4"
              style={{ background: coverColor(selected.title) }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                <X size={16} />
              </button>
              <p
                className="font-semibold leading-snug"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                {selected.title}
              </p>
              {selected.author && (
                <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {selected.author}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 space-y-4" style={{ background: "var(--bg)" }}>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: "var(--dim)" }}
                >
                  Status
                </p>
                <div className="flex flex-col gap-1.5">
                  {(["WANT", "READING", "FINISHED"] as BookStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => update(selected.id, { status: s })}
                      className="text-left px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{
                        background: selected.status === s ? "var(--hi)"    : "transparent",
                        color:      selected.status === s ? "var(--accent)" : "var(--ink)",
                        fontWeight: selected.status === s ? 500              : 400,
                        border:     "1px solid var(--line)",
                      }}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress slider — reading only */}
              {selected.status === "READING" && (
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: "var(--dim)" }}
                  >
                    Progress — {selected.progress}%
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={selected.progress}
                    onChange={(e) =>
                      setSelected({ ...selected, progress: parseInt(e.target.value) })
                    }
                    onMouseUp={(e) =>
                      update(selected.id, {
                        progress: parseInt((e.target as HTMLInputElement).value),
                      })
                    }
                    onTouchEnd={(e) =>
                      update(selected.id, {
                        progress: parseInt((e.target as HTMLInputElement).value),
                      })
                    }
                    className="w-full"
                    style={{ accentColor: "var(--accent)" }}
                  />
                </div>
              )}

              <button
                onClick={() => remove(selected.id)}
                className="w-full py-2 rounded-xl text-sm transition-opacity hover:opacity-75"
                style={{
                  color: "#ef4444",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                Remove book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
