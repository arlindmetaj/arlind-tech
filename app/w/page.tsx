"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isToday } from "date-fns";
import { ArrowUpRight } from "lucide-react";

interface Note {
  id: string;
  content: string;
  date: string;
}

interface Idea {
  id: string;
  content: string;
  createdAt: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  status: "READING" | "FINISHED" | "WANT";
  progress: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/notes").then((r) => r.json()),
      fetch("/api/ideas").then((r) => r.json()),
      fetch("/api/books").then((r) => r.json()),
    ]).then(([n, i, b]) => {
      setNotes(Array.isArray(n) ? n : []);
      setIdeas(Array.isArray(i) ? i : []);
      setBooks(Array.isArray(b) ? b : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const lastNote = [...notes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  // API returns ideas ordered by createdAt desc already.
  const recentIdeas = ideas.slice(0, 3);

  const readingBooks = books.filter((b) => b.status === "READING");
  const wantBooks = books.filter((b) => b.status === "WANT");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <div
      className="fixed left-0 lg:left-[220px] right-0 bottom-0 overflow-y-auto"
      style={{ top: 40 }}
    >
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">

        {/* Header */}
        <div className="mb-12">
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: "var(--dim)" }}
          >
            {today}
          </p>
          <h1
            className="font-caveat leading-none"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", color: "var(--ink)" }}
          >
            {greeting}, Arlind
          </h1>
        </div>

        {loading ? (
          <p className="text-sm" style={{ color: "var(--dim)" }}>Loading…</p>
        ) : (
          <div className="space-y-10">

            {/* Journal */}
            <button
              className="w-full text-left group"
              onClick={() => router.push("/w/journal")}
            >
              <SectionHead
                label="Journal"
                count={`${notes.length} ${notes.length === 1 ? "entry" : "entries"}`}
              />
              {!lastNote ? (
                <p className="text-sm" style={{ color: "var(--dim)" }}>
                  Nothing written yet — start today's entry.
                </p>
              ) : (
                <>
                  <p className="text-xs mb-2" style={{ color: "var(--dim)" }}>
                    {isToday(parseISO(lastNote.date))
                      ? "Today"
                      : format(parseISO(lastNote.date), "MMMM d, yyyy")}
                  </p>
                  <p
                    className="text-base whitespace-pre-wrap"
                    style={{
                      color: "var(--ink)",
                      lineHeight: 1.7,
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {lastNote.content}
                  </p>
                </>
              )}
            </button>

            <div style={{ borderTop: "1px solid var(--line)" }} />

            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10">

              {/* Ideas */}
              <button
                className="text-left group"
                onClick={() => router.push("/w/ideas")}
              >
                <SectionHead label="Ideas" count={`${ideas.length} captured`} />
                {recentIdeas.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--dim)" }}>
                    Capture your first idea.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {recentIdeas.map((idea) => (
                      <p
                        key={idea.id}
                        className="text-sm"
                        style={{
                          color: "var(--ink)",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {idea.content}
                      </p>
                    ))}
                  </div>
                )}
              </button>

              {/* Books */}
              <button
                className="text-left group"
                onClick={() => router.push("/w/books")}
              >
                <SectionHead
                  label="Books"
                  count={
                    readingBooks.length > 0
                      ? `${readingBooks.length} reading`
                      : `${books.length} total`
                  }
                />
                {readingBooks.length > 0 ? (
                  <div className="space-y-3">
                    {readingBooks.slice(0, 2).map((book) => (
                      <div key={book.id}>
                        <p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>
                          {book.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                            <div
                              className="h-1 rounded-full"
                              style={{ width: `${book.progress}%`, background: "var(--accent)" }}
                            />
                          </div>
                          <span className="text-xs font-mono shrink-0" style={{ color: "var(--dim)" }}>
                            {book.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : wantBooks[0] ? (
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--dim)" }}>Up next</p>
                    <p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>
                      {wantBooks[0].title}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: "var(--dim)" }}>No books yet.</p>
                )}
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHead({ label, count }: { label: string; count: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--dim)" }}>
        {label} · {count}
      </span>
      <ArrowUpRight
        size={14}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "var(--dim)" }}
      />
    </div>
  );
}
