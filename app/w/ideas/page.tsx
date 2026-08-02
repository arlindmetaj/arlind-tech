"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import ErrorState from "@/components/ErrorState";
import { format } from "date-fns";

interface Idea {
  id: string;
  content: string;
  tags: string[];
  createdAt: string;
}

function autoGrow(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

function extractTags(text: string): string[] {
  const matches = text.match(/#(\w+)/g) || [];
  return Array.from(new Set(matches.map((t) => t.slice(1).toLowerCase())));
}

function renderContent(text: string) {
  return text.split(/(#\w+)/g).map((part, i) =>
    part.startsWith("#") ? (
      <span key={i} style={{ color: "var(--accent)" }}>{part}</span>
    ) : (
      part
    )
  );
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const captureRef = useRef<HTMLTextAreaElement>(null);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const data = await fetch("/api/ideas").then((r) => r.json());
      setIdeas(Array.isArray(data) ? data : []);
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
        captureRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function add() {
    if (!input.trim()) return;
    await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim(), tags: extractTags(input) }),
    });
    setInput("");
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/ideas/${id}`, { method: "DELETE" });
    load();
  }

  const allTags = Array.from(new Set(ideas.flatMap((i) => i.tags))).sort();
  const filtered = filterTag ? ideas.filter((i) => i.tags.includes(filterTag)) : ideas;

  return (
    <div>
      <h1 className="font-caveat mb-1" style={{ fontSize: 48, color: "var(--ink)" }}>Ideas</h1>
      <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>
        Quick capture — ⌘N to focus · use #tags inline
      </p>

      {/* Capture — borderless, bottom rule */}
      <div className="pb-5 mb-8" style={{ borderBottom: "1px solid var(--line)" }}>
        <textarea
          ref={captureRef}
          placeholder="Capture an idea… #tag anywhere in the text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={(e) => autoGrow(e.currentTarget)}
          rows={1}
          className="w-full text-base outline-none resize-none overflow-hidden"
          style={{ background: "transparent", color: "var(--ink)", lineHeight: 1.6 }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              add();
            }
          }}
        />
        {input.trim() && (
          <div className="flex justify-end mt-2">
            <button
              onClick={add}
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              Capture
            </button>
          </div>
        )}
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterTag(null)}
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
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className="text-xs px-3 py-1 rounded-full transition-colors"
              style={{
                background: filterTag === tag ? "var(--ink)" : "var(--hi)",
                color: filterTag === tag ? "var(--bg)" : "var(--dim)",
                border: "1px solid var(--line)",
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>Loading…</p>}
      {error && <ErrorState onRetry={load} />}

      {!loading && filtered.length === 0 && (
        <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>
          {filterTag ? `No ideas tagged #${filterTag}.` : "No ideas yet. Capture one above."}
        </p>
      )}

      <div className="space-y-5">
        {filtered.map((idea) => (
          <div
            key={idea.id}
            className="group flex gap-4 pb-5"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="text-base whitespace-pre-wrap break-words"
                style={{ color: "var(--ink)", lineHeight: 1.6 }}
              >
                {renderContent(idea.content)}
              </p>
              <span className="text-xs mt-2 block" style={{ color: "var(--dim)" }}>
                {format(new Date(idea.createdAt), "MMM d, yyyy")}
              </span>
            </div>
            <button
              onClick={() => remove(idea.id)}
              className="icon-btn danger opacity-0 group-hover:opacity-100 transition-opacity self-start"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
