"use client";

import { useState, useEffect, useRef } from "react";
import ErrorState from "@/components/ErrorState";
import { format } from "date-fns";

interface Idea {
  id: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [input, setInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const captureRef = useRef<HTMLInputElement>(null);

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
    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim(), tags }),
    });
    setInput("");
    setTagInput("");
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/ideas/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-caveat mb-1" style={{ fontSize: 48, color: "var(--ink)" }}>Ideas</h1>
      <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>Quick capture — ⌘N to focus</p>

      {/* Capture bar */}
      <div className="mb-8 p-4 rounded-2xl space-y-3" style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
        <input
          ref={captureRef}
          type="text"
          placeholder="Capture an idea… (Enter to save)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="w-full text-sm outline-none"
          style={{ background: "transparent", color: "var(--ink)" }}
        />
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Tags: design, build, read (comma separated)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="flex-1 text-xs outline-none"
            style={{ background: "transparent", color: "var(--dim)" }}
          />
          <button
            onClick={add}
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
          >
            Capture
          </button>
        </div>
      </div>

      {loading && <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>Loading…</p>}
      {error && <ErrorState onRetry={load} />}

      {!loading && ideas.length === 0 && (
        <p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>No ideas yet. Capture one above.</p>
      )}

      <div className="space-y-3">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="p-4 rounded-xl group flex gap-4"
            style={{ border: "1px solid var(--line)", background: "var(--bg)" }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm" style={{ color: "var(--ink)", lineHeight: 1.6 }}>{idea.content}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs" style={{ color: "var(--dim)" }}>
                  {format(new Date(idea.createdAt), "MMM d, yyyy")}
                </span>
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "var(--hi)", color: "var(--dim)", border: "1px solid var(--line)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => remove(idea.id)}
              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity self-start hover:text-red-400"
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
