"use client";

import { useState, useEffect } from "react";
import ErrorState from "@/components/ErrorState";
import { format } from "date-fns";

interface Bookmark {
  id: string;
  url: string;
  title: string;
  tags: string[];
  createdAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [filterTag, setFilterTag] = useState("");

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const data = await fetch("/api/bookmarks").then((r) => r.json());
      setBookmarks(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!urlInput.trim() || !titleInput.trim()) return;
    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlInput.trim(), title: titleInput.trim(), tags }),
    });
    setUrlInput("");
    setTitleInput("");
    setTagInput("");
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
    load();
  }

  const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags))).sort();
  const filtered = filterTag ? bookmarks.filter((b) => b.tags.includes(filterTag)) : bookmarks;

  return (
    <div>
      <h1 className="font-caveat mb-1" style={{ fontSize: 48, color: "var(--ink)" }}>Bookmarks</h1>
      <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>{bookmarks.length} saved links</p>

      {/* Add form */}
      <div className="p-4 rounded-2xl space-y-3 mb-8" style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="url"
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="text-sm outline-none px-3 py-2 rounded-lg"
            style={{ border: "1px solid var(--line)", background: "var(--hi)", color: "var(--ink)" }}
          />
          <input
            type="text"
            placeholder="Title"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="text-sm outline-none px-3 py-2 rounded-lg"
            style={{ border: "1px solid var(--line)", background: "var(--hi)", color: "var(--ink)" }}
          />
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Tags: design, tool, read (comma separated)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="flex-1 text-xs outline-none px-3 py-1.5 rounded-lg"
            style={{ border: "1px solid var(--line)", background: "var(--hi)", color: "var(--dim)" }}
          />
          <button onClick={add} className="px-4 py-1.5 rounded-lg text-sm" style={{ background: "var(--ink)", color: "var(--bg)" }}>Save</button>
        </div>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setFilterTag("")}
            className="text-xs px-3 py-1 rounded-full transition-colors"
            style={{
              background: !filterTag ? "var(--ink)" : "var(--hi)",
              color: !filterTag ? "var(--bg)" : "var(--dim)",
              border: "1px solid var(--line)",
            }}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? "" : tag)}
              className="text-xs px-3 py-1 rounded-full transition-colors"
              style={{
                background: filterTag === tag ? "var(--ink)" : "var(--hi)",
                color: filterTag === tag ? "var(--bg)" : "var(--dim)",
                border: "1px solid var(--line)",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>Loading…</p>}
      {error && <ErrorState onRetry={load} />}

      {!loading && filtered.length === 0 && (
        <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>No bookmarks yet.</p>
      )}

      <div className="space-y-2">
        {filtered.map((bm) => (
          <div
            key={bm.id}
            className="flex items-center gap-4 px-4 py-3 rounded-xl group"
            style={{ border: "1px solid var(--line)", background: "var(--bg)" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <a
                  href={bm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium truncate hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  {bm.title}
                </a>
                <span className="text-xs shrink-0" style={{ color: "var(--dim)" }}>↗</span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs truncate max-w-xs" style={{ color: "var(--dim)" }}>{bm.url}</span>
                <span className="text-xs" style={{ color: "var(--dim)" }}>·</span>
                <span className="text-xs" style={{ color: "var(--dim)" }}>{format(new Date(bm.createdAt), "MMM d")}</span>
                {bm.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--hi)", color: "var(--dim)", border: "1px solid var(--line)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => remove(bm.id)}
              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
              style={{ color: "var(--dim)" }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
