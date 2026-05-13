"use client";

import { useState, useEffect } from "react";

type BookStatus = "READING" | "FINISHED" | "WANT";

interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  progress: number;
  finishedAt: string | null;
  createdAt: string;
}

const COLUMNS: { status: BookStatus; label: string; icon: string }[] = [
  { status: "READING", label: "Currently reading", icon: "📖" },
  { status: "FINISHED", label: "Finished", icon: "✓" },
  { status: "WANT", label: "Want to read", icon: "◇" },
];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingTo, setAddingTo] = useState<BookStatus | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [authorInput, setAuthorInput] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await fetch("/api/books").then((r) => r.json());
      setBooks(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function add(status: BookStatus) {
    if (!titleInput.trim()) return;
    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: titleInput.trim(), author: authorInput.trim(), status }),
    });
    setTitleInput("");
    setAuthorInput("");
    setAddingTo(null);
    load();
  }

  async function update(id: string, data: Partial<Book>) {
    await fetch(`/api/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-caveat mb-1" style={{ fontSize: 48, color: "var(--ink)" }}>Books</h1>
      <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>Reading log</p>

      {loading && <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>Loading…</p>}

      {!loading && (
        <div className="grid grid-cols-3 gap-5">
          {COLUMNS.map(({ status, label, icon }) => {
            const col = books.filter((b) => b.status === status);
            return (
              <div key={status}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--dim)" }}>
                    {icon} {label}
                  </h2>
                  <button
                    onClick={() => setAddingTo(addingTo === status ? null : status)}
                    className="text-xs px-2 py-0.5 rounded-lg transition-colors"
                    style={{ color: "var(--accent)", background: "var(--hi)" }}
                  >
                    + Add
                  </button>
                </div>

                {/* Add form */}
                {addingTo === status && (
                  <div className="mb-3 p-3 rounded-xl space-y-2" style={{ border: "1px solid var(--line)", background: "var(--hi)" }}>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Title"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && add(status)}
                      className="w-full text-sm outline-none"
                      style={{ background: "transparent", color: "var(--ink)" }}
                    />
                    <input
                      type="text"
                      placeholder="Author"
                      value={authorInput}
                      onChange={(e) => setAuthorInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && add(status)}
                      className="w-full text-xs outline-none"
                      style={{ background: "transparent", color: "var(--dim)" }}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => add(status)} className="text-xs px-3 py-1 rounded-lg" style={{ background: "var(--ink)", color: "var(--bg)" }}>Save</button>
                      <button onClick={() => { setAddingTo(null); setTitleInput(""); setAuthorInput(""); }} className="text-xs px-2 py-1 rounded-lg" style={{ color: "var(--dim)" }}>Cancel</button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {col.length === 0 && !addingTo && (
                    <p className="text-xs py-4 text-center" style={{ color: "var(--dim)" }}>Empty</p>
                  )}
                  {col.map((book) => (
                    <div key={book.id} className="p-3 rounded-xl group" style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>{book.title}</p>
                          {book.author && <p className="text-xs truncate mt-0.5" style={{ color: "var(--dim)" }}>{book.author}</p>}
                        </div>
                        <button onClick={() => remove(book.id)} className="text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:text-red-400" style={{ color: "var(--dim)" }}>✕</button>
                      </div>

                      {/* Progress for READING */}
                      {book.status === "READING" && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${book.progress}%`, background: "var(--accent)" }} />
                            </div>
                            <span className="text-xs font-mono" style={{ color: "var(--dim)" }}>{book.progress}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={book.progress}
                            onChange={(e) => update(book.id, { progress: parseInt(e.target.value) })}
                            className="w-full mt-1"
                            style={{ accentColor: "var(--accent)" }}
                          />
                        </div>
                      )}

                      {/* Move to status */}
                      <div className="mt-2 flex gap-1 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {COLUMNS.filter((c) => c.status !== book.status).map((c) => (
                          <button
                            key={c.status}
                            onClick={() => update(book.id, { status: c.status })}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: "var(--hi)", color: "var(--dim)", border: "1px solid var(--line)" }}
                          >
                            → {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
