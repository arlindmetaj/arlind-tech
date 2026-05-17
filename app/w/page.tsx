export default function Dashboard() {
  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-8rem)] select-none">
      <p
        className="font-caveat leading-tight"
        style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "var(--ink)" }}
      >
        Hard work,<br />dedication<br />and perseverance.
      </p>
    </div>
  );
}
