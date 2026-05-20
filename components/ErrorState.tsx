export default function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-12 flex flex-col items-center gap-3">
      <p className="text-sm" style={{ color: "var(--dim)" }}>Something went wrong.</p>
      <button
        onClick={onRetry}
        className="text-xs px-4 py-2 rounded-xl"
        style={{ border: "1px solid var(--line)", color: "var(--ink)", background: "var(--bg)" }}
      >
        Try again
      </button>
    </div>
  );
}
